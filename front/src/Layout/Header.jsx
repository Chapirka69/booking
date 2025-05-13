import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function Header() {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/auth");
  };

  return (
    <header className="bg-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl sm:text-2xl font-bold">
              HotelBooking
            </Link>
          </div>
          <nav className="flex space-x-4 sm:space-x-6">
            <Link
              to="/"
              className="text-sm sm:text-base hover:text-gray-200 transition"
            >
              Главная
            </Link>
            <Link
              to="/about"
              className="text-sm sm:text-base hover:text-gray-200 transition"
            >
              О нас
            </Link>
            {loading ? (
              <span className="text-sm sm:text-base">Загрузка...</span>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm sm:text-base hover:text-gray-200 transition"
                >
                  Профиль
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="text-sm sm:text-base hover:text-gray-200 transition"
                  >
                    Админ
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm sm:text-base hover:text-gray-200 transition"
                >
                  Выйти
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-sm sm:text-base hover:text-gray-200 transition"
              >
                Войти
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;