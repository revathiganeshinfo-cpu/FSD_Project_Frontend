import { useState } from "react";
import { motion } from "framer-motion";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data));
      
     const role = res.data.user?.role || res.data.role;

if (role === "admin") {
  navigate("/admin");
} else {
  navigate("/");
}

  } catch (err) {
    alert("Invalid Email / Password");
  }
};

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block"
      >
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
          className="w-full h-full object-cover"
          alt=""
        />
      </motion.div>

 <motion.div
  initial={{ opacity: 0, x: 60 }}
  animate={{ opacity: 1, x: 0 }}
  className="flex items-center justify-center min-h-screen bg-[#dde1e7]"
>
  <div className="w-[450px] px-8 py-10 rounded-xl bg-[#dde1e7] 
    shadow-[-3px_-3px_7px_rgba(255,255,255,0.5),2px_2px_5px_rgba(94,104,121,0.3)]">

    <form onSubmit={handleLogin}>

      <h2 className="text-3xl font-semibold mb-8 text-gray-600 text-center">
        Welcome Back
      </h2>

      <div className="relative h-[50px] w-full mb-5">
        <input
          type="email"
          required
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-full pl-12 rounded-full outline-none border-none text-gray-600 bg-[#dde1e7]
          shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
          focus:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#ffffff73]"
        />
      </div>

      <div className="relative h-[50px] w-full mb-5">
        <input
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-full pl-12 rounded-full outline-none border-none text-gray-600 bg-[#dde1e7]
          shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
          focus:shadow-[inset_1px_1px_2px_#BABECC,inset_-1px_-1px_2px_#ffffff73]"
        />
      </div>

      <button
        type="submit"
        className="w-full h-[50px] rounded-full text-lg font-semibold text-gray-600 mt-4
        bg-[#dde1e7]
        shadow-[2px_2px_5px_#BABECC,-5px_-5px_10px_#ffffff73]
        active:shadow-[inset_2px_2px_5px_#BABECC,inset_-5px_-5px_10px_#ffffff73]
        transition"
      >
        Login
      </button>

      <p className="text-center text-gray-500 mt-5">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-500 cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>

    </form>
  </div>
</motion.div>

    </div>
  );
}