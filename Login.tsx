import { useState } from "react";

export default function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/aluno/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (resp.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Erro no login");
      }
    } catch {
      setError("Erro de rede");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-orange-50">
      <form className="bg-white rounded-xl shadow p-8 w-80" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">Dashboard do Aluno</h1>
        <input
          type="email"
          className="border w-full p-2 rounded mb-2"
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white font-semibold py-2 rounded hover:bg-purple-700 transition"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Entrar"}
        </button>
        {error && (
          <div className="mt-2 text-sm text-red-600 text-center">{error}</div>
        )}
        <div className="mt-6 text-center text-xs text-gray-400">
          Powered by Criadores do Futuro
        </div>
      </form>
    </div>
  );
}