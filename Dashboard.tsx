import { useEffect, useState } from "react";
// ...restante

export default function Dashboard({ token }: { token: string }) {
  const [data, setData] = useState<any>(null);
  const [mensagens, setMensagens] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/aluno/dashboard", { headers: { Authorization: "Bearer " + token } })
      .then(res => res.json())
      .then(setData);
    fetch("/api/aluno/mensagens", { headers: { Authorization: "Bearer " + token } })
      .then(res => res.json())
      .then(setMensagens);
  }, [token]);

  async function marcarComoLida(id: string) {
    await fetch(`/api/aluno/mensagens/${id}/lida`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token }
    });
    setMensagens(mensagens.map(m => m.id === id ? { ...m, lida: true } : m));
  }

  // Mensagens em destaque/banner
  const destacadas = mensagens.filter(m => m.destaque && !m.lida);
  // Mensagens comuns não lidas
  const comuns = mensagens.filter(m => !m.destaque && !m.lida);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* MENSAGENS */}
      {destacadas.map(m => (
        <div key={m.id} className="bg-orange-100 border-l-4 border-orange-400 p-4 mb-2 rounded relative">
          <div className="font-bold text-orange-700">{m.titulo}</div>
          <div>{m.corpo}</div>
          <button onClick={() => marcarComoLida(m.id)} className="absolute right-2 top-2 text-xs bg-orange-400 text-white px-2 rounded">Marcar como lida</button>
        </div>
      ))}
      {comuns.length > 0 &&
        <div className="mb-2">
          <details>
            <summary className="cursor-pointer text-sm text-purple-700 font-bold">Mensagens não lidas ({comuns.length})</summary>
            <div>
              {comuns.map(m => (
                <div key={m.id} className="bg-purple-50 border-l-4 border-purple-300 p-2 mb-1 rounded relative">
                  <div className="font-bold">{m.titulo}</div>
                  <div>{m.corpo}</div>
                  <button onClick={() => marcarComoLida(m.id)} className="absolute right-2 top-2 text-xs bg-purple-400 text-white px-2 rounded">Ler</button>
                </div>
              ))}
            </div>
          </details>
        </div>
      }
      {/* ...restante do dashboard */}
    </div>
  );
}