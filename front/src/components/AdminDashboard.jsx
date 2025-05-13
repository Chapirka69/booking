import React, { useState, useContext } from "react";
import { AuthContext } from "../App";

const availableAmenities = [
  "Бесплатный Wi-Fi",
  "Парковка",
  "Бассейн",
  "Фитнес-центр",
  "Спа",
  "Ресторан",
  "Кафе",
  "Кондиционер",
  "Трансфер от/до аэропорта",
  "Круглосуточная стойка регистрации",
  "Номера для некурящих",
  "Семейные номера",
  "Бар",
  "Терраса",
  "Сад",
  "Лифт",
  "Доступ для инвалидов",
  "Завтрак включён",
  "Детская площадка",
  "Прачечная",
];

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("hotel");
  const [hotelForm, setHotelForm] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    imageUrl: "",
    rating: "",
    roomsFor1: "",
    roomsFor2: "",
    roomsFor3: "",
    roomsFor4: "",
    roomsFor5: "",
    roomsFor6: "",
    hasRestaurant: false,
    hasCafe: false,
    amenities: [],
  });
  const [cafeForm, setCafeForm] = useState({
    name: "",
    location: "",
    description: "",
    imageUrl: "",
    type: "Cafe",
    rating: "",
    amenities: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleHotelChange = (e) => {
    const { name, value, type, checked } = e.target;
    setHotelForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCafeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCafeForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleHotelAmenityChange = (amenity) => {
    setHotelForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleCafeAmenityChange = (amenity) => {
    setCafeForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          ...hotelForm,
          rooms: [
            ...Array(parseInt(hotelForm.roomsFor1) || 0).fill(1),
            ...Array(parseInt(hotelForm.roomsFor2) || 0).fill(2),
            ...Array(parseInt(hotelForm.roomsFor3) || 0).fill(3),
            ...Array(parseInt(hotelForm.roomsFor4) || 0).fill(4),
            ...Array(parseInt(hotelForm.roomsFor5) || 0).fill(5),
            ...Array(parseInt(hotelForm.roomsFor6) || 0).fill(6),
          ],
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Отель успешно добавлен");
        setError("");
        setHotelForm({
          name: "",
          location: "",
          description: "",
          price: "",
          imageUrl: "",
          rating: "",
          roomsFor1: "",
          roomsFor2: "",
          roomsFor3: "",
          roomsFor4: "",
          roomsFor5: "",
          roomsFor6: "",
          hasRestaurant: false,
          hasCafe: false,
          amenities: [],
        });
      } else {
        setError(data.error || "Ошибка при добавлении отеля");
      }
    } catch (err) {
      setError("Не удалось добавить отель");
    }
  };

  const handleCafeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/cafes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          ...cafeForm,
          type: cafeForm.type.toUpperCase(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Кафе/ресторан успешно добавлен");
        setError("");
        setCafeForm({
          name: "",
          location: "",
          description: "",
          imageUrl: "",
          type: "Cafe",
          rating: "",
          amenities: [],
        });
      } else {
        setError(data.error || "Ошибка при добавлении кафе/ресторана");
      }
    } catch (err) {
      setError("Не удалось добавить кафе/ресторан");
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="p-6 text-center text-red-500">
        Доступ только для администраторов
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      <div className="text-black max-w-7xl mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-800">
          Панель администратора
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("hotel")}
            className={`p-3 rounded-lg transition ${
              activeTab === "hotel"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Отель
          </button>
          <button
            onClick={() => setActiveTab("cafe")}
            className={`p-3 rounded-lg transition ${
              activeTab === "cafe"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Кафе
          </button>
        </div>

        {activeTab === "hotel" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Добавить отель
            </h3>
            <form
              onSubmit={handleHotelSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Название
                </label>
                <input
                  type="text"
                  name="name"
                  value={hotelForm.name}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Город</label>
                <input
                  type="text"
                  name="location"
                  value={hotelForm.location}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={hotelForm.description}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Цена за ночь (₽)
                </label>
                <input
                  type="number"
                  name="price"
                  value={hotelForm.price}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  URL изображения
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={hotelForm.imageUrl}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Рейтинг (0-10)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={hotelForm.rating}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Номера для 1 человека
                </label>
                <input
                  type="number"
                  name="roomsFor1"
                  value={hotelForm.roomsFor1}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Номера для 2 человек
                </label>
                <input
                  type="number"
                  name="roomsFor2"
                  value={hotelForm.roomsFor2}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Номера для 3 человек
                </label>
                <input
                  type="number"
                  name="roomsFor3"
                  value={hotelForm.roomsFor3}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Номера для 4 человек
                </label>
                <input
                  type="number"
                  name="roomsFor4"
                  value={hotelForm.roomsFor4}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Номера для 5 человек
                </label>
                <input
                  type="number"
                  name="roomsFor5"
                  value={hotelForm.roomsFor5}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Номера для 6 человек
                </label>
                <input
                  type="number"
                  name="roomsFor6"
                  value={hotelForm.roomsFor6}
                  onChange={handleHotelChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Удобства
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={hotelForm.amenities.includes(amenity)}
                        onChange={() => handleHotelAmenityChange(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasRestaurant"
                    checked={hotelForm.hasRestaurant}
                    onChange={handleHotelChange}
                    className="mr-2"
                  />
                  Ресторан
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasCafe"
                    checked={hotelForm.hasCafe}
                    onChange={handleHotelChange}
                    className="mr-2"
                  />
                  Кафе
                </label>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Добавить отель
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "cafe" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-800">
              Добавить кафе/ресторан
            </h3>
            <form
              onSubmit={handleCafeSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Название
                </label>
                <input
                  type="text"
                  name="name"
                  value={cafeForm.name}
                  onChange={handleCafeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Город</label>
                <input
                  type="text"
                  name="location"
                  value={cafeForm.location}
                  onChange={handleCafeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={cafeForm.description}
                  onChange={handleCafeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  URL изображения
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={cafeForm.imageUrl}
                  onChange={handleCafeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Тип</label>
                <select
                  name="type"
                  value={cafeForm.type}
                  onChange={handleCafeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Cafe">Кафе</option>
                  <option value="Restaurant">Ресторан</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Рейтинг (0-10)
                </label>
                <input
                  type="number"
                  name="rating"
                  value={cafeForm.rating}
                  onChange={handleCafeChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Удобства
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cafeForm.amenities.includes(amenity)}
                        onChange={() => handleCafeAmenityChange(amenity)}
                        className="mr-2"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Добавить кафе/ресторан
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
