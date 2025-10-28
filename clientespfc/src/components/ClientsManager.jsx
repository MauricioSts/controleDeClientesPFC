import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { UserPlus, Edit3, Trash2, Save, X } from "lucide-react";
import ConfirmModal from "./ConfirmModal";

function ClientsManager() {
  const { currentUser } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    nome: "",
    instagram: "",
    numeroTel: "",
    produto: "",
    tamanho: "",
    valor: "",
    versao: "fan",
    nomeCamisa: "",
    numeroCamisa: ""
  });

  const tamanhos = [
    "XS", "S", "M", "L", "XL", "XXL", "XXXL",
    "28", "30", "32", "34", "36", "38", "40", "42", "44", "46", "48", "50",
    "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"
  ];

  // Buscar clientes
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "clientes"),
      where("userId", "==", currentUser.uid),
      where("isCustomer", "==", true) // Apenas clientes reais
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(lista);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleAdd = async () => {
    if (!formData.nome || !formData.produto || !formData.valor) {
      toast.error("Nome, Produto e Valor são obrigatórios!");
      return;
    }

    try {
      await addDoc(collection(db, "clientes"), {
        ...formData,
        numeroTel: formData.numeroTel ? formData.numeroTel : "",
        preco: parseFloat(formData.valor) || 0,
        tamanho: formData.tamanho || "",
        versao: formData.versao || "fan",
        nomeCamisa: formData.nomeCamisa || "",
        numeroCamisa: formData.numeroCamisa || "",
        isCustomer: true, // Marca como cliente
        userId: currentUser.uid,
        createdAt: new Date()
      });

      toast.success("Cliente adicionado com sucesso!");
      setIsAdding(false);
      setFormData({ nome: "", instagram: "", numeroTel: "", produto: "", tamanho: "", valor: "", versao: "fan", nomeCamisa: "", numeroCamisa: "" });
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      toast.error("Erro ao adicionar cliente");
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setFormData({
      nome: cliente.nome || "",
      instagram: cliente.instagram || "",
      numeroTel: cliente.numeroTel || "",
      produto: cliente.produto || "",
      tamanho: cliente.tamanho || "",
      valor: cliente.preco || cliente.valor || "",
      versao: cliente.versao || "fan",
      nomeCamisa: cliente.nomeCamisa || "",
      numeroCamisa: cliente.numeroCamisa || ""
    });
  };

  const handleSave = async (clienteId) => {
    try {
      await updateDoc(doc(db, "clientes", clienteId), {
        ...formData,
        numeroTel: formData.numeroTel || "",
        preco: parseFloat(formData.valor) || 0,
        tamanho: formData.tamanho || "",
        versao: formData.versao || "fan",
        nomeCamisa: formData.nomeCamisa || "",
        numeroCamisa: formData.numeroCamisa || ""
      });

      toast.success("Cliente atualizado com sucesso!");
      setEditingId(null);
      setFormData({ nome: "", instagram: "", numeroTel: "", produto: "", tamanho: "", valor: "", versao: "fan", nomeCamisa: "", numeroCamisa: "" });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente");
    }
  };

  const handleDelete = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!clienteToDelete) return;

    try {
      await deleteDoc(doc(db, "clientes", clienteToDelete.id));
      toast.success("Cliente removido com sucesso!");
      setShowDeleteModal(false);
      setClienteToDelete(null);
    } catch (error) {
      console.error("Erro ao remover cliente:", error);
      toast.error("Erro ao remover cliente");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ nome: "", instagram: "", numeroTel: "", produto: "", tamanho: "", valor: "", versao: "fan", nomeCamisa: "", numeroCamisa: "" });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{color: '#3B82F6'}}>Gerenciar Clientes</h2>
        {!isAdding && !editingId && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Adicionar Cliente
          </button>
        )}
      </div>

      {/* Formulário de adicionar/editar */}
      {(isAdding || editingId) && (
        <div className="p-6 rounded-xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}>
          <h3 className="text-lg font-bold mb-4" style={{color: '#3B82F6'}}>
            {isAdding ? "Novo Cliente" : "Editar Cliente"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Nome *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Nome do cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Instagram
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="@instagram"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Telefone
              </label>
              <input
                type="text"
                value={formData.numeroTel}
                onChange={(e) => setFormData({...formData, numeroTel: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Valor *
              </label>
              <input
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="0.00"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Produto *
              </label>
              <input
                type="text"
                value={formData.produto}
                onChange={(e) => setFormData({...formData, produto: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Nome do produto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Versão
              </label>
              <select
                value={formData.versao}
                onChange={(e) => setFormData({...formData, versao: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="fan">Fan</option>
                <option value="retro">Retro</option>
                <option value="player">Player</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Tamanho
              </label>
              <select
                value={formData.tamanho}
                onChange={(e) => setFormData({...formData, tamanho: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Selecione o tamanho</option>
                {tamanhos.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Nome na Camisa (opcional)
              </label>
              <input
                type="text"
                value={formData.nomeCamisa}
                onChange={(e) => setFormData({...formData, nomeCamisa: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: AB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#FFFFFF'}}>
                Número na Camisa (opcional)
              </label>
              <input
                type="text"
                value={formData.numeroCamisa}
                onChange={(e) => setFormData({...formData, numeroCamisa: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                placeholder="Ex: 10"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={isAdding ? handleAdd : () => handleSave(editingId)}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Salvar
            </button>
            <button
              onClick={isAdding ? () => setIsAdding(false) : cancelEdit}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            className="p-4 rounded-xl" style={{backgroundColor: '#1e293b', border: '1px solid #3B82F6'}}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg" style={{color: '#3B82F6'}}>
                {cliente.nome}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(cliente)}
                  className="p-2 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 transition-colors"
                  title="Editar"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cliente)}
                  className="p-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors"
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {cliente.instagram && (
              <p className="text-sm mb-1" style={{color: '#999'}}>
                Instagram: {cliente.instagram}
              </p>
            )}
            {cliente.numeroTel && (
              <p className="text-sm mb-1" style={{color: '#999'}}>
                Telefone: {cliente.numeroTel}
              </p>
            )}
            {cliente.produto && (
              <p className="text-sm mb-1" style={{color: '#999'}}>
                Produto: {cliente.produto}
              </p>
            )}
            {cliente.tamanho && (
              <p className="text-sm mb-1" style={{color: '#999'}}>
                Tamanho: {cliente.tamanho}
              </p>
            )}
            {cliente.preco && (
              <p className="text-sm mb-1 font-bold" style={{color: '#14B8A6'}}>
                Valor: R$ {cliente.preco.toFixed(2)}
              </p>
            )}
            {(cliente.nomeCamisa || cliente.numeroCamisa) && (
              <p className="text-sm mt-2" style={{color: '#999'}}>
                {cliente.nomeCamisa && `Nome: ${cliente.nomeCamisa}`}
                {cliente.nomeCamisa && cliente.numeroCamisa && " - "}
                {cliente.numeroCamisa && `Nº: ${cliente.numeroCamisa}`}
              </p>
            )}
          </div>
        ))}
      </div>

      {clientes.length === 0 && !isAdding && (
        <div className="text-center py-12 rounded-xl" style={{backgroundColor: '#1e293b'}}>
          <p style={{color: '#999'}}>Nenhum cliente cadastrado</p>
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClienteToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Remover Cliente"
        message={`Tem certeza que deseja remover o cliente ${clienteToDelete?.nome}?`}
        confirmText="Remover"
        cancelText="Cancelar"
      />
    </div>
  );
}

export default ClientsManager;
