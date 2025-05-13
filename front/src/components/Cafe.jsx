import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

function Cafe() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [cafe, setCafe] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cafes/${id}`);
        const data = await response.json();
        if (response.ok) {
          setCafe(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Не удалось загрузить кафе/ресторан");
      } finally {
        setLoading(false);
      }
    };
    fetchCafe();
  }, [id]);

  const renderStars = (rating) => {
    if (!rating) return "Без рейтинга";
    const stars = Math.round(rating / 2);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  if (loading || !cafe) {
    return <div className="p-6 text-center text-gray-600">Загрузка...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-700 transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Назад
          </button>
          {user && user.role === "ADMIN" && (
            <button
              onClick={() =>
                navigate(`/edit/cafe/${id}`, {
                  state: { from: location.pathname },
                })
              }
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Редактировать
            </button>
          )}
        </div>
        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800">
              {cafe.name}
            </h1>
            <p className="text-yellow-500 text-sm">
              {renderStars(cafe.rating)}
            </p>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">{cafe.location}</p>
          <p className="text-gray-600 text-sm sm:text-base">
            Тип: {cafe.type === "CAFE" ? "Кафе" : "Ресторан"}
          </p>
          <div className="mt-4 w-full h-64 sm:h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={
                cafe.imageUrl ||
                "https://via.placeholder.com/1200x400?text=Cafe"
              }
              alt={cafe.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/1200x400?text=Cafe";
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-800">
              О кафе/ресторане
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              {cafe.description}
            </p>
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-800">
                Удобства
              </h3>
              {cafe.amenities.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm sm:text-base">
                  {cafe.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">Удобства не указаны</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cafe;
