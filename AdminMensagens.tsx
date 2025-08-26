import { useEffect, useState } from "react";

export default function AdminMensagens({ token }: { token: string }) {
  const [msgs, setMsgs] = useState<any[]>([]);
  const [novo, setNovo] = useState<any>({ titulo: "", corpo: "", destaque: false, ativa: true, destinatarios: "" });
  const [toast, setToast] = useState("");

  function fetchMsgs() {
    fetch("/api/admin/mensagens", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(setMsgs);
  }
  useEffect(fetchMsgs, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/mensagens", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...novo,
        destinatarios: novo.destinatarios ?
          novo.destinatarios.split(",").map((s: string) => s.trim()) : null
      })
    });
    setNovo({ titulo: "", corpo: "", destaque: false, ativa: true, destinatarios: "" });
    setToast("Mensagem enviada!");
    fetchMsgs();
  }

  async function apagar(id: string) {
    if (!window.confirm("Tem certeza?")) return;
    await fetch(`/api/admin/mensagens/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    setToast("Mensagem removida!");
    fetchMsgs();
  }

  return (
    <div>
      <form onSubmit={criar} className="bg-gray-100 p-4 rounded mb-4 space-y-2">
        <div className="flex gap-2">
          <input value={novo.titulo} onChange={e => setNovo({ ...novo, titulo: e.target.value })} required
            placeholder="Título" className="border p-1 rounded flex-1" />
          <input value={novo.destinatarios} onChange={e => setNovo({ ...novo, destinatarios: e.target.value })}
            placeholder="IDs alunos separados por vírgula ou vazio p/ todos" className="border p-1 rounded flex-1" />
        </div>
        <textarea value={novo.corpo} onChange={e => setNovo({ ...novo, corpo: e.target.value })}
          placeholder="Corpo da mensagem" className="border p-1 rounded w-full" rows={2} required />
        <div className="flex gap-4 items-center">
          <label><input type="checkbox" checked={novo.destaque}
            onChange={e => setNovo({ ...novo, destaque: e.target.checked })} /> Destaque</label>
          <label><input type="checkbox" checked={novo.ativa}
            onChange={e => setNovo({ ...novo, ativa: e.target.checked })} /> Ativa</label>
          <button type="submit" className="bg-purple-500 text-white px-3 py-1 rounded">Enviar</button>
        </div>
      </form>
      {toast && <div className="mb-2 text-green-700">{toast}</div>}
      <table className="min-w-full bg-white border rounded text-xs">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b">Título</th>
            <th className="py-1 px-2 border-b">Enviada em</th>
            <th className="py-1 px-2 border-b">Destaque</th>
            <th className="py-1 px-2 border-b">Ativa</th>
            <th className="py-1 px-2 border-b">Destinatários</th>
            <th className="py-1 px-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {msgs.map((m: any) => (
            <tr key={m.id}>
              <td className="py-1 px-2">{m.titulo}</td>
              <td className="py-1 px-2">{new Date(m.dataEnvio).toLocaleString()}</td>
              <td className="py-1 px-2">{m.destaque ? "Sim" : ""}</td>
              <td className="py-1 px-2">{m.ativa ? "Sim" : "Não"}</td>
              <td className="py-1 px-2">{m.destinatarios ? m.destinatarios : "Todos"}</td>
              <td className="py-1 px-2">
                <button onClick={() => apagar(m.id)} className="bg-red-400 text-white px-2 rounded">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}