import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

function EditCafe() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    rating: "",
    type: "",
    amenities: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [amenityInput, setAmenityInput] = useState("");

  const from = location.state?.from || `/cafe/${id}`;

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      navigate("/");
      return;
    }

    const fetchCafe = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cafes/${id}`);
        const data = await response.json();
        if (response.ok) {
          setFormData({
            name: data.name || "",
            location: data.location || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            rating: data.rating ? data.rating.toString() : "",
            type: data.type || "",
            amenities: data.amenities || [],
          });
        } else {
          setError(data.error || "Ошибка загрузки данных");
        }
      } catch (err) {
        setError("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };
    fetchCafe();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()],
      }));
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Название обязательно");
      return;
    }
    if (!formData.location.trim()) {
      setError("Местоположение обязательно");
      return;
    }
    if (!formData.description.trim()) {
      setError("Описание обязательно");
      return;
    }
    if (!formData.type) {
      setError("Выберите тип (Кафе или Ресторан)");
      return;
    }
    if (
      formData.rating &&
      (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 10)
    ) {
      setError("Рейтинг должен быть числом от 0 до 10");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен авторизации отсутствует. Войдите снова.");
        navigate("/auth");
        return;
      }

      const body = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        imageUrl: formData.imageUrl || null,
        type: formData.type,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        amenities: formData.amenities,
      };

      const response = await fetch(`http://localhost:5000/api/cafes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        navigate(from);
      } else {
        setError(data.error || "Ошибка при обновлении");
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
      setError("Не удалось обновить данные");
    }
  };

  const handleCancel = () => {
    navigate(from);
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Загрузка...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-6">
          Редактировать кафе/ресторан
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Название
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Местоположение
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL изображения
            </label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Рейтинг (0-10)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.1"
              min="0"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Тип
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Выберите тип</option>
              <option value="CAFE">Кафе</option>
              <option value="RESTAURANT">Ресторан</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Удобства
            </label>
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Введите удобство"
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Добавить
              </button>
            </div>
            <ul className="mt-2 space-y-1">
              {formData.amenities.map((amenity, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-gray-600"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="p-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCafe;
