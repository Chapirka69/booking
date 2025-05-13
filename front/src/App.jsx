import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout/Layout";
import Hero from "./components/Hero";
import About from "./components/About";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import Profile from "./components/Profile";
import HotelDetails from "./components/HotelDetails";
import Cafe from "./components/Cafe";
import EditHotel from "./components/EditHotel";
import EditCafe from "./components/EditCafe";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            localStorage.removeItem("access_token");
            setUser(null);
          }
        } catch (err) {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout component={Hero} />} />
          <Route path="/about" element={<Layout component={About} />} />
          <Route path="/auth" element={<Layout component={Auth} />} />
          <Route
            path="/admin"
            element={
              user?.role === "ADMIN" ? (
                <Layout component={AdminDashboard} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? <Layout component={Profile} /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/hotel/:id"
            element={<Layout component={HotelDetails} />}
          />
          <Route path="/cafe/:id" element={<Layout component={Cafe} />} />
          <Route path="/edit/hotel/:id" element={<EditHotel />} />
          <Route path="/edit/cafe/:id" element={<EditCafe />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
