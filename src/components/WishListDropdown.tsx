import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../axiosInstance/userAxios";
import type { Product } from "../interfaces/ProductInterface";
import { X } from "lucide-react";

interface WishlistDropdownProps {
    onRemove?: (id: string) => void;
}

export default function WishlistDropdown({ onRemove }: WishlistDropdownProps) {
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const userId = localStorage.getItem("user");

    useEffect(() => {
        if (userId) {
            fetchWishlistItems();
        }
    }, [userId]);

    const fetchWishlistItems = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get(`/product/wishlist/${userId}`);
            setWishlistItems(res.data.wishlist ?? []);
        } catch (error) {
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id: string) => {
        try {
            await axiosInstance.delete(`/product/wishlist/${userId}`, {
                data: { productId: id },
            });
            setWishlistItems((prev) => prev.filter((item) => item._id !== id));
            if (onRemove) onRemove(id);
            toast.success("Removed from wishlist");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    if (loading) {
        return <p className="p-4">Loading wishlist...</p>;
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="p-6 text-center text-gray-600">
                <p className="text-lg mb-2">💔 Your wishlist is empty.</p>
                <p>Add some products you like to see them here!</p>
            </div>
        );
    }

    return (
        <div className="bg-white w-[320px] shadow-xl h-full p-5 overflow-y-auto border-l">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-3 mb-4 text-center">Items</h2>
            <ul className="space-y-4">
                {wishlistItems.map((item) => (
                    <li
                        key={item._id}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center space-x-3">
                            <img
                                src={item.images?.[0] || "https://via.placeholder.com/60"}
                                alt={item.title}
                                className="w-14 h-14 object-cover rounded-lg"
                            />
                            <div className="text-sm">
                                <h4 className="font-medium text-gray-800">{item.title}</h4>
                                <p className="text-gray-600">${item.variants?.[0]?.price ?? "N/A"}</p>
                                <div className="text-yellow-400 text-xs">★★★★★</div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleRemove(item._id)}
                            className="text-gray-400 hover:text-red-500 transition"
                            title="Remove"
                        >
                            <X size={18} />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
