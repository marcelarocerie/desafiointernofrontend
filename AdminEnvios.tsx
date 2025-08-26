import { useEffect, useState } from "react";

export default function AdminEnvios({ token }: { token: string }) {
  const [envios, setEnvios] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [formatos, setFormatos] = useState<any[]>([]);
  const [filtroFormato, setFiltroFormato] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [filtroAluno, setFiltroAluno] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error", msg: string } | null>(null);

  // Carregar filtros
  useEffect(() => {
    fetch("/api/admin/formatos", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setFormatos);
    fetch("/api/admin/alunos", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setAlunos);
  }, [token]);

  // Carregar envios
  function carregarEnvios() {
    setLoading(true);
    let qs = [];
    if (status) qs.push(`status=${status}`);
    if (filtroFormato) qs.push(`formatoId=${filtroFormato}`);
    if (filtroAluno) qs.push(`alunoId=${filtroAluno}`);
    const url = `/api/admin/envios?${qs.join("&")}`;
    fetch(url, { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setEnvios).finally(() => setLoading(false));
  }
  useEffect(() => { carregarEnvios(); }, [status, filtroFormato, filtroAluno]);

  async function alterarStatus(id: string, novoStatus: string) {
    setToast(null);
    const r = await fetch(`/api/admin/envios/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ status: novoStatus }),
    });
    if (r.ok) {
      setToast({ type: "success", msg: "Status atualizado!" });
      carregarEnvios();
    } else {
      setToast({ type: "error", msg: "Erro ao atualizar" });
    }
  }

  function exportarCSV() {
    let qs = [];
    if (status) qs.push(`status=${status}`);
    if (filtroFormato) qs.push(`formatoId=${filtroFormato}`);
    if (filtroAluno) qs.push(`alunoId=${filtroAluno}`);
    window.open(`/api/admin/envios/export/csv?${qs.join("&")}`, "_blank");
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Revisão de Envios</h2>
      <div className="flex flex-wrap gap-2 mb-2">
        <select className="border p-2 rounded" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Status: Todos</option>
          <option value="PENDENTE">Pendente</option>
          <option value="APROVADO">Aprovado</option>
          <option value="REPROVADO">Reprovado</option>
        </select>
        <select className="border p-2 rounded" value={filtroFormato} onChange={e => setFiltroFormato(e.target.value)}>
          <option value="">Formato: Todos</option>
          {formatos.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
        <select className="border p-2 rounded" value={filtroAluno} onChange={e => setFiltroAluno(e.target.value)}>
          <option value="">Aluno: Todos</option>
          {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
        </select>
        <button onClick={exportarCSV} className="bg-orange-500 text-white font-bold px-3 py-2 rounded hover:bg-orange-600">Exportar CSV</button>
      </div>
      {toast && (
        <div className={`my-2 p-2 rounded text-center text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.msg}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded">
          <thead>
            <tr>
              <th className="py-1 px-2 border-b">Aluno</th>
              <th className="py-1 px-2 border-b">Formato</th>
              <th className="py-1 px-2 border-b">Estrutura</th>
              <th className="py-1 px-2 border-b">Link</th>
              <th className="py-1 px-2 border-b">Data</th>
              <th className="py-1 px-2 border-b">Status</th>
              <th className="py-1 px-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {envios.map((e, i) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="py-1 px-2">{e.aluno?.nome}</td>
                <td className="py-1 px-2">{e.formato?.nome}</td>
                <td className="py-1 px-2">{e.estrutura?.nome || "-"}</td>
                <td className="py-1 px-2"><a href={e.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Abrir</a></td>
                <td className="py-1 px-2">{new Date(e.dataPostagem).toLocaleDateString()}</td>
                <td className="py-1 px-2 font-bold">{e.status}</td>
                <td className="py-1 px-2 space-x-1">
                  {e.status !== "APROVADO" && <button onClick={() => alterarStatus(e.id, "APROVADO")}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs">Aprovar</button>}
                  {e.status !== "REPROVADO" && <button onClick={() => alterarStatus(e.id, "REPROVADO")}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs">Reprovar</button>}
                  {e.status !== "PENDENTE" && <button onClick={() => alterarStatus(e.id, "PENDENTE")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">Pendente</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-center mt-4">Carregando...</div>}
    </div>
  );
}