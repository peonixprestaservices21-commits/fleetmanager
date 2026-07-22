"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Mot de passe incorrect");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit} className="panel login-panel">
        <div className="logo">
          <span className="mark">🚐</span>FleetManager
        </div>
        <div className="field">
          <label>Mot de passe</label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        <button type="submit" className="btn btn-gold" style={{ width: "100%", marginTop: 16 }} disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
