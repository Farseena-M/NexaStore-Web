import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const Nvgt = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/user/login", {
        email,
        password,
      });

      const { token } = res.data;

      localStorage.setItem("token", token);

      toast.success("Login successful!");
      Nvgt("/"); 
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-gray-50">
      <div className="md:w-3/5 w-full flex flex-col justify-center items-center p-6 sm:p-10 bg-white shadow-lg">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-yellow-500 mb-6 md:mb-10 text-center max-w-lg px-4 sm:px-0">
          Sign In to <br /> Your Account
        </h2>

        <form
          className="w-full max-w-md flex flex-col gap-6 px-4 sm:px-0"
          onSubmit={handleLogin}
        >
          <div className="relative">
            <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-500 text-xl" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-14 py-3 sm:py-4 w-full rounded-lg bg-[#F9F9F9] text-[#333] placeholder-[#B0B0B0] border border-gray-200 focus:border-yellow-400 focus:outline-none shadow-sm transition"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-yellow-500 text-xl" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-14 py-3 sm:py-4 w-full rounded-lg bg-[#F9F9F9] text-[#333] placeholder-[#B0B0B0] border border-gray-200 focus:border-yellow-400 focus:outline-none shadow-sm transition"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-yellow-500 text-white py-3 sm:py-4 rounded-full font-semibold hover:bg-yellow-600 transition text-base sm:text-lg w-full sm:w-56 mx-auto"
          >
            SIGN IN
          </button>
        </form>
      </div>

      <div className="md:w-2/5 w-full bg-[#063b5b] text-white flex flex-col justify-center items-center p-8 md:p-12 relative overflow-hidden">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-wider text-center md:text-left max-w-xl px-4 sm:px-0">
          Hello Friend!
        </h2>
        <p className="text-center md:text-left text-sm sm:text-base mb-6 md:mb-8 tracking-wide text-gray-200 leading-relaxed max-w-xl px-4 sm:px-0">
          Enter your personal details and <br className="hidden md:block" />
          start your journey with us
        </p>
        <button
          className="border border-white w-full sm:w-64 py-2.5 sm:py-3 rounded-full hover:bg-white hover:text-[#063b5b] transition text-sm sm:text-base font-semibold max-w-xl"
          onClick={() => Nvgt("/signup")}
        >
          SIGN UP
        </button>

        <div className="absolute top-8 right-10 w-10 h-10 bg-[#0c587f] rotate-45 hidden sm:block"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#0c587f] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-20 right-14 w-8 h-8 bg-[#0c587f] rotate-45 hidden sm:block"></div>
      </div>
    </div>
  );
};

export default Login;
