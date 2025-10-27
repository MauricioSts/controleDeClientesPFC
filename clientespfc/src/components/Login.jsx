import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

function Login({ onToggleMode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signInWithGoogle } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Email ou senha incorretos!");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      await signInWithGoogle();
      toast.success("Login realizado com sucesso!");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      toast.error("Erro ao fazer login com Google");
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-sm rounded-2xl p-8 shadow-2xl w-full max-w-md"
      style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6" }}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2" style={{ color: "#3B82F6" }}>
          Bem-vindo de volta!
        </h2>
        <p style={{ color: "#FFFFFF" }}>Faça login para acessar JerseysAndBits</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#3B82F6" }}>
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: "#3B82F6" }} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6", color: "#FFFFFF" }}
              placeholder="seu@email.com"
              onFocus={(e) => (e.target.style.borderColor = "#14B8A6")}
              onBlur={(e) => (e.target.style.borderColor = "#3B82F6")}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: "#3B82F6" }}>
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: "#3B82F6" }} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
              style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6", color: "#FFFFFF" }}
              placeholder="••••••••"
              onFocus={(e) => (e.target.style.borderColor = "#14B8A6")}
              onBlur={(e) => (e.target.style.borderColor = "#3B82F6")}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            loading ? "cursor-not-allowed" : "shadow-lg hover:shadow-xl"
          }`}
          style={{
            backgroundColor: loading ? "#0D0630" : "#3B82F6",
            color: "#FFFFFF",
            border: "1px solid #3B82F6",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = "#14B8A6";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = "#3B82F6";
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* Google Sign In */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: "#3B82F6" }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span style={{ color: "#FFFFFF", backgroundColor: "#1e293b", padding: "0 1rem" }}>
              ou
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mt-6 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6", color: "#FFFFFF" }}
          onMouseEnter={(e) => (e.target.style.borderColor = "#14B8A6")}
          onMouseLeave={(e) => (e.target.style.borderColor = "#3B82F6")}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>
      </div>

      {/* Toggle to Sign Up */}
      <div className="mt-6 text-center">
        <p style={{ color: "#FFFFFF" }}>
          Não tem conta?{" "}
          <button
            onClick={onToggleMode}
            className="font-medium transition-colors"
            style={{ color: "#3B82F6" }}
            onMouseEnter={(e) => (e.target.style.color = "#14B8A6")}
            onMouseLeave={(e) => (e.target.style.color = "#3B82F6")}
          >
            Criar conta
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default Login;
