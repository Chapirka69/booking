import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setBookings(data.bookings);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, navigate]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBookings(bookings.filter((booking) => booking.id !== bookingId));
        setSuccess("Бронирование успешно отменено");
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Не удалось отменить бронирование");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/auth");
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Загрузка...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-800">
            Ваш профиль
          </h2>
          <button
            onClick={handleLogout}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
          >
            Выйти
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mt-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl text-gray-600">{user.name[0]}</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Имя: {user.name}
            </p>
            <p className="text-gray-600">Email: {user.email}</p>
            <p className="text-gray-600">
              Роль: {user.role === "ADMIN" ? "Администратор" : "Пользователь"}
            </p>
          </div>
        </div>
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-800">
        Ваши бронирования
      </h3>
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
      {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}
      {bookings.length === 0 ? (
        <p className="text-gray-600">У вас нет бронирований</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
            >
              <div className="w-full h-48 bg-gray-200">
                <img
                  src={
                    booking.hotel.imageUrl ||
                    "https://via.placeholder.com/400x200?text=Hotel"
                  }
                  alt={booking.hotel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Hotel";
                  }}
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-blue-800">
                  {booking.hotel.name}
                </h4>
                <p className="text-gray-600 text-sm">
                  Местоположение: {booking.hotel.location}
                </p>
                <p className="text-gray-600 text-sm">
                  Даты: {formatDate(booking.checkInDate)} -{" "}
                  {formatDate(booking.checkOutDate)}
                </p>
                <p className="text-gray-600 text-sm">
                  Гостей: {booking.guestCount}
                </p>
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="mt-2 w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Отменить бронирование
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
