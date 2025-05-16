import { useEffect, useState } from "react";
import { axiosInstance } from "../axiosInstance/userAxios";

interface SubCategory {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
    subCategories: SubCategory[];
}

const Sidebar = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axiosInstance.get("/product/categories");
            setCategories(res.data.categories);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    };

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <aside className="w-64 p-6 border-r border-gray-200 font-sans text-gray-900" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            <div className="flex items-center gap-2 mb-8 cursor-pointer select-none text-gray-700 hover:text-gray-900">
                <span className="text-base font-bold">Home</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </div>

            <h2 className="text-xl font-semibold mb-6 text-blue-900">Categories</h2>
            <ul className="space-y-3">
                <li className="font-normal text-base text-gray-700 cursor-pointer hover:text-blue-600 transition-colors">
                    All categories
                </li>
                {categories.map((category) => {
                    const isExpanded = expandedCategories.has(category._id);
                    return (
                        <li key={category._id} className="ml-1">
                            <div
                                className="flex justify-between items-center font-normal text-lg mb-2 text-gray-700 cursor-pointer hover:text-black transition-colors"
                                onClick={() => toggleCategory(category._id)}
                            >
                                <span>{category.name}</span>
                                <svg
                                    className={`h-5 w-5 transform transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                            {isExpanded && category.subCategories && category.subCategories.length > 0 && (
                                <ul className="ml-5 space-y-1">
                                    {category.subCategories.map((sub) => (
                                        <li
                                            key={sub._id}
                                            className="cursor-pointer hover:text-blue-500 transition-colors flex items-center gap-2 text-sm text-gray-700"
                                        >
                                            <input
                                                type="checkbox"
                                                className="rounded-sm border-gray-300 focus:ring-2 focus:ring-blue-400"
                                            />
                                            <span>{sub.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;
