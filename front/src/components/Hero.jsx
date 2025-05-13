import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";

const GuestsModal = ({
  onClose,
  setAdults,
  adults,
  setChildren,
  children,
  setRooms,
  rooms,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium">Взрослые</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
            className="p-2 border rounded-full text-sm hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-lg">{adults}</span>
          <button
            onClick={() => setAdults(adults + 1)}
            className="p-2 border rounded-full text-sm hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium">Дети</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setChildren(children > 0 ? children - 1 : 0)}
            className="p-2 border rounded-full text-sm hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-lg">{children}</span>
          <button
            onClick={() => setChildren(children + 1)}
            className="p-2 border rounded-full text-sm hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium">Номера</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setRooms(rooms > 1 ? rooms - 1 : 1)}
            className="p-2 border rounded-full text-sm hover:bg-gray-100"
          >
            -
          </button>
          <span className="text-lg">{rooms}</span>
          <button
            onClick={() => setRooms(rooms + 1)}
            className="p-2 border rounded-full text-sm hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </div>
      <button
        className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  );
};

const displayGuests = (adults, children, rooms) => {
  return `${adults} взрослых • ${children} детей • ${rooms} номер${
    rooms > 1 ? "а" : ""
  }`;
};

function Hero() {
  const { user } = useContext(AuthContext);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [location, setLocation] = useState("");
  const [hotels, setHotels] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (searchParams = {}) => {
    try {
      const query = new URLSearchParams(searchParams);
      const response = await fetch(
        `http://localhost:5000/api/hotels?${query.toString()}`
      );
      const data = await response.json();
      if (response.ok) {
        setHotels(data.hotels);
        setCafes(data.cafes);
        setMessage(data.message);
        setError("");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Не удалось загрузить данные");
    }
  };

  const handleSearch = async () => {
    const params = {};
    if (location) params.location = location;
    if (checkInDate) params.checkInDate = checkInDate.toISOString();
    if (checkOutDate) params.checkOutDate = checkOutDate.toISOString();
    params.adults = adults;
    params.children = children;
    await fetchData(params);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const days = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
    const months = [
      "янв",
      "фев",
      "мар",
      "апр",
      "май",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "ноя",
      "дек",
    ];
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayOfWeek}. ${day} ${month}`;
  };

  const displayDateRange = () => {
    if (!checkInDate || !checkOutDate) return "Дата заезда — Дата отъезда";
    return `${formatDate(checkInDate)} — ${formatDate(checkOutDate)}`;
  };

  const Calendar = () => {
    const today = new Date();

    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSelected =
        (checkInDate && date.toDateString() === checkInDate.toDateString()) ||
        (checkOutDate && date.toDateString() === checkOutDate.toDateString());
      const isInRange =
        checkInDate &&
        checkOutDate &&
        date > checkInDate &&
        date < checkOutDate;

      days.push(
        <div
          key={i}
          className={`p-2 text-center cursor-pointer rounded-full ${
            isSelected
              ? "bg-blue-600 text-white"
              : isInRange
              ? "bg-blue-200"
              : "hover:bg-gray-200"
          }`}
          onClick={() => {
            if (!checkInDate || (checkInDate && checkOutDate)) {
              setCheckInDate(date);
              setCheckOutDate(null);
            } else if (date > checkInDate) {
              setCheckOutDate(date);
              setIsDateModalOpen(false);
            } else {
              setCheckInDate(date);
              setCheckOutDate(null);
            }
          }}
        >
          {i}
        </div>
      );
    }

    return (
      <div className="p-4 bg-white rounded-lg shadow-lg max-w-md">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {"<"}
          </button>
          <h3 className="text-lg font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString("ru", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            {">"}
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["пн", "вт", "ср", "чт", "пт", "сб", "вс"].map((day, idx) => (
            <div key={idx} className="font-semibold text-sm">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  const renderStars = (rating) => {
    if (!rating) return "Без рейтинга";
    const stars = Math.round(rating / 2);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="bg-blue-700 text-white min-h-[400px] flex flex-col justify-center items-center p-4 sm:p-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center">
          Найдите идеальное жильё для поездки
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-6 text-center">
          Отели, апартаменты и дома по лучшим ценам
        </p>

        <div className="bg-white text-black p-4 rounded-lg shadow-lg w-full max-w-5xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Куда вы хотите поехать?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={displayDateRange()}
              onClick={() => setIsDateModalOpen(!isDateModalOpen)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            {isDateModalOpen && (
              <div className="absolute top-14 left-0 z-10">
                <Calendar />
                <button
                  className="mt-2 p-2 bg-gray-300 rounded-lg w-full"
                  onClick={() => setIsDateModalOpen(false)}
                >
                  Закрыть
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={displayGuests(adults, children, rooms)}
              onClick={() => setIsGuestsModalOpen(!isGuestsModalOpen)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              readOnly
            />
            {isGuestsModalOpen && (
              <div className="absolute top-14 left-0 z-10 w-full">
                <GuestsModal
                  onClose={() => setIsGuestsModalOpen(false)}
                  setAdults={setAdults}
                  adults={adults}
                  setChildren={setChildren}
                  children={children}
                  setRooms={setRooms}
                  rooms={rooms}
                />
              </div>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
          >
            Найти
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800">
          Доступные отели
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {message && <p className="text-blue-800 mb-4">{message}</p>}
        {hotels.length === 0 && !message ? (
          <p className="text-gray-600">Отели загружаются...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotels.map((hotel) => (
              <Link
                to={`/hotel/${hotel.id}`}
                key={hotel.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="w-full h-48 bg-gray-200">
                  <img
                    src={
                      hotel.imageUrl ||
                      "https://via.placeholder.com/400x200?text=Hotel"
                    }
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Hotel";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {hotel.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{hotel.location}</p>
                  <p className="text-yellow-500 text-sm mt-1">
                    {renderStars(hotel.rating)}
                  </p>
                  <p className="text-gray-800 font-medium mt-2">
                    от {hotel.price} ₽/ночь
                  </p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {hotel.description}
                  </p>
                  {hotel.amenities.length > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                      Удобства: {hotel.amenities.join(", ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-800">
          Кафе и рестораны
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {cafes.length === 0 ? (
          <p className="text-gray-600">Кафе и рестораны загружаются...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cafes.map((cafe) => (
              <Link
                to={`/cafe/${cafe.id}`}
                key={cafe.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="w-full h-48 bg-gray-200">
                  <img
                    src={
                      cafe.imageUrl ||
                      "https://via.placeholder.com/400x200?text=Cafe"
                    }
                    alt={cafe.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200?text=Cafe";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-blue-800">
                    {cafe.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{cafe.location}</p>
                  <p className="text-yellow-500 text-sm mt-1">
                    {renderStars(cafe.rating)}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {cafe.description}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {cafe.type === "Cafe" ? "Кафе" : "Ресторан"}
                  </p>
                  {cafe.amenities.length > 0 && (
                    <p className="text-gray-600 text-sm mt-1">
                      Удобства: {cafe.amenities.join(", ")}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
