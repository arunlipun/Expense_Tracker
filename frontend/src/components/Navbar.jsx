import React from 'react'

import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isPremium =
  localStorage.getItem("isPremium") === "true";

const handleLogout = () => {

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("roles");
  localStorage.removeItem("userId");

localStorage.removeItem("premiumUser");
localStorage.removeItem("premiumPlan");
localStorage.removeItem("premiumActivatedAt");

  toast.success("User Logout Successfully");
  

  navigate("/");
};

  const navLinks = [
     {
      name: "Dashboard",
      path: "/dashboard",
    },
     ...(isPremium
    ? [
        {
          name: "Premium",
          path: "/premium",
        },
      ]
    : []),
    {
      name: "Add Expense",
      path: "/add-expense",
    },
    {
      name: "Expenses",
      path: "/expenses",
    },
     {
    name: "Add Income",
    path: "/add-income",
  },
   {
    name: "Income",
    path: "/income",
  },
  ];

  return (
    <nav className="bg-blue-600 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <h1 className="text-white text-xl font-semibold">
            Expense Tracker
          </h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-white font-medium border-b-2 border-white pb-1"
                    : "text-blue-100 hover:text-white transition"
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* <button
  onClick={handleLogout}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Logout
</button> */}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white text-2xl"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                {link.name}
              </NavLink>
            ))}
            <button
  onClick={handleLogout}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Logout
</button>
          </div>
        )}
        
      </div>
    </nav>
  );
};

export default Navbar;