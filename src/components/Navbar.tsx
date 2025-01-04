
import React from "react";
import ThemeToggle from "./ThemeSwitcher";
import Link from "next/link";

const Navbar = () => {
    return (
    <div>
        <ul className="flex justify-between pt-5 items-center">
        <div>
            <Link href="/">
                <li>Home</li>
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