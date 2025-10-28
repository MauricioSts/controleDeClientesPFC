import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar" }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md p-6 rounded-2xl"
          style={{
            backgroundColor: '#1e293b',
            border: '2px solid #ef4444',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Ícone de alerta */}
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
              <AlertTriangle className="w-8 h-8" style={{ color: '#ef4444' }} />
            </div>
          </div>

          {/* Título */}
          <h3 className="text-xl font-bold text-center mb-3" style={{ color: '#ef4444' }}>
            {title}
          </h3>

          {/* Mensagem */}
          <p className="text-center mb-6" style={{ color: '#FFFFFF' }}>
            {message}
          </p>

          {/* Botões de ação */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#374151',
                color: '#FFFFFF',
                border: '1px solid #6b7280'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#4b5563';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#374151';
              }}
            >
              {cancelText}
            </button>
            
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#ef4444',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#dc2626';
                e.target.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ef4444';
                e.target.style.boxShadow = 'none';
              }}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ConfirmModal;
