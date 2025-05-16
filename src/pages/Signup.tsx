import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const Nvgt = useNavigate()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, formData);
            toast.success(response.data.message);
            setFormData({ name: "", email: "", password: "" });
            Nvgt('/login')
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            <div className="md:w-2/5 w-full bg-[#063b5b] text-white flex flex-col justify-center items-center p-10 relative overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider text-center md:text-left">
                    Welcome Back!
                </h2>
                <p className="text-center md:text-left text-base mb-6 tracking-wide text-gray-200 leading-relaxed">
                    To keep connected with us please <br className="hidden md:block" />
                    login with your personal info
                </p>
                <button className="border border-white w-48 py-2 rounded-full hover:bg-white hover:text-[#063b5b] transition text-sm" onClick={() => Nvgt('/login')}>
                    SIGN IN
                </button>

                <div className="absolute top-8 right-10 w-10 h-10 bg-[#0c587f] rotate-45"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0c587f] rounded-full -translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute bottom-20 right-14 w-8 h-8 bg-[#0c587f] rotate-45"></div>
            </div>

            <div className="md:w-3/5 w-full flex flex-col justify-center items-center p-10 bg-white">
                <h2 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-8 w-full max-w-lg text-center">
                    Create Account
                </h2>

                <form className="w-full max-w-lg flex flex-col gap-6" onSubmit={handleSubmit}>
                    <div className="relative">
                        <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-[#FFB800] text-lg" />
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="pl-14 py-4 w-full rounded-lg bg-[#F9F9F9] text-[#333] placeholder-[#B0B0B0] border-none focus:outline-none shadow-md"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-[#FFB800] text-lg" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="pl-14 py-4 w-full rounded-lg bg-[#F9F9F9] text-[#333] placeholder-[#B0B0B0] border-none focus:outline-none shadow-md"
                            required
                        />
                    </div>

                    <div className="relative">
                        <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-[#FFB800] text-lg" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="pl-14 py-4 w-full rounded-lg bg-[#F9F9F9] text-[#333] placeholder-[#B0B0B0] border-none focus:outline-none shadow-md"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-yellow-400 text-white py-4 rounded-full font-semibold hover:bg-yellow-500 transition text-lg w-56 mx-auto"
                    >
                        SIGN UP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
