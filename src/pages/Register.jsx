import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await API.post("/api/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      alert("already registered/Please login");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-[#f8f9fb] to-[#eef1f5]">

      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block"
      >
        <img
          src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9"
          className="w-full h-full object-cover"
          alt=""
        />
      </motion.div>

<motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  className="flex items-center justify-center bg-[#dde1e7]"
>
  <form
    onSubmit={handleRegister}
    className="w-[98%] max-w-md p-10 rounded-2xl bg-[#dde1e7]
    shadow-[-3px_-3px_7px_rgba(255,255,255,0.6),2px_2px_5px_rgba(94,104,121,0.3)]
    transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,0,0,0.1)]"
  >
    <h2 className="text-3xl font-semibold mb-8 text-gray-600 text-center">
      Create Account
    </h2>

    <input
      placeholder="Name"
      onChange={(e) => setName(e.target.value)}
      className="w-full mb-4 h-[50px] px-5 rounded-full outline-none border-none text-gray-600 bg-[#dde1e7]
      shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
      focus:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#ffffff73]"
    />

    <input
      placeholder="Email"
      onChange={(e) => setEmail(e.target.value)}
      className="w-full mb-4 h-[50px] px-5 rounded-full outline-none border-none text-gray-600 bg-[#dde1e7]
      shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
      focus:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#ffffff73]"
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
      className="w-full mb-6 h-[50px] px-5 rounded-full outline-none border-none text-gray-600 bg-[#dde1e7]
      shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
      focus:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#ffffff73]"
    />

    <button
      className="w-full h-[50px] rounded-full text-lg font-semibold text-gray-600
      bg-[#dde1e7]
      shadow-[2px_2px_5px_#BABECC,-5px_-5px_10px_#ffffff73]
      active:shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
      transition"
    >
      Register
    </button>

    <p className="text-sm text-gray-500 mt-5 text-center">
      Already have an account?{" "}
      <span
        onClick={() => navigate("/login")}
        className="text-blue-500 cursor-pointer hover:underline"
      >
        Login
      </span>
    </p>
  </form>
</motion.div>

    </div>
  );
}