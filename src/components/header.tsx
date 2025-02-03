"use client";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import { LogOut, ShoppingCart, User} from "lucide-react";
import {useCart} from "@/context/CartContext";
import Image from "next/image";

const Navbar = () => {
    const [token, setToken] = useState<string | null>(null);

    const {cartItemsCount} = useCart();

    useEffect(() => {
    
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };


    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center">
                        {/* Logo */}
                        <div className="flex items-center">

                            <Image src={"/logo.png"} alt={"logo"} width={50} height={50}/>
                            <Link href="/" className="flex-shrink-0 flex items-center ml-4 md:ml-0">
                                <span className="text-2xl font-bold text-blue-600">TechOasis</span>
                            </Link>
                        </div>


                    </div>

                    {/* Right Section */}
                    <div className="flex items-center">
                        {/* Cart Icon */}
                        <Link href="/cart" className="p-2 text-gray-700 hover:text-gray-900 relative">
                            <ShoppingCart size={24}/>
                            <span
                                className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                                {cartItemsCount}
                            </span>
                        </Link>

                        {/* User / Logout */}
                        {token ? (
                            <button onClick={handleLogout}
                                    className="p-2 text-red-600 hover:text-red-800 ml-4 flex items-center">
                                <LogOut size={24} className="mr-1"/>

                            </button>
                        ) : (
                            <Link href="/login" className="p-2 text-gray-700 hover:text-gray-900 ml-2">
                                <User size={24}/>
                            </Link>
                        )}
                    </div>
                </div>
            </div>


        </nav>
    );
};

export default Navbar;