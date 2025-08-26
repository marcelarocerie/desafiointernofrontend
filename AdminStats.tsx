import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import 'chart.js/auto';

export default function AdminStats({ token }: { token: string }) {
  const [dados, setDados] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/stats", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json())
      .then(setDados);
  }, [token]);

  if (!dados) return <div>Carregando...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2 text-purple-700">Envios aprovados por semana</h3>
        <Line data={{
          labels: dados.semanas,
          datasets: [{
            label: "Total de envios aprovados",
            data: dados.aprovadosPorSemana,
            backgroundColor: "#7c3aed",
            borderColor: "#7c3aed"
          }]
        }} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-bold mb-2 text-purple-700">Distribuição por formato</h3>
        <Bar data={{
          labels: dados.porFormato.map((f: any) => f.nome),
          datasets: [{
            label: "Envios aprovados",
            data: dados.porFormato.map((f: any) => f.qtd),
            backgroundColor: "#fb923c"
          }]
        }} />
      </div>
      <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
        <h3 className="font-bold mb-2 text-purple-700">Top 5 alunos engajados</h3>
        <Pie data={{
          labels: dados.topAlunos.map((a: any) => a.nome),
          datasets: [{
            label: "Envios aprovados",
            data: dados.topAlunos.map((a: any) => a.qtd),
            backgroundColor: ["#7c3aed", "#fb923c", "#22c55e", "#2563eb", "#f59e42"]
          }]
        }} />
      </div>
    </div>
  );
}