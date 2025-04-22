import React from 'react';
import Layout from "./Layout/Layout";
import Hero from "./components/Hero";
import About from "./components/about";
import {BrowserRouter, Routes, Route} from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout component={Hero}/>} />
      <Route path="/about" element={<Layout component={About}/>} />
      {/* <Route path='/admin' element={<Admin/>} /> */}
      {/* <Route path='/Hotel/:id' element={<Layout component={Hotel}/>} /> */}
    </Routes>
    </BrowserRouter> 
  );
}

export default App;
