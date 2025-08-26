import { useEffect, useState } from "react";

export default function AdminEstruturas({ token }: { token: string }) {
  const [estruturas, setEstruturas] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [toast, setToast] = useState<string>("");

  async function fetchEstruturas() {
    const resp = await fetch("/api/admin/estruturas", { headers: { Authorization: "Bearer " + token } });
    setEstruturas(await resp.json());
  }
  useEffect(() => { fetchEstruturas(); }, []);

  async function addEstrutura(e: React.FormEvent) {
    e.preventDefault();
    const resp = await fetch("/api/admin/estruturas", {
      method: "POST",
      headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
      body: JSON.stringify({ nome }),
    });
    if (resp.ok) {
      setNome(""); setToast("Estrutura adicionada!"); await fetchEstruturas();
    }
  }

  async function delEstrutura(id: string) {
    await fetch(`/api/admin/estruturas/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });
    setToast("Estrutura removida!");
    await fetchEstruturas();
  }

  return (
    <div>
      <form onSubmit={addEstrutura} className="flex gap-2 mb-4">
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome da estrutura" className="border rounded p-1" required />
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
          {estruturas.map((e: any) => (
            <tr key={e.id}>
              <td className="py-1 px-2">{e.nome}</td>
              <td className="py-1 px-2">
                <button onClick={() => delEstrutura(e.id)} className="bg-red-500 text-white px-2 rounded">Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}