import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import type { Product } from "../interfaces/ProductInterface";
import { axiosInstance } from "../axiosInstance/userAxios";
import AddCategoryDropdown from "../components/AddCategoryModal";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axiosInstance.get("/product/fetch-product");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching products", error);
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
      console.error("Search error:", error);
      toast.error("Failed to search products.");
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-gray-800 overflow-hidden flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="bg-[#003b5c] text-white py-4 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4 w-full max-w-5xl mx-auto">
          <input
            type="text"
            placeholder="Search any things"
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
        <button className="flex items-center space-x-1 hover:text-[#f5a623] ml-4">
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
        <div className="flex-shrink-0 w-64 h-full overflow-auto border-r border-gray-200">
          <Sidebar />
        </div>

        <main className="flex-1 p-6 overflow-auto flex flex-col">
          <div className="flex justify-end space-x-4 mb-6 flex-shrink-0 relative">
            <AddCategoryDropdown
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-[#f5a623] text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
            <button className="bg-[#f5a623] text-white px-4 py-2 rounded">
              Add Subcategory
            </button>
            <button className="bg-[#f5a623] text-white px-4 py-2 rounded">
              Add Product
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 flex-grow overflow-auto">
            {products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 text-lg mt-10">
                No products available at the moment.
              </p>
            ) : (
              products.map((product) => (
                <div
                  key={product._id}
                  className="relative border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition flex flex-col"
                  style={{ maxHeight: 350 }}
                >
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-yellow-500">
                    <FaHeart />
                  </button>

                  <img
                    src={product.images[0] || "https://via.placeholder.com/150"}
                    alt={product.title}
                    className="mx-auto mb-4 max-h-36 object-contain"
                    style={{ maxWidth: "100%" }}
                  />
                  <h3 className="text-blue-600 font-semibold hover:underline cursor-pointer truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-700 font-medium mt-2">
                    ${product.variants[0]?.price ?? "N/A"}
                  </p>
                  <div className="flex space-x-1 mt-auto text-gray-400">
                    {[...Array(5)].map((_, star) => (
                      <span key={star}>★</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center mt-6 flex-shrink-0">
            <p className="text-sm text-gray-500">
              {products.length} of {products.length} items
            </p>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5, "...", 10].map((num, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    num === 1
                      ? "bg-[#f5a623] text-white"
                      : "bg-gray-100 hover:bg-gray-200"
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
