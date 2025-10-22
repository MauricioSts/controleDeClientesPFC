import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const q = collection(db, "clientes");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(lista);
    });
    return () => unsubscribe();
  }, []);

  // Dados para clientes pendentes/concluídos
  const statusData = [
    {
      name: "Pendentes",
      clientes: clientes.filter((c) => !c.concluido).length,
    },
    {
      name: "Concluídos",
      clientes: clientes.filter((c) => c.concluido).length,
    },
  ];

  // Dados por mês
  const meses = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const faturamentoMes = meses.map((mes) => {
    const total = clientes
      .filter((c) => {
        const data = new Date(c.data.split("/").reverse().join("-"));
        return data.getMonth() + 1 === parseInt(mes);
      })
      .reduce((acc, c) => acc + Number(c.preco), 0);

    return { month: mes, faturamento: total };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto bg-[#2E1669]/40 backdrop-blur-md border border-[#FF2E63]/20 rounded-2xl p-6 sm:p-8 shadow-inner space-y-10"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
        Dashboard
      </h2>

      {/* Gráfico de clientes */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={statusData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="clientes" fill="#FF2E63" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de faturamento por mês */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={faturamentoMes}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
            <Bar dataKey="faturamento" fill="#FF2E63" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

export default Dashboard;
