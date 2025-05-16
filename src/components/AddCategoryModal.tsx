import { useRef, useEffect, useState } from 'react';
import { axiosInstance } from '../axiosInstance/userAxios';
import { toast } from 'react-toastify';

type Props = {
  showDropdown: boolean;
  setShowDropdown: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddCategoryDropdown = ({ showDropdown, setShowDropdown }: Props) => {
  const [categoryName, setCategoryName] = useState('');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const response = await axiosInstance.post('/product/add-catogory', {
        name: categoryName.trim(),
      });
      toast.success(response.data.message || 'Category added successfully');
      setCategoryName('');
      setShowDropdown(false);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to add category';
      toast.error(errorMsg);
    }
  };

  const handleDiscard = () => {
    setCategoryName('');
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  if (!showDropdown) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div ref={dropdownRef} className="bg-white border rounded-md shadow-lg p-4 w-72">
        <h2 className="text-center font-semibold text-gray-800 mb-2">Add Category</h2>
        <input
          type="text"
          placeholder="Enter category name"
          className="w-full px-3 py-2 border rounded-md mb-3 focus:outline-none focus:ring focus:border-blue-300"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <div className="flex justify-between">
          <button
            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
            onClick={handleAddCategory}
          >
            ADD
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-1 rounded hover:bg-gray-300"
            onClick={handleDiscard}
          >
            DISCARD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryDropdown;
