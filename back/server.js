const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

app.use(cors());
app.use(express.json());

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Доступ запрещён" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Недействительный токен" });
    req.user = user;
    next();
  });
};

// Получение данных пользователя
app.get("/api/me", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    res.json(user);
  } catch (error) {
    console.error("Ошибка /api/me:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Регистрация пользователя
app.post("/api/register", async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "USER",
      },
    });
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res
      .status(201)
      .json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res
      .status(400)
      .json({ error: "Email уже существует или данные некорректны" });
  }
});

// Вход пользователя
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Пользователь не найден" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Неверный пароль" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка входа:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавление отеля (только для админа)
app.post("/api/hotels", authenticateToken, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Только для админов" });
  const {
    name,
    location,
    description,
    price,
    imageUrl,
    rating,
    rooms,
    hasRestaurant,
    hasCafe,
    amenities,
  } = req.body;
  try {
    if (!name || !location || !description || !price || !rooms || rooms.length === 0) {
      return res.status(400).json({ error: "Обязательные поля отсутствуют" });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Цена должна быть числом больше 0" });
    }
    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      return res.status(400).json({ error: "Рейтинг должен быть от 0 до 10" });
    }
    const hotel = await prisma.hotel.create({
      data: {
        name,
        location,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        rating: rating ? parseFloat(rating) : null,
        hasRestaurant: hasRestaurant || false,
        hasCafe: hasCafe || false,
        amenities: amenities || [],
        rooms: {
          create: rooms.map((capacity) => ({ capacity: parseInt(capacity) })),
        },
      },
    });
    res.status(201).json(hotel);
  } catch (error) {
    console.error("Ошибка добавления отеля:", error);
    res.status(400).json({ error: "Некорректные данные" });
  }
});

// Обновление отеля (только для админа)
app.put("/api/hotels/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Только для админов" });
  const { id } = req.params;
  const {
    name,
    location,
    description,
    price,
    imageUrl,
    rating,
    rooms,
    hasRestaurant,
    hasCafe,
    amenities,
  } = req.body;
  try {
    if (!name || !location || !description || !price || !rooms || rooms.length === 0) {
      return res.status(400).json({ error: "Обязательные поля отсутствуют" });
    }
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Цена должна быть числом больше 0" });
    }
    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      return res.status(400).json({ error: "Рейтинг должен быть от 0 до 10" });
    }
    const hotel = await prisma.hotel.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        rating: rating ? parseFloat(rating) : null,
        hasRestaurant: hasRestaurant || false,
        hasCafe: hasCafe || false,
        amenities: amenities || [],
      },
    });

    await prisma.room.deleteMany({
      where: { hotelId: parseInt(id) },
    });
    await prisma.room.createMany({
      data: rooms.map((capacity) => ({
        hotelId: parseInt(id),
        capacity: parseInt(capacity),
      })),
    });

    res.json(hotel);
  } catch (error) {
    console.error("Ошибка обновления отеля:", error);
    res.status(400).json({ error: "Некорректные данные или отель не найден" });
  }
});

// Добавление кафе/ресторана (только для админа)
app.post("/api/cafes", authenticateToken, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Только для админов" });
  const { name, location, description, imageUrl, type, rating, amenities } =
    req.body;
  try {
    if (!name || !location || !description || !type) {
      return res.status(400).json({ error: "Обязательные поля отсутствуют" });
    }
    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      return res.status(400).json({ error: "Рейтинг должен быть от 0 до 10" });
    }
    const cafe = await prisma.cafeRestaurant.create({
      data: {
        name,
        location,
        description,
        imageUrl: imageUrl || null,
        type,
        rating: rating ? parseFloat(rating) : null,
        amenities: amenities || [],
      },
    });
    res.status(201).json(cafe);
  } catch (error) {
    console.error("Ошибка добавления кафе:", error);
    res.status(400).json({ error: "Некорректные данные" });
  }
});

// Обновление кафе/ресторана (только для админа)
app.put("/api/cafes/:id", authenticateToken, async (req, res) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Только для админов" });
  const { id } = req.params;
  const { name, location, description, imageUrl, type, rating, amenities } =
    req.body;
  try {
    if (!name || !location || !description || !type) {
      return res.status(400).json({ error: "Обязательные поля отсутствуют" });
    }
    if (rating && (isNaN(rating) || rating < 0 || rating > 10)) {
      return res.status(400).json({ error: "Рейтинг должен быть от 0 до 10" });
    }
    const cafe = await prisma.cafeRestaurant.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        description,
        imageUrl: imageUrl || null,
        type,
        rating: rating ? parseFloat(rating) : null,
        amenities: amenities || [],
      },
    });
    res.json(cafe);
  } catch (error) {
    console.error("Ошибка обновления кафе:", error);
    res.status(400).json({ error: "Некорректные данные или кафе не найдено" });
  }
});

// Получение деталей кафе/ресторана
app.get("/api/cafes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cafe = await prisma.cafeRestaurant.findUnique({
      where: { id: parseInt(id) },
    });
    if (!cafe)
      return res.status(404).json({ error: "Кафе/ресторан не найден" });
    res.json(cafe);
  } catch (error) {
    console.error("Ошибка получения кафе:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получение отелей и кафе
app.get("/api/hotels", async (req, res) => {
  const { location, checkInDate, checkOutDate, adults, children } = req.query;
  const totalGuests = parseInt(adults || 0) + parseInt(children || 0);
  try {
    let hotels = await prisma.hotel.findMany({
      where: location
        ? { location: { contains: location, mode: "insensitive" } }
        : {},
      include: { rooms: true, bookings: true },
    });

    if (checkInDate && checkOutDate) {
      hotels = hotels.filter((hotel) => {
        const availableRooms = hotel.rooms.filter((room) => {
          if (room.capacity < totalGuests) return false;
          const conflictingBookings = hotel.bookings.filter((booking) => {
            return (
              booking.roomId === room.id &&
              new Date(booking.checkInDate) <= new Date(checkOutDate) &&
              new Date(booking.checkOutDate) >= new Date(checkInDate)
            );
          });
          return conflictingBookings.length === 0;
        });
        return availableRooms.length > 0;
      });
    }

    const cafes = await prisma.cafeRestaurant.findMany({
      where: location
        ? { location: { contains: location, mode: "insensitive" } }
        : {},
    });

    const message =
      hotels.length === 0
        ? location
          ? `В городе ${location} пока нет доступных отелей`
          : "Пока нет доступных отелей"
        : null;

    res.json({ hotels, cafes, message });
  } catch (error) {
    console.error("Ошибка получения отелей:", error);
    res.status(500).json({ error: "Ошибка сервера при загрузке данных" });
  }
});

// Получение деталей отеля
app.get("/api/hotels/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(id) },
      include: { rooms: true, bookings: true },
    });
    if (!hotel) return res.status(404).json({ error: "Отель не найден" });
    res.json(hotel);
  } catch (error) {
    console.error("Ошибка получения отеля:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получение занятых дат для отеля
app.get("/api/hotels/:id/booked-dates", async (req, res) => {
  const { id } = req.params;
  const { guestCount } = req.query;
  try {
    const parsedGuestCount = parseInt(guestCount) || 1;
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(id) },
      include: {
        rooms: {
          where: { capacity: { gte: parsedGuestCount } },
          include: { bookings: true },
        },
      },
    });
    if (!hotel) return res.status(404).json({ error: "Отель не найден" });

    const bookedDates = {};
    hotel.rooms.forEach((room) => {
      room.bookings.forEach((booking) => {
        let currentDate = new Date(booking.checkInDate);
        const endDate = new Date(booking.checkOutDate);
        while (currentDate <= endDate) {
          const dateStr = currentDate.toISOString().split("T")[0];
          bookedDates[dateStr] = (bookedDates[dateStr] || 0) + 1;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    });

    const fullyBookedDates = Object.keys(bookedDates).filter(
      (date) => bookedDates[date] >= hotel.rooms.length
    );

    res.json({ fullyBookedDates });
  } catch (error) {
    console.error("Ошибка получения занятых дат:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Бронирование отеля
app.post("/api/bookings", authenticateToken, async (req, res) => {
  const { hotelId, checkInDate, checkOutDate, guestCount } = req.body;
  console.log("Получены данные бронирования:", {
    hotelId,
    checkInDate,
    checkOutDate,
    guestCount,
  });

  try {
    if (!hotelId || isNaN(parseInt(hotelId))) {
      return res.status(400).json({ error: "Некорректный ID отеля" });
    }
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "Даты бронирования обязательны" });
    }
    if (!guestCount || guestCount < 1) {
      return res
        .status(400)
        .json({ error: "Количество гостей должно быть больше 0" });
    }

    const parsedHotelId = parseInt(hotelId);
    const parsedGuestCount = parseInt(guestCount);

    const hotel = await prisma.hotel.findUnique({
      where: { id: parsedHotelId },
      include: {
        rooms: {
          where: { capacity: { gte: parsedGuestCount } },
          include: { bookings: true },
        },
      },
    });
    if (!hotel) return res.status(404).json({ error: "Отель не найден" });

    const availableRoom = hotel.rooms.find((room) => {
      const conflictingBookings = room.bookings.filter((booking) => {
        return (
          new Date(booking.checkInDate) <= new Date(checkOutDate) &&
          new Date(booking.checkOutDate) >= new Date(checkInDate)
        );
      });
      return conflictingBookings.length === 0;
    });

    if (!availableRoom) {
      return res
        .status(400)
        .json({
          error: "Нет доступных номеров для указанного количества гостей и дат",
        });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        hotelId: parsedHotelId,
        roomId: availableRoom.id,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        guestCount: parsedGuestCount,
      },
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error("Ошибка бронирования:", error.message, error.stack);
    res.status(400).json({ error: `Ошибка бронирования: ${error.message}` });
  }
});

// Отмена бронирования
app.delete("/api/bookings/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });
    if (!booking)
      return res.status(404).json({ error: "Бронирование не найдено" });
    if (booking.userId !== req.user.id)
      return res
        .status(403)
        .json({ error: "Вы можете отменять только свои бронирования" });

    await prisma.booking.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Бронирование успешно отменено" });
  } catch (error) {
    console.error("Ошибка отмены бронирования:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Получение профиля пользователя с бронированиями
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        bookings: {
          include: { hotel: true, room: true },
        },
      },
    });
    res.json(user);
  } catch (error) {
    console.error("Ошибка получения профиля:", error);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));