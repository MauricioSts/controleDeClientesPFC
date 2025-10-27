const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe.secret_key);

admin.initializeApp();

/**
 * Webhook do Stripe para atualizar assinatura do usuário
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verificar assinatura do webhook
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      functions.config().stripe.webhook_secret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook event type:', event.type);

  // Processar evento checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('No userId in metadata');
      return res.status(400).json({ error: 'No userId in metadata' });
    }

    try {
      // Atualizar status da assinatura no Firestore
      await admin.firestore().collection('users').doc(userId).set({
        subscription: {
          plan: 'pro',
          status: 'active',
          startDate: new Date(),
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        }
      }, { merge: true });

      console.log('Subscription activated for user:', userId);
    } catch (error) {
      console.error('Error updating Firestore:', error);
      return res.status(500).json({ error: 'Error updating subscription' });
    }
  }

  // Processar cancelamento de assinatura
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;

    try {
      // Buscar usuário pelo customer ID
      const usersRef = admin.firestore().collection('users');
      const snapshot = await usersRef
        .where('subscription.stripeCustomerId', '==', subscription.customer)
        .get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        await userDoc.ref.set({
          subscription: {
            plan: 'free',
            status: 'cancelled',
          }
        }, { merge: true });

        console.log('Subscription cancelled for user:', userDoc.id);
      }
    } catch (error) {
      console.error('Error updating cancelled subscription:', error);
    }
  }

  // Retornar sucesso
  res.json({ received: true });
});

/**
 * Criar sessão de checkout no Stripe
 */
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  // Verificar se usuário está autenticado
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Usuario não autenticado'
    );
  }

  const { priceId } = data;
  const userId = context.auth.uid;

  if (!priceId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Price ID é obrigatório'
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${data.returnUrl || 'https://yourapp.com'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: data.cancelUrl || 'https://yourapp.com',
      metadata: {
        userId: userId,
      },
      subscription_data: {
        metadata: {
          userId: userId,
        },
      },
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Erro ao criar sessão de checkout'
    );
  }
});

