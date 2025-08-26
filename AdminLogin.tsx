import { useState } from "react";

export default function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await resp.json();
      if (resp.ok) {
        onLogin(data.token);
      } else {
        setError(data.error || "Não autorizado");
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
        <h1 className="text-2xl font-bold text-purple-700 mb-4 text-center">Admin - Dashboard</h1>
        <input
          type="email"
          className="border w-full p-2 rounded mb-2"
          placeholder="E-mail do admin"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-purple-700 text-white font-semibold py-2 rounded hover:bg-purple-800 transition"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && (
          <div className="mt-2 text-sm text-red-600 text-center">{error}</div>
        )}
      </form>
    </div>
  );
}