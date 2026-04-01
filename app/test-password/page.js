"use client";

import { useState } from "react";

export default function TestPasswordPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPassword = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("/api/test-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "500px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1>Проверка пароля</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Пароль для проверки:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </div>
      <button 
        onClick={checkPassword} 
        disabled={loading}
        style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "white", border: "none", borderRadius: "4px" }}
      >
        {loading ? "Проверка..." : "Проверить пароль"}
      </button>
      
      {result && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: result.success ? "#d4edda" : "#f8d7da", borderRadius: "4px" }}>
          {result.success ? (
            <div style={{ color: "#155724" }}>
              ✅ Пароль верный! Пользователь: {result.user?.email}
            </div>
          ) : (
            <div style={{ color: "#721c24" }}>
              ❌ {result.error || "Пароль неверный"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}