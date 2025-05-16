// import { useEffect, useState } from "react";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import WishlistDropdown from "./WishListDropdown";
// import type { Product } from "../interfaces/ProductInterface";
// import { axiosInstance } from "../axiosInstance/userAxios";

const Header = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showWishlist, setShowWishlist] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
        toast.success(`Logout Successfull`)
    };
    // useEffect(() => {
    //     fetchAllProducts();
    // }, []);

    // const fetchAllProducts = async () => {
    //     try {
    //         const res = await axiosInstance.get("/product/fetch-product");
    //         setProducts(res.data.products);
    //     } catch (error) {
    //         toast.error("Failed to fetch products.");
    //     }
    // };

    // const handleSearch = async () => {
    //     if (!searchQuery.trim()) {
    //         fetchAllProducts();
    //         return;
    //     }
    //     try {
    //         const res = await axiosInstance.get("/product/search", {
    //             params: { query: searchQuery },
    //         });
    //         setProducts(res.data.results);
    //     } catch (error) {
    //         toast.error("Failed to search products.");
    //     }
    // };

    return (
        <header className="bg-[#003b5c] text-white py-4 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4 w-full max-w-5xl mx-auto">
                <input
                    type="text"
                    placeholder="Search products"
                    className="flex-grow px-4 py-2 rounded-l-md text-black"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className="bg-[#f5a623] text-white px-4 py-2 rounded-r-md"
                // onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            <button
                onClick={() => setShowWishlist(prev => !prev)}
                className="relative"
                aria-label="Toggle Wishlist"
            >
                <FaHeart className="text-white text-xl" />
            </button>
            {showWishlist && (
                <div className="fixed top-16 right-0 w-80 bg-white shadow-lg rounded-lg z-50 max-h-[400px] overflow-y-auto border border-gray-300">
                    <WishlistDropdown />
                </div>
            )}
            <div className="hidden md:flex items-center space-x-6 px-4">
                {!isLoggedIn ? (
                    <>
                        <button onClick={() => navigate("/login")}>Sign in</button>
                        <button className="flex items-center space-x-1">
                            <span>🛒</span>
                            <span>Cart</span>
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                        <button className="flex items-center space-x-1">
                            <span>🛒</span>
                            <span>Cart</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header