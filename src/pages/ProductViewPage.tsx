import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Product } from '../interfaces/ProductInterface';
import { axiosInstance } from '../axiosInstance/userAxios';
import Header from '../components/Header';
import { toast } from 'react-toastify';

const ProductViewPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedRam, setSelectedRam] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [wishlist, setWishlist] = useState<string[]>([]);


    useEffect(() => {
        if (!productId) return;

        setLoading(true);
        setError(null);

        axiosInstance.get<{ product: Product }>(`/product/${productId}`)
            .then(response => {
                const data = response.data.product;
                setProduct(data);
                setSelectedRam(data.variants[0]?.ram || '');
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || "Failed to fetch product");
                setLoading(false);
            });
    }, [productId]);

    if (loading) return <div className="p-4 text-center">Loading product...</div>;
    if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;
    if (!product) return <div className="p-4 text-center">No product found</div>;

    const selectedVariant = product.variants.find(v => v.ram === selectedRam);

    const decreaseQty = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQty = () => {
        if (selectedVariant && quantity < (selectedVariant.qty ?? 0)) {
            setQuantity(quantity + 1);
        }
    };

    const handleBuyNow = () => {
        if (!selectedVariant) {
            alert("Please select a RAM variant.");
            return;
        }
        if (quantity > (selectedVariant.qty ?? 0)) {
            alert("Requested quantity exceeds stock.");
            return;
        }
        alert(`Buying ${quantity} unit(s) of ${product.title} (${selectedRam} RAM)`);
    };

    const handleEditProduct = () => {
        navigate(`/product/edit/${productId}`);
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
        <>
            <Header />
            <div className="max-w-7xl mx-auto p-4 font-sans">
                <nav className="text-sm mb-4 text-gray-500 cursor-pointer" onClick={() => navigate('/')}>
                    Home &gt; <span className="text-gray-700 font-medium">Product details</span>
                </nav>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="rounded-lg border p-4 h-[360px] flex justify-center items-center bg-white shadow-sm">
                            <img
                                src={product.images[selectedImageIndex]}
                                alt={product.title}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>

                        <div className="flex gap-4 overflow-x-auto">
                            {product.images.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setSelectedImageIndex(i)}
                                    className={`rounded-lg border-2 cursor-pointer bg-white p-1 transition-all ${i === selectedImageIndex ? 'border-yellow-400' : 'border-gray-300'
                                        }`}
                                >
                                    <img src={img} alt={`${product.title} ${i + 1}`} className="h-16 w-16 object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-start space-y-4">
                        <h1 className="text-2xl font-semibold text-blue-900">{product.title}</h1>

                        <p className="text-3xl font-bold text-gray-800">${selectedVariant?.price.toFixed(2) ?? 'N/A'}</p>

                        <div className="space-y-1 text-sm">
                            <p className="text-gray-600">
                                Availability: <span className="text-green-600 font-semibold">In stock</span>
                            </p>
                            <p className="text-gray-500">
                                Hurry! Only <strong>{selectedVariant?.qty ?? 0}</strong> left in stock!
                            </p>
                        </div>

                        <hr />

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select RAM</label>
                            <div className="flex gap-3">
                                {product.variants.map((v) => (
                                    <button
                                        key={v.ram}
                                        onClick={() => setSelectedRam(v.ram)}
                                        className={`px-4 py-2 rounded-full text-sm border transition-all ${selectedRam === v.ram
                                            ? 'bg-yellow-500 text-white border-yellow-500'
                                            : 'bg-gray-200 text-gray-700 border-gray-300'
                                            }`}
                                    >
                                        {v.ram}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={decreaseQty}
                                    className="border border-gray-300 px-3 py-1 rounded text-lg"
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="px-4">{quantity}</span>
                                <button
                                    onClick={increaseQty}
                                    className="border border-gray-300 px-3 py-1 rounded text-lg"
                                    disabled={selectedVariant ? quantity >= (selectedVariant.qty ?? 0) : true}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            <button
                                onClick={handleBuyNow}
                                className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
                            >
                                Buy it now
                            </button>
                            <button
                                onClick={handleEditProduct}
                                className="bg-gray-100 text-gray-800 px-6 py-2 rounded hover:bg-gray-200 transition"
                            >
                                Edit product
                            </button>
                            <button
                                aria-label="Add to wishlist"
                                className="ml-auto p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 w-6 cursor-pointer transition-colors duration-300 ${wishlist.includes(product._id) ? "text-yellow-500" : "text-gray-700"
                                        }`}
                                    fill={wishlist.includes(product._id) ? "currentColor" : "none"}
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => toggleWishlist(product._id)}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductViewPage;
