import { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";

export default function AdminApp() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("admin_token"));

  function handleLogin(token: string) {
    setToken(token);
    localStorage.setItem("admin_token", token);
  }
  function handleLogout() {
    setToken(null);
    localStorage.removeItem("admin_token");
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />;
  return <AdminPanel token={token} onLogout={handleLogout} />;
}