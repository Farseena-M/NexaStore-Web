import { useState, useEffect } from "react";
import { axiosInstance } from "../axiosInstance/userAxios";

interface AddSubCategoryModalProps {
    onClose: () => void;
    onAdd: (data: { categoryId: string; name: string }) => Promise<void>;
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
}

const AddSubCategoryModal = ({ onClose, onAdd, showDropdown, setShowDropdown }: AddSubCategoryModalProps) => {
    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [subCategoryName, setSubCategoryName] = useState("");

    useEffect(() => {
        if (!showDropdown) return;
        axiosInstance
            .get("/product/categories")
            .then((res) => {
                setCategories(res.data.categories || []);
            })
            .catch((err) => console.error(err));
    }, [showDropdown]);

    const handleAdd = async () => {
        if (!selectedCategory || !subCategoryName.trim()) {
            alert("Please select a category and enter subcategory name");
            return;
        }
        try {
            await onAdd({ categoryId: selectedCategory, name: subCategoryName });
            setSelectedCategory("");
            setSubCategoryName("");
        } catch (error) {
            console.error(error);
        }
    };

    if (!showDropdown) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[350px] shadow-lg">
                <h2 className="text-xl font-semibold text-center mb-5">Add Sub Category</h2>

                <div className="space-y-4">
                    <select
                        className="w-full px-4 py-2 border rounded-xl text-gray-700 focus:outline-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        placeholder="Enter sub category name"
                        className="w-full px-4 py-2 border rounded-xl text-gray-700 focus:outline-none"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                    />
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                    <button
                        onClick={handleAdd}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                        ADD
                    </button>
                    <button
                        onClick={() => {
                            setShowDropdown(false);
                            onClose();
                            setSelectedCategory("");
                            setSubCategoryName("");
                        }}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                    >
                        DISCARD
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubCategoryModal;
