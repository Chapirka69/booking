import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

function HotelDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [hotel, setHotel] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        const data = await response.json();
        if (response.ok) {
          setHotel(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Не удалось загрузить отель");
      } finally {
        setLoading(false);
      }
    };

    const fetchBookedDates = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/hotels/${id}/booked-dates?guestCount=${
            adults + children
          }`
        );
        const data = await response.json();
        if (response.ok) {
          setBookedDates(data.fullyBookedDates);
        } else {
          console.error("Ошибка загрузки занятых дат:", data.error);
        }
      } catch (err) {
        console.error("Ошибка запроса занятых дат:", err);
      }
    };

    fetchHotel();
    fetchBookedDates();
  }, [id, adults, children]);

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
    if (!checkInDate || !checkOutDate) return "Выберите даты";
    return `${formatDate(checkInDate)} — ${formatDate(checkOutDate)}`;
  };

  const displayGuests = () => {
    return `${adults} взрослых • ${children} детей`;
  };

  const GuestsModal = () => {
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
        <button
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setIsGuestsModalOpen(false)}
        >
          Закрыть
        </button>
      </div>
    );
  };

  const Calendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
      const dateStr = date.toISOString().split("T")[0];
      const isBooked = bookedDates.includes(dateStr);
      const isPast = date < today;
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
          className={`p-2 text-center rounded-full ${
            isBooked || isPast
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : isSelected
              ? "bg-blue-600 text-white cursor-pointer"
              : isInRange
              ? "bg-blue-200 cursor-pointer"
              : "hover:bg-gray-200 cursor-pointer"
          }`}
          onClick={() => {
            if (isBooked || isPast) return;
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

  const handleBooking = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setError("Выберите даты бронирования");
      return;
    }
    if (adults + children === 0) {
      setError("Выберите количество гостей");
      return;
    }

    const guestCount = adults + children;
    const hotelId = parseInt(id);
    if (isNaN(hotelId)) {
      setError("Некорректный ID отеля");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setError("Токен авторизации отсутствует. Пожалуйста, войдите снова.");
        navigate("/auth");
        return;
      }

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          guestCount,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Бронирование успешно! Проверьте ваш профиль.");
        setError("");
        const bookedDatesResponse = await fetch(
          `http://localhost:5000/api/hotels/${id}/booked-dates?guestCount=${guestCount}`
        );
        const bookedDatesData = await bookedDatesResponse.json();
        if (bookedDatesResponse.ok) {
          setBookedDates(bookedDatesData.fullyBookedDates);
        }
      } else {
        setError(data.error || "Ошибка при бронировании");
      }
    } catch (err) {
      console.error("Ошибка запроса:", err);
      setError("Не удалось создать бронирование");
    }
  };

  const renderStars = (rating) => {
    if (!rating) return "Без рейтинга";
    const stars = Math.round(rating / 2);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  if (loading || !hotel) {
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
                navigate(`/edit/hotel/${id}`, {
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
              {hotel.name}
            </h1>
            <p className="text-yellow-500 text-sm">
              {renderStars(hotel.rating)}
            </p>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">{hotel.location}</p>
          <div className="mt-4 w-full h-64 sm:h-96 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={
                hotel.imageUrl ||
                "https://via.placeholder.com/1200x400?text=Hotel"
              }
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/1200x400?text=Hotel";
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-800">
              Об отеле
            </h2>
            <p className="text-gray-700 text-sm sm:text-base">
              {hotel.description}
            </p>
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-800">
                Удобства
              </h3>
              {hotel.amenities.length > 0 ? (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 text-sm sm:text-base">
                  {hotel.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">Удобства не указаны</p>
              )}
            </div>
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-800">
                Питание
              </h3>
              <ul className="text-gray-600 text-sm sm:text-base">
                {hotel.hasRestaurant && <li>Ресторан на территории</li>}
                {hotel.hasCafe && <li>Кафе на территории</li>}
                {!hotel.hasRestaurant && !hotel.hasCafe && (
                  <li>Рестораны и кафе не указаны</li>
                )}
              </ul>
            </div>
            <div className="mt-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-2 text-blue-800">
                Номера
              </h3>
              <ul className="text-gray-600 text-sm sm:text-base">
                {hotel.rooms && hotel.rooms.length > 0 ? (
                  Object.entries(
                    hotel.rooms.reduce((acc, room) => {
                      acc[room.capacity] = (acc[room.capacity] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(
                    ([capacity, count]) =>
                      count > 0 && (
                        <li key={capacity}>
                          Номера для {capacity} человек: {count}
                        </li>
                      )
                  )
                ) : (
                  <li>Номера не указаны</li>
                )}
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-800">
              Забронировать
            </h2>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            {success && (
              <p className="text-green-500 mb-4 text-sm">{success}</p>
            )}
            <div className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Даты проживания
                </label>
                <input
                  type="text"
                  value={displayDateRange()}
                  onClick={() => setIsDateModalOpen(!isDateModalOpen)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  readOnly
                />
                {isDateModalOpen && (
                  <div className="absolute z-10 mt-2">
                    <Calendar />
                    <button
                      className="mt-2 p-2 bg-gray-300 rounded-lg w-full hover:bg-gray-400 transition"
                      onClick={() => setIsDateModalOpen(false)}
                    >
                      Закрыть
                    </button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Гостей
                </label>
                <input
                  type="text"
                  value={displayGuests()}
                  onClick={() => setIsGuestsModalOpen(!isGuestsModalOpen)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  readOnly
                />
                {isGuestsModalOpen && (
                  <div className="absolute z-10 mt-2">
                    <GuestsModal />
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  Цена: {hotel.price} ₽/ночь
                </p>
              </div>
              <button
                onClick={handleBooking}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
              >
                Забронировать
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;
