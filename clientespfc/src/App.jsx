import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthenticatedApp from "./components/AuthenticatedApp";
import AdminPanel from "./components/AdminPanel";
import "./index.css";

const ADMIN_EMAIL = "mauriciogear4@gmail.com";

function App() {
  const { currentUser, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showAdmin, setShowAdmin] = useState(false);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'}}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin" style={{color: '#3B82F6'}}>⚙️</div>
          <p style={{color: '#FFFFFF'}}>Carregando...</p>
        </div>
      </div>
    );
  }

  // Show login/signup if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background: 'linear-gradient(135deg, #1e3a8a 0%, #0f766e 50%, #1e3a8a 100%)'}}>
        <Toaster position="top-right" reverseOrder={false} />
        {isLogin ? (
          <Login onToggleMode={() => setIsLogin(false)} />
        ) : (
          <Signup onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    );
  }

  // Check if admin
  const isAdmin = currentUser?.email === ADMIN_EMAIL;

  // Show admin panel if admin and toggle is on
  if (isAdmin && showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />;
  }

  // Show regular app or app with admin button
  return <AuthenticatedApp isAdmin={isAdmin} onShowAdmin={() => setShowAdmin(true)} />;
}

export default App;
