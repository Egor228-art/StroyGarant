"use client";

import { useState } from "react";

export default function TestRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("Регистрация...");
    
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    
    const data = await res.json();
    if (res.ok) {
      setMessage(`Успешно! Пользователь ${data.user.email} создан. Теперь войдите.`);
      setEmail("");
      setPassword("");
      setName("");
    } else {
      setMessage(`Ошибка: ${data.error}`);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1>Тестовая регистрация</h1>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            required
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            required
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem", background: "#28a745", color: "white", border: "none", borderRadius: "4px" }}>
          Зарегистрироваться
        </button>
      </form>
      <p style={{ marginTop: "1rem", color: "#666" }}>{message}</p>
    </div>
  );
}