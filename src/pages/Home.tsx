import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { Product } from "../interfaces/ProductInterface";
import { axiosInstance } from "../axiosInstance/userAxios";
import AddCategoryDropdown from "../components/AddCategoryModal";
import AddSubCategoryModal from "../components/AddSubCategoryModal";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
    const navigate = useNavigate();

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
                <button className="flex items-center hover:text-[#f5a623] ml-4">
                    <FaHeart />
                </button>
                <div className="hidden md:flex items-center space-x-6 px-4">
                    <button onClick={() => navigate("/login")}>Sign in</button>
                    <button className="flex items-center space-x-1">
                        <span>🛒</span>
                        <span>Cart</span>
                    </button>
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
                                    <button className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500">
                                        <FaHeart />
                                    </button>
                                    <img
                                        src={product.images[0] || "https://via.placeholder.com/150"}
                                        alt={product.title}
                                        className="mx-auto mb-4 max-h-36 object-contain"
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
                </main>
            </div>
        </div>
    );
}
