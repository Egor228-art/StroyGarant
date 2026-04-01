"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/debug/users")
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Пользователи в БД</h1>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Имя</th>
            <th>Хэш пароля (начало)</th>
            <th>Длина хэша</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td style={{ fontFamily: "monospace", fontSize: "12px" }}>{user.password_preview}...</td>
              <td>{user.password_length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: "1rem" }}>
        <strong>Правильный хэш bcrypt должен иметь длину 60 символов</strong>
      </p>
    </div>
  );
}