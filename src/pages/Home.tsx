import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Product } from "../interfaces/ProductInterface";
import { axiosInstance } from "../axiosInstance/userAxios";
import AddCategoryDropdown from "../components/AddCategoryModal";
import AddSubCategoryModal from "../components/AddSubCategoryModal";
import WishlistDropdown from "../components/WishListDropdown";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);
    const [wishlist, setWishlist] = useState<string[]>([]);


    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const fetchAllProducts = async () => {
        try {
            const res = await axiosInstance.get("/product/fetch-product");
            setProducts(res.data.products);
        } catch (error) {
            toast.error("Failed to fetch products.");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchAllProducts();
            return;
        }
        try {
            const res = await axiosInstance.get("/product/search", {
                params: { query: searchQuery },
            });
            setProducts(res.data.results);
        } catch (error) {
            toast.error("Failed to search products.");
        }
    };

    const handleAddSubCategory = async (data: { categoryId: string; name: string }) => {
        try {
            await axiosInstance.post("/product/add-subcatogory", {
                categoryId: data.categoryId,
                name: data.name
            });
            toast.success("Subcategory added successfully");
            setShowSubcategoryDropdown(false);
        } catch (error) {
            toast.error("Failed to add subcategory");
        }
    };

    const handleCloseSubCategoryModal = () => {
        setShowSubcategoryDropdown(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
        toast.success(`Logout Successfull`)
    };


    const toggleWishlist = async (productId: string) => {
        const userId = localStorage.getItem("user");
        if (!userId) return toast.error("Please login to use wishlist.");

        try {
            const isInWishlist = wishlist.includes(productId);

            if (isInWishlist) {
                await axiosInstance.delete(`/product/wishlist/${userId}`, {
                    data: { productId },
                });
                setWishlist((prev) => prev.filter((id) => id !== productId));
                toast.success("Removed from wishlist");
            } else {
                await axiosInstance.post(`/product/wishlist/${userId}`, { productId });
                setWishlist((prev) => [...prev, productId]);
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error("Wishlist update failed");
        }
    };



    return (
        <div className="h-screen w-screen bg-white text-gray-800 overflow-hidden flex flex-col">
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
                        onClick={handleSearch}
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

            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 h-full overflow-auto border-r border-gray-200">
                    <Sidebar />
                </div>

                <main className="flex-1 p-6 overflow-auto flex flex-col">
                    <div className="flex justify-end space-x-4 mb-6 relative">
                        <AddCategoryDropdown
                            showDropdown={showCategoryDropdown}
                            setShowDropdown={setShowCategoryDropdown}
                        />
                        <AddSubCategoryModal
                            showDropdown={showSubcategoryDropdown}
                            setShowDropdown={setShowSubcategoryDropdown}
                            onAdd={handleAddSubCategory}
                            onClose={handleCloseSubCategoryModal}
                        />

                        <button
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="bg-[#f5a623] text-white px-4 py-2 rounded"
                        >
                            Add Category
                        </button>
                        <button
                            onClick={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                            className="bg-[#f5a623] text-white px-4 py-2 rounded"
                        >
                            Add Subcategory
                        </button>
                        <button className="bg-[#f5a623] text-white px-4 py-2 rounded">
                            Add Product
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500 text-lg mt-10">
                                No products available at the moment.
                            </p>
                        ) : (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="relative border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <button
                                        className={`absolute top-2 right-2 ${wishlist.includes(product._id) ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                                        onClick={() => toggleWishlist(product._id)}
                                    >
                                        <FaHeart />
                                    </button>
                                    <img
                                        src={product.images[0] || "https://via.placeholder.com/150"}
                                        alt={product.title}
                                        className="mx-auto mb-4 max-h-36 object-contain cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    />
                                    <h3 className="text-blue-600 font-semibold truncate">{product.title}</h3>
                                    <p className="text-gray-700 font-medium mt-2">
                                        ${product.variants[0]?.price ?? "N/A"}
                                    </p>
                                    <div className="flex space-x-1 mt-2 text-yellow-500">
                                        {[...Array(5)].map((_, star) => (
                                            <span key={star}>★</span>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex justify-between items-center mt-6">
                        <p className="text-sm text-gray-500">10 of 456 items</p>
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5, '...', 10].map((num, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1 rounded ${num === 1
                                        ? 'bg-[#f5a623] text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                            <select className="ml-4 text-sm border border-gray-300 rounded px-2 py-1">
                                <option>10 rows</option>
                                <option>20 rows</option>
                                <option>50 rows</option>
                            </select>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
