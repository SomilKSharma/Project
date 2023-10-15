import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "./utils/NavDB";


function NavBar() {
  const location = useLocation();

  return (
    <nav className="col-span-2 border-r border-gray-200 min-h-[90vh] w-[80px] md:w-[170px] xl:w-[180px] pt-8 px-1 flex flex-col items-start justify-between">
      <div className="space-y-8 w-full">
        {navLinks.slice(0, 3).map((link) => (
          <NavItem
            link={link}
            key={link.id}
            to={link.goTo}
            isActive={location.pathname === link.goTo}
          />
        ))}
        <div className="w-full border-t border-gray-200" />
        {navLinks.slice(3, 6).map((link) => (
          <NavItem
            link={link}
            key={link.id}
            to={link.goTo}
            isActive={location.pathname === link.goTo}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({ link, to, isActive }) {
  return (
    
      <div
        className={`w-full flex items-center justify-start space-x-8 px-3 cursor-pointer
         group hover:border-gray-900 border-l-4 border-transparent ${isActive && "border-gray-900"}`}
      >
        <Link to={to}>
          <span> {link.icon}</span>
        
        <h1
          className={`text-gray-600 group-hover:text-black md:flex hidden ${isActive && "text-black"}`}
        >
          {link.title}
        </h1>
        </Link>
      </div>
   
  );
}

export default NavBar;
