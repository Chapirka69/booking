import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/register";
    const body = isLogin ? { email, password } : { email, password, name };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("access_token", data.token);
        setUser(data.user);
        navigate(data.user.role === "ADMIN" ? "/admin" : "/");
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError(isLogin ? "Не удалось войти" : "Не удалось зарегистрироваться");
    }
  };

  return (
    <div className="text-black mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md bg-white rounded-lg shadow-md p-6 w-full">
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 w-1/2 py-2 text-sm font-medium ${
              isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            } rounded-l-lg`}
          >
            Войти
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 w-1/2 py-2 text-sm font-medium ${
              !isLogin ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
            } rounded-r-lg`}
          >
            Зарегистрироваться
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-blue-800 text-center">
          {isLogin ? "Вход" : "Регистрация"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Имя
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Auth;
