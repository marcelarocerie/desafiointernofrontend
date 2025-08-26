import { useEffect, useState } from "react";

export default function AdminConfig({ token }: { token: string }) {
  const [config, setConfig] = useState<any>(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState<any>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/config", { headers: { Authorization: "Bearer " + token } })
      .then(r => r.json()).then(c => { setConfig(c); setForm(c); });
  }, [token]);

  function handleChange(e: any) {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function salvar() {
    const r = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify(form),
    });
    if (r.ok) {
      setToast("Configuração salva!");
      setEdit(false);
      setConfig(await r.json());
    } else {
      setToast("Erro ao salvar.");
    }
  }

  if (!config) return <div className="p-4">Carregando configuração...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-purple-700 mb-4">Configuração</h2>
      {toast && <div className="mb-2 text-green-600">{toast}</div>}
      <div className="max-w-lg bg-white p-4 rounded shadow">
        <div className="mb-2">
          <label className="font-semibold">Total do desafio:</label>
          {edit ? <input type="number" name="totalDesafio" className="border ml-2 rounded p-1 w-24"
            value={form.totalDesafio} onChange={handleChange} /> : <span className="ml-2">{config.totalDesafio}</span>}
        </div>
        <div className="mb-2">
          <label className="font-semibold">Meta semanal:</label>
          {edit ? <input type="number" name="metaSemanal" className="border ml-2 rounded p-1 w-24"
            value={form.metaSemanal} onChange={handleChange} /> : <span className="ml-2">{config.metaSemanal}</span>}
        </div>
        <div className="mb-2">
          <label className="font-semibold">Data início:</label>
          {edit ? <input type="date" name="dataInicio" className="border ml-2 rounded p-1"
            value={form.dataInicio?.slice(0, 10)} onChange={handleChange} /> : <span className="ml-2">{config.dataInicio?.slice(0, 10)}</span>}
        </div>
        <div className="mb-2">
          <label className="font-semibold">Data fim:</label>
          {edit ? <input type="date" name="dataFim" className="border ml-2 rounded p-1"
            value={form.dataFim?.slice(0, 10)} onChange={handleChange} /> : <span className="ml-2">{config.dataFim?.slice(0, 10)}</span>}
        </div>
        <div className="mb-2">
          <label className="font-semibold">Webhook URL:</label>
          {edit ? <input type="text" name="webhookUrl" className="border ml-2 rounded p-1 w-full"
            value={form.webhookUrl || ""} onChange={handleChange} /> : <span className="ml-2">{config.webhookUrl || <span className="text-gray-400">-</span>}</span>}
        </div>
        <div className="mt-4">
          {edit
            ? (<><button className="bg-purple-600 text-white px-4 py-1 rounded mr-2" onClick={salvar}>Salvar</button>
              <button className="bg-gray-200 px-4 py-1 rounded" onClick={() => setEdit(false)}>Cancelar</button></>)
            : (<button className="bg-orange-500 px-4 py-1 rounded text-white" onClick={() => setEdit(true)}>Editar</button>)
          }
        </div>
      </div>
    </div>
  );
}