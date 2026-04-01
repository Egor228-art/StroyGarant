"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TestLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Проверяю...");
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setMessage(`Ошибка: ${result.error}`);
    } else {
      setMessage("Успешно! Перенаправление...");
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h1>Тестовый вход</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit" style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "white", border: "none", borderRadius: "4px" }}>
          Войти
        </button>
      </form>
      <p style={{ marginTop: "1rem", color: "#666" }}>{message}</p>
    </div>
  );
}