import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "./utils/NavDB";

// Constants for responsive navigation widths
const NAV_WIDTH = {
  xs: "80px",
  md: "170px",
  xl: "180px",
};

// Main navigation component
function NavBar() {
  const location = useLocation();

  return (
    <nav className={`col-span-2 border-r border-gray-200 min-h-[90vh] w-[${NAV_WIDTH.xs}] md:w-[${NAV_WIDTH.md}] xl:w-[${NAV_WIDTH.xl}] pt-8 px-1 flex flex-col items-start justify-between`}>
      <div className="space-y-8 w-full">
        {/* Render first set of navigation items */}
        {navLinks.slice(0, 3).map((link) => (
          <NavItem
            link={link}
            key={link.id}
            to={link.goTo}
            isActive={location.pathname === (link.goTo === "/" ? link.goTo : "/" + link.goTo)}
          />
        ))}
        {/* Separator line */}
        <div className="w-full border-t border-gray-200" />
        {/* Render second set of navigation items */}
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

// Individual navigation item component
function NavItem({ link, to, isActive }) {
  return (
    <div
      className={`w-full flex items-center justify-start space-x-8 px-3 cursor-pointer
         group hover:border-gray-900 ${isActive ? "border-l-4 border-gray-900" : "border-l-4 border-transparent"}`}
    >
      {/* Link to navigate to the specified route */}
      <Link to={to}>
        <span>{link.icon}</span>
        {/* Title of the navigation item */}
        <h1 className={`group-hover:text-black md:flex hidden ${isActive ? "text-black" : "text-gray-600"}`}>
          {link.title}
        </h1>
      </Link>
    </div>
  );
}

export default NavBar;
