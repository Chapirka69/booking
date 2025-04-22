import React, { useState } from 'react';

// Модальное окно для выбора количества людей
const GuestsModal = ({ onClose, setAdults, adults, setChildren, children, setRooms, rooms }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg">Взрослые</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAdults(adults > 1 ? adults - 1 : 1)}
            className="p-3 border rounded-lg text-[10px]"
          >
            -
          </button>
          <span className="text-lg">{adults}</span>
          <button
            onClick={() => setAdults(adults + 1)}
            className="p-3 border rounded-lg text-[10px]"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg">Дети</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setChildren(children > 0 ? children - 1 : 0)}
            className="p-3 border rounded-lg text-[10px]"
          >
            -
          </button>
          <span className="text-lg">{children}</span>
          <button
            onClick={() => setChildren(children + 1)}
            className="p-3 border rounded-lg text-[10px]"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg">Номера</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setRooms(rooms > 1 ? rooms - 1 : 1)}
            className="p-3 border rounded-lg text-[10px]"
          >
            -
          </button>
          <span className="text-lg">{rooms}</span>
          <button
            onClick={() => setRooms(rooms + 1)}
            className="p-3 border rounded-lg text-[10px]"
          >
            +
          </button>
        </div>
      </div>
      <button
        className="w-full p-3 bg-gray-300 rounded-lg text-lg"
        onClick={onClose}
      >
        Закрыть
      </button>
    </div>
  );
};

// Функция форматирования количества людей и номеров
const displayGuests = (adults, children, rooms) => {
  return `${adults} взрослых • ${children} детей • ${rooms} номер${rooms > 1 ? 'а' : ''}`;
};

function Hero() {
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);

  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  // Функция для переключения состояния модального окна (открыть/закрыть)
  const toggleDateModal = () => {
    setIsDateModalOpen(!isDateModalOpen);
  };

  // Функция для переключения состояния модального окна для гостей
  const toggleGuestsModal = () => {
    setIsGuestsModalOpen(!isGuestsModalOpen);
  };

  // Форматирование даты в нужный вид: "пт. 25 апр."
  const formatDate = (date) => {
    if (!date) return '';
    const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${dayOfWeek}. ${day} ${month}`;
  };

  // Форматирование выбранного диапазона дат
  const displayDateRange = () => {
    if (!checkInDate || !checkOutDate) return 'Дата заезда — Дата отъезда';
    return `${formatDate(checkInDate)} — ${formatDate(checkOutDate)}`;
  };

  // Простой календарь для выбора дат
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
              ? 'bg-blue-600 text-white'
              : isInRange
              ? 'bg-blue-200'
              : 'hover:bg-gray-200'
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
      <div className="p-4 bg-white rounded-lg shadow-lg">
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
            className="p-2"
          >
            {"<"}
          </button>
          <h3 className="text-lg font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString('ru', {
              month: 'long',
              year: 'numeric',
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
            className="p-2"
          >
            {">"}
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'].map((day, idx) => (
            <div key={idx} className="font-semibold">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      {/* Верхняя часть с синим фоном и поиском */}
      <div className="bg-blue-800 text-white min-h-[400px] flex flex-col justify-center items-center p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Найдите жилье для новой поездки
        </h1>
        <p className="text-lg md:text-xl mb-6 text-center">
          Ищите спецпредложения на отели, дома и другие варианты.
        </p>

        {/* Search Bar */}
        <div className="bg-white text-black p-4 rounded-lg shadow-lg w-full max-w-4xl flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Куда вы хотите поехать?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1 w-full relative">
            <input
              type="text"
              value={displayDateRange()}
              onClick={toggleDateModal}
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
              onClick={toggleGuestsModal}
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
          <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition w-full md:w-auto">
            Найти
          </button>
        </div>
      </div>

      {/* Секция Спецпредложения */}
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Спецпредложения</h2>
        <p className="text-gray-600 mb-6">
          Акции, скидки и специальные предложения для вас.
        </p>
        <div className="flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">
              Корочка поездка для отличного отдыха
            </h3>
            <p className="text-gray-600 mb-4">
              Сэкономьте до 20% с сезонным предложением
            </p>
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
              Сэкономить
            </button>
          </div>
          <div className="w-full md:w-48 h-32 bg-gray-300 rounded-lg mt-4 md:mt-0 md:ml-4">
            {/* Здесь должно быть изображение для акции */}
          </div>
        </div>
      </div>

      {/* Секция Популярные направления */}
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Лятвы — откройте для себя эту страну
        </h2>
        <p className="text-gray-600 mb-6">
          В этих популярных местах вы точно найдёте что-то для себя.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-32 bg-gray-300">
              {/* Здесь должно быть изображение для Пуры */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Пура</h3>
              <p className="text-gray-600 text-sm">
                1 606 вариантов размещения
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-32 bg-gray-300">
              {/* Здесь должно быть изображение для Юмены */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Юмена</h3>
              <p className="text-gray-600 text-sm">
                373 варианта размещения
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-32 bg-gray-300">
              {/* Здесь должно быть изображение для Норманы */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Нормана</h3>
              <p className="text-gray-600 text-sm">
                472 варианта размещения
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-32 bg-gray-300">
              {/* Здесь должно быть изображение для Лесис */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Лесис</h3>
              <p className="text-gray-600 text-sm">
                67 вариантов размещения
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-32 bg-gray-300">
              {/* Здесь должно быть изображение для Сурынары */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Сурынара</h3>
              <p className="text-gray-600 text-sm">
                62 варианта размещения
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Секция Поиск по типу размещения */}
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Поиск по типу размещения
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="w-full h-32 bg-gray-300">
              {/* Здесь должно быть изображение для Отелей */}
            </div>
            <div className="p-4">
              <h3 className="font-semibold">Отели</h3>
              <p className="text-gray-600 text-sm">
                334 варианта
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;