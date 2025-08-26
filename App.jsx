import React, { useEffect, useState } from "react";

export default function App() {
  const [api, setApi] = useState("carregando...");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/ping")
      .then((r) => r.json())
      .then((d) => setApi(d.pong ? "pong" : "erro"))
      .catch(() => setApi("erro"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Dashboard do Aluno</h1>
      <p>Teste de conexão com backend:</p>
      <pre>{api}</pre>
    </div>
  );
}
