"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TestLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Проверяю...");
    
    console.log("Попытка входа:", email, password);
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    console.log("Результат:", result);
    
    if (result?.error) {
      setMessage(`Ошибка: ${result.error}`);
      setLoading(false);
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
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: "0.5rem 1rem", 
            background: loading ? "#ccc" : "#0070f3", 
            color: "white", 
            border: "none", 
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Проверка..." : "Войти"}
        </button>
      </form>
      <p style={{ marginTop: "1rem", color: loading ? "#666" : (message.includes("Ошибка") ? "red" : "green") }}>
        {message}
      </p>
    </div>
  );
}