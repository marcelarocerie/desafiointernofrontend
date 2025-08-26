import { useEffect, useState } from "react";

export default function AdminFormatos({ token }: { token: string }) {
  const [formatos, setFormatos] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [toast, setToast] = useState<string>("");

  async function fetchFormatos() {
    const resp = await fetch("/api/admin/formatos", { headers: { Authorization: "Bearer " + token } });
    setFormatos(await resp.json());
  }
  useEffect(() => { fetchFormatos(); }, []);

  async function addFormato(e: React.FormEvent) {
    e.preventDefault();
    const resp = await fetch("/api/admin/formatos", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    if (resp.ok) {
      setNome(""); setToast("Formato adicionado!"); await fetchFormatos();
    }
  }

  async function delFormato(id: string) {
    await fetch(`/api/admin/formatos/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    setToast("Formato removido!");
    await fetchFormatos();
  }

  return (
    <div>
      <form onSubmit={addFormato} className="flex gap-2 mb-4">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome do formato" className="border rounded p-1" required />
        <button type="submit" className="bg-purple-500 text-white px-3 rounded">Adicionar</button>
      </form>
      {toast && <div className="mb-2 text-green-700">{toast}</div>}
      <table className="min-w-full bg-white border rounded">
        <thead>
          <tr>
            <th className="py-1 px-2 border-b">Nome</th>
            <th className="py-1 px-2 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {formatos.map((f: any) => (
            <tr key={f.id}>
              <td className="py-1 px-2">{f.nome}</td>
              <td className="py-1 px-2">
                <button onClick={() => delFormato(f.id)} className="bg-red-500 text-white px-2 rounded">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}