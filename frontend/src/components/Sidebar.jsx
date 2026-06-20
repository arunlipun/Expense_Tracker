import React from 'react'

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = () => {
  const navigate = useNavigate();
  

  const isPremium = JSON.parse(localStorage.getItem("premiumUser") || "false");
  const menuItems = [
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

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-screen">
      
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Navigation
        </h2>
      </div>

      <nav className="px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `
              block
              px-4
              py-3
              rounded-lg
              mb-2
              transition
              ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }
              `
            }
          >
            {item.name}
          </NavLink>
        ))}
        <button
  onClick={handleLogout}
  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
>
  Logout
</button>
      </nav>

      

    </aside>
  );
};

export default Sidebar;