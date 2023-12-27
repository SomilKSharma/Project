import { CogIcon, LogoutIcon, ShoppingCartIcon, TemplateIcon, UserIcon } from "@heroicons/react/outline";

export const navLinks = [
  {
    id: 0,
    title: "Dashboard",
    icon: <TemplateIcon className="nav-icon" />,
    goTo: "/"
  },
  {
    id: 1,
    title: "Book Room",
    icon: <ShoppingCartIcon className="nav-icon" />,
    goTo: "newBook"
  },
  {
    id: 2,
    title: "View Bookings",
    icon: <UserIcon className="nav-icon" />,
    goTo: "viewBook"
  },
  {
    id: 4,
    title: "Settings",
    icon: <CogIcon className="nav-icon" />,
  },
  {
    id: 5,
    title: "LogOut",
    icon: <LogoutIcon className="nav-icon" />,
  },
];
