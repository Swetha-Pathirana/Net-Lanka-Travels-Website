import React from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="nav">
        <Navbar/>
      </nav>

      <main className="content">
        {children}
      </main>

      <footer className="footer">
       <Footer/>
      </footer>
    </div>
  );
};

export default Layout;
