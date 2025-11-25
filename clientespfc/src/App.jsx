import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthenticatedApp from "./components/AuthenticatedApp";
import AdminPanel from "./components/AdminPanel";
import { Toaster } from "react-hot-toast";

function AppContent() {
  const { currentUser, loading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Email do administrador
  const ADMIN_EMAIL = "mauriciogear4@gmail.com";
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)",
        }}
      >
        <div className="text-center">
          <div
            className="text-6xl mb-4 animate-spin"
            style={{ color: "#3B82F6" }}
          >
            ⚙️
          </div>
          <p style={{ color: "#FFFFFF" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)",
        }}
      >
        <Toaster position="top-right" reverseOrder={false} />
        {isLoginMode ? (
          <Login onToggleMode={() => setIsLoginMode(false)} />
        ) : (
          <Signup onToggleMode={() => setIsLoginMode(true)} />
        )}
      </div>
    );
  }

  // Mostrar painel admin se solicitado
  if (showAdminPanel && isAdmin) {
    return <AdminPanel onBack={() => setShowAdminPanel(false)} />;
  }

  return (
    <AuthenticatedApp
      isAdmin={isAdmin}
      onShowAdmin={() => setShowAdminPanel(true)}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

