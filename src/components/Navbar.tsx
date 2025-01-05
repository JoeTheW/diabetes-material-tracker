'use client';

import { Bars3Icon, CalendarDaysIcon, HomeIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { useState } from 'react';
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // Function to close the drawer when a link is clicked
  const closeDrawer = () => setDrawerOpen(false);

  const getPageName = (pathname: string): string => {
    switch (pathname) {
      case '/':
        return 'Home';
      case '/inventory':
        return 'Inventory';
      case '/about':
        return 'About Us';
      case '/inventory/detail':
        return 'Details';
      case '/inventory/calendar':
        return 'Calendar';
      default:
        return pathname.split('/').pop() || 'Unknown page';
    }
  };

  const currentPage = getPageName(pathname);

  return (
    <div className="drawer drawer-mobile">
      {/* The main layout */}
      <input
        id="drawer-toggle"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={toggleDrawer}
      />
      <div className="drawer-content">
        {/* Basic Navbar */}
        <div className="flex justify-between pt-5 items-center px-4">
          {/* Basic controls (like theme toggle) */}
          <div className="flex justify-between items-center gap-5">
          
            <label htmlFor="drawer-toggle" className="btn btn-ghost">
            <Bars3Icon className="w-10 h-10" />
            </label>

            <p className="font-semibold">{currentPage}</p>
          </div>
        </div>
      </div>

      {/* Side Menu Drawer (Sidebar) */}
      <div className="drawer-side z-50">
        <label htmlFor="drawer-toggle" className="drawer-overlay" />
        <div className="flex flex-col p-4 h-full w-80 bg-base-100 text-base-content">
            <h1 className="px-2">Supply tracker</h1>

            <ul className="">
            <div className="divider divider-start"><span className="text-sm">theme</span></div>
            <ThemeSwitcher/>

            <div className="divider divider-start"><span className="text-sm">Navigation</span></div>
            <li>
                <Link href="/" onClick={closeDrawer} className="btn btn-ghost">
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
                </Link>
            </li>
            <li>
                <Link href="/inventory" onClick={closeDrawer} className="btn btn-ghost">
                    <TableCellsIcon className="w-5 h-5" />
                    <span>Inventory</span>
                </Link>
            </li>
            <li>
                <Link href="/inventory/calendar" onClick={closeDrawer} className="btn btn-ghost">
                    <CalendarDaysIcon className="w-5 h-5" />
                    <span>Calendar</span>
                </Link>
            </li>
            </ul>
        </div>
      </div>
    </div>
  );


};

export default Navbar;
