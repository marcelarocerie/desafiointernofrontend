import { useEffect, useState } from "react";

function App() {
  const [api, setApi] = useState("");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/api/ping")
      .then((res) => res.json())
      .then((data) => setApi(data.pong ? "pong" : "erro"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h1>Dashboard do Aluno</h1>
      <p>Teste de conexão com backend:</p>
      <pre>{api}</pre>
    </div>
  );
}

export default App;