import { useEffect, useState } from "react";

const MILESTONES = [4, 8, 12, 16, 20, 24, 28, 32];

export default function PublicRanking() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [tipo, setTipo] = useState("total");
  const [semana, setSemana] = useState(1);

  useEffect(() => {
    let url = `/public/ranking?tipo=${tipo}`;
    if (tipo === "semana") url += `&semana=${semana}`;
    fetch(url)
      .then(r => r.json())
      .then(setRanking);
  }, [tipo, semana]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 py-8 px-2">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Ranking do Desafio 32 Vídeos</h1>
        <div className="flex gap-3 mb-4 justify-center">
          <select value={tipo} onChange={e => setTipo(e.target.value)} className="border p-1 rounded">
            <option value="total">Total</option>
            <option value="semana">Por semana</option>
          </select>
          {tipo === "semana" &&
            <input type="number" min={1} value={semana} onChange={e => setSemana(+e.target.value)} className="border p-1 rounded w-20" />
          }
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded text-center">
            <thead>
              <tr>
                <th className="py-1 px-2 border-b">#</th>
                <th className="py-1 px-2 border-b">Aluno</th>
                <th className="py-1 px-2 border-b">Vídeos</th>
                <th className="py-1 px-2 border-b">Badges</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, i) => (
                <tr key={r.nome} className={i < 3 ? "bg-purple-100 font-bold" : ""}>
                  <td className="py-1 px-2">{i + 1}</td>
                  <td className="py-1 px-2 flex items-center gap-2 justify-center">
                    {r.foto && <img src={r.foto} alt="" className="w-7 h-7 rounded-full" />}
                    {r.nome}
                  </td>
                  <td className="py-1 px-2">{r.enviados} / {r.total}</td>
                  <td className="py-1 px-2">
                    {MILESTONES.map((m, idx) =>
                      <span key={m} title={`${m} vídeos`} className={`inline-block w-5 h-5 mx-0.5 rounded-full border ${r.badges[idx] ? "bg-orange-400 border-orange-500" : "bg-gray-200 border-gray-300"}`}>
                        {r.badges[idx] ? <span className="text-xs text-white">★</span> : ""}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 text-xs text-gray-500 text-center">
          Progresso conta apenas vídeos <b>aprovados</b>.<br />
          Badges são desbloqueadas ao atingir: {MILESTONES.map(m => <span key={m} className="mx-1">{m}</span>)} vídeos!
        </div>
      </div>
    </div>
  );
}