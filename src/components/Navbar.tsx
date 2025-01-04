
import React from "react";
import ThemeToggle from "./ThemeSwitcher";
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
    return (
    <div>
        <ul className="flex justify-between pt-4 px-4 items-center">
        <div className="flex gap-2">
            <Link href="/" className="btn btn-ghost flex items-center gap-2">
                <HomeIcon className="w-5 h-5"/>
            </Link>

            <Link href="/inventory">
                <li className="btn btn-ghost">
                Inventory
                </li>
            </Link>
        </div>

        <div className="flex gap-5">
            <ThemeToggle/>
        </div>
        </ul>
    </div>
    );
};

export default Navbar;