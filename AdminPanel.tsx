// ...import AdminMensagens from "./AdminMensagens";
const TABS = [
  { key: "envios", label: "Revisão de Envios" },
  { key: "alunos", label: "Alunos" },
  { key: "formatos", label: "Formatos" },
  { key: "estruturas", label: "Estruturas" },
  { key: "config", label: "Configurações" },
  { key: "mensagens", label: "Mensagens" }, // novo!
  { key: "ranking", label: "Ranking" },
  { key: "stats", label: "Estatísticas" },
];
// ...
{tab === "mensagens" && <AdminMensagens token={token} />}