import { useEffect, useState } from "react";

type Formato = { id: string; nome: string };
type Estrutura = { id: string; nome: string };

const PLATAFORMAS = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "YOUTUBE", label: "YouTube" },
  { value: "SHORTS", label: "Shorts" },
  { value: "REELS", label: "Reels" },
];

export default function Envio({ token, onSuccess }: { token: string; onSuccess: () => void }) {
  const [formatos, setFormatos] = useState<Formato[]>([]);
  const [estruturas, setEstruturas] = useState<Estrutura[]>([]);
  const [formatoId, setFormatoId] = useState("");
  const [estruturaId, setEstruturaId] = useState("");
  const [link, setLink] = useState("");
  const [plataforma, setPlataforma] = useState(PLATAFORMAS[0].value);
  const [dataPostagem, setDataPostagem] = useState(() => new Date().toISOString().slice(0, 10));
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error", msg: string } | null>(null);

  useEffect(() => {
    fetch("/api/formatos").then(res => res.json()).then(setFormatos);
    fetch("/api/estruturas").then(res => res.json()).then(setEstruturas);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setToast(null);
    try {
      const resp = await fetch("/api/aluno/envios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          formatoId, estruturaId: estruturaId || undefined,
          link, plataforma, dataPostagem, observacoes: observacoes || undefined,
        }),
      });
      if (resp.ok) {
        setToast({ type: "success", msg: "Enviado com sucesso!" });
        setFormatoId("");
        setEstruturaId("");
        setLink("");
        setPlataforma(PLATAFORMAS[0].value);
        setDataPostagem(new Date().toISOString().slice(0, 10));
        setObservacoes("");
        onSuccess();
      } else {
        const data = await resp.json();
        setToast({ type: "error", msg: data.error || "Erro ao enviar" });
      }
    } catch {
      setToast({ type: "error", msg: "Erro de rede" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-purple-700">Novo Envio de Vídeo</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Formato do vídeo *</label>
          <select value={formatoId} onChange={e => setFormatoId(e.target.value)} required className="w-full border p-2 rounded">
            <option value="">Selecione...</option>
            {formatos.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Estrutura de roteiro</label>
          <select value={estruturaId} onChange={e => setEstruturaId(e.target.value)} className="w-full border p-2 rounded">
            <option value="">(Opcional)</option>
            {estruturas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Link do vídeo *</label>
          <input type="url" value={link} required pattern="https://.*"
                 onChange={e => setLink(e.target.value)}
                 className="w-full border p-2 rounded" placeholder="https://..." />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Plataforma *</label>
          <select value={plataforma} onChange={e => setPlataforma(e.target.value)} className="w-full border p-2 rounded">
            {PLATAFORMAS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-semibold">Data de postagem *</label>
          <input type="date" value={dataPostagem} required max={new Date().toISOString().slice(0,10)}
                 onChange={e => setDataPostagem(e.target.value)}
                 className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Observações</label>
          <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} className="w-full border p-2 rounded"></textarea>
        </div>
        <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600"
                disabled={loading}>{loading ? "Enviando..." : "Enviar"}</button>
        {toast && (
          <div className={`mt-2 p-2 rounded text-center text-white ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {toast.msg}
          </div>
        )}
      </form>
    </div>
  );
}