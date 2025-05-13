import React from "react";
import Footer from "./Footer";
import Header from "./Header";
function Layout({ component: Component }) {
  return (
    <>
      <Header />
      <Component />
      <Footer />
    </>
  );
}
export default Layout;
