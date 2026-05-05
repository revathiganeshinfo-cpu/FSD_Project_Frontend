import { useState, useEffect } from "react";
import API from "../services/api";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Store, IndianRupee, TrendingUp } from "lucide-react";
import { Mail, ShieldCheck, Activity, Search, Filter } from "lucide-react";
import logo from "../assets/logo1.png";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  /* ================= USERS ================= */
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= RESTAURANTS ================= */
  const [restaurants, setRestaurants] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    price: "",
    image: "",
    cuisine: "",
    about: "",
  });

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/api/restaurants");
      setRestaurants(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/admin/restaurants", {
        name: form.name,
        location: form.location,
        cuisine: "General",
        price: Number(form.price),
        images: form.image ? [form.image] : [],
        description: form.about,
      });

      setForm({
        name: "",
        location: "",
        price: "",
        image: "",
        cuisine: "",
        about: "",
      });
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };
  const updateRestaurant = async () => {
    try {
      await API.put(`/api/admin/restaurants/${editId}`, {
        name: form.name,
        location: form.location,
        cuisine: form.cuisine,
        price: Number(form.price),
        image: "",
        about: "",
      });

      setEditId(null);
      setForm({
        name: "",
        location: "",
        price: "",
        image: "",
        cuisine: "",
        about: "",
      });
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const deleteRestaurant = async (id) => {
    try {
      await API.delete(`/api/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  /* ================= RESERVATIONS ================= */
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const res = await API.get("/api/admin/reservations");
      setReservations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= REVENUE ================= */
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await API.get("/api/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "users") fetchUsers();
    if (activeTab === "restaurants") fetchRestaurants();
    if (activeTab === "reservations") fetchReservations();
    if (activeTab === "revenue") fetchStats();
  }, [activeTab]);

  const [userPage, setUserPage] = useState(1);

  const handleBlockUser = async (id) => {
    setUsers((prev) =>
      prev.map((u) => (u._id === id ? { ...u, isBlocked: !u.isBlocked } : u)),
    );
    await API.put(`/api/admin/users/${id}/block`);
  };

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) return;

    setUsers((prev) => prev.filter((u) => u._id !== id));
    await API.delete(`/api/admin/users/${id}`);
  };

  return (
    <div className="min-h-screen  p-10 text-white bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="group flex items-center justify-start w-11 h-11 bg-red-600 rounded-full cursor-pointer relative overflow-hidden transition-all duration-200 shadow-lg hover:w-32 hover:rounded-lg active:translate-x-1 active:translate-y-1"
        >
          <div className="flex items-center justify-center w-full transition-all duration-300 group-hover:justify-start group-hover:px-3">
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="white">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
          </div>

          <div className="absolute right-5 transform translate-x-full opacity-0 text-white text-lg font-semibold transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            Logout
          </div>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full
    shadow-[0_0_20px_rgba(255,215,0,0.5)]
  "
          />

          <h1
            className="text-5xl md:text-6xl font-bold tracking-wider
  font-[Cinzel]
  bg-gradient-to-r from-[#fff6d6] via-[#f7d774] to-[#caa24a]
  bg-clip-text text-transparent
  drop-shadow-[0_10px_30px_rgba(255,215,0,0.5)]"
          >
            Regal Grandeur
          </h1>
        </div>

        <p className="text-gray-300 text-sm md:text-base tracking-wide italic p">
          A World of Royal Flavours Under One Grand Roof.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 pt-8  pl-6 mb-8">
        {[
          { key: "revenue", label: "💰 Dashboard", color: "purple" },

          { key: "users", label: "👥 Users", color: "blue" },
          { key: "restaurants", label: "🍽 Restaurants", color: "green" },
          { key: "reservations", label: "📅 Reservations", color: "yellow" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-xl font-medium transition 
        ${
          activeTab === tab.key
            ? `bg-${tab.color}-500 text-white shadow-lg scale-105`
            : "bg-white/10 hover:bg-white/20"
        }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= USERS ================= */}
      {activeTab === "users" && (
        <div className="bg-white/10 p-6 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/20 mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users size={20} /> Users
            </h2>
            <span className="text-lg text-gray-300">{users.length} total</span>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/20 shadow-2xl">
            <table className="w-full text-left text-white">
              <thead className="bg-white/10 text-gray-300 uppercase text-md font-semibold tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.slice((userPage - 1) * 5, userPage * 5).map((u) => (
                  <tr
                    key={u._id}
                    className={`border-t border-white/10 hover:bg-white/10 transition duration-200 ${
                      u.isBlocked ? "opacity-50" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${u.name}`}
                          className="w-10 h-10 rounded-full border border-white/20"
                        />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-gray-400">
                            ID: {u._id.slice(-5)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        {u.email}
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit
                    ${
                      u.role === "admin"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-blue-500/20 text-blue-300"
                    }`}
                      >
                        <ShieldCheck size={14} />
                        {u.role}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1
                    ${
                      u.isBlocked
                        ? "bg-red-500/20 text-red-300"
                        : "bg-green-500/20 text-green-300"
                    }`}
                      >
                        <Activity size={14} />
                        {u.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {u.role !== "admin" && (
                          <>
                            <button
                              onClick={() => handleBlockUser(u._id)}
                              className={`px-3 py-1 rounded-lg text-xs font-medium transition
                            ${
                              u.isBlocked
                                ? "bg-green-500/20 text-green-300 hover:bg-green-500/40"
                                : "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40"
                            }`}
                            >
                              {u.isBlocked ? "Unblock" : "Block"}
                            </button>

                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="px-3 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 hover:bg-red-500/40 transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
              disabled={userPage === 1}
              className="px-4 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition"
            >
              ← Prev
            </button>

            <span className="text-gray-300 text-sm">
              Page {userPage} / {Math.ceil(users.length / 5)}
            </span>

            <button
              onClick={() =>
                setUserPage((p) => Math.min(p + 1, Math.ceil(users.length / 5)))
              }
              disabled={userPage === Math.ceil(users.length / 5)}
              className="px-4 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
      {/* ================= RESTAURANTS ================= */}
      {activeTab === "restaurants" && (
        <div>
          <h2 className="text-xl mb-4">🍽 Restaurants</h2>

          <form
            onSubmit={
              editId
                ? (e) => {
                    e.preventDefault();
                    updateRestaurant();
                  }
                : addRestaurant
            }
            className="mb-10 p-4 md:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl w-full"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editId ? "✏️ Edit Restaurant" : "➕ Add Restaurant"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <input
                placeholder="Restaurant Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="p-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="p-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-green-400 outline-none"
              />

              <input
                placeholder="Image URL"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="p-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <input
                placeholder="Cuisine (eg: South Indian)"
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                className="p-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-purple-400 outline-none"
              />

              <textarea
                placeholder="About restaurant..."
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                className="p-3 rounded-xl bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none col-span-1 md:col-span-3"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6">
              {editId ? (
                <>
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-xl"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm({
                        name: "",
                        location: "",
                        price: "",
                        image: "",
                        cuisine: "",
                        about: "",
                      });
                    }}
                    className="bg-gray-500 hover:bg-gray-600 px-6 py-2 rounded-xl"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-xl"
                >
                  Add Restaurant
                </button>
              )}
            </div>
          </form>

          <div className="overflow-x-auto rounded-3xl border border-white/10 shadow-2xl bg-white/5 backdrop-blur-xl">
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="bg-white/10 text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-5 py-4">Image</th>
                  <th className="px-5 py-4">Name</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Cuisine</th>
                  <th className="px-5 py-4">About</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {restaurants.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t border-white/10 hover:bg-white/10 transition duration-300"
                  >
                    <td className="px-5 py-4">
                      {r.images && r.images.length > 0 ? (
                        <img
                          src={r.images[0]}
                          alt="restaurant"
                          className="w-14 h-14 rounded-xl object-cover shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 font-semibold text-white">
                      {r.name}
                    </td>

                    <td className="px-5 py-4 text-gray-300">{r.location}</td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300">
                        {r.cuisine || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4 max-w-[200px]">
                      <p className="truncate text-gray-400">
                        {r.description || "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-green-400 font-bold text-lg">
                        ₹{r.price}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditId(r._id);
                            setForm({
                              name: r.name,
                              location: r.location,
                              price: r.price,
                              image: r.images?.[0] || "",
                              cuisine: r.cuisine || "",
                              about: r.description || "",
                            });
                          }}
                          className="px-4 py-1 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-sm font-medium transition shadow"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteRestaurant(r._id)}
                          className="px-4 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium transition shadow"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= RESERVATIONS ================= */}
      {activeTab === "reservations" && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <CalendarDays size={20} /> Reservations
            </h2>
            <span className="text-sm text-gray-300">
              {reservations.length} bookings
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-white">
              <thead className="bg-white/10 text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Restaurant</th>
                  <th className="p-4 ">Schedule</th>
                  <th className="p-4 text-center">Payment</th>

                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r) => (
                  <tr
                    key={r._id}
                    className="border-t border-white/10 hover:bg-white/10 transition duration-200"
                  >
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${r.user?.name}`}
                        className="w-9 h-9 rounded-full border border-white/20"
                      />
                      <span>{r.user?.name}</span>
                    </td>

                    <td className="p-4 text-gray-300">{r.restaurant?.name}</td>

                    <td className="p-4 text-gray-300 space-y-1">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        {new Date(r.date).toLocaleDateString()}
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        {r.time}
                      </div>

                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        {r.partySize} people
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-white font-semibold">
                          ₹{r.totalAmount || 0}
                        </span>

                        <span
                          className={`px-2 py-1 rounded-full text-xs
    ${
      r.paymentStatus === "paid" || r.status === "paid"
        ? "bg-green-500/20 text-green-300"
        : "bg-red-500/20 text-red-300"
    }`}
                        >
                          {r.paymentStatus === "paid" || r.status === "paid"
                            ? "paid"
                            : "unpaid"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center justify-center gap-1
                    ${
                      r.status === "confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : r.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-red-500/20 text-red-300"
                    }`}
                      >
                        {r.status === "confirmed" && <CheckCircle size={14} />}
                        {r.status === "pending" && <Loader2 size={14} />}
                        {r.status === "cancelled" && <XCircle size={14} />}
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= REVENUE ================= */}

      {activeTab === "revenue" && stats && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <TrendingUp className="text-green-400" /> Dashboard
            </h2>
            <p className="text-gray-300 text-sm">
              Overview of platform performance
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-700/20 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
              <div className="flex items-center justify-between">
                <p className="text-gray-300 text-sm">Total Users</p>
                <Users className="text-blue-400" size={22} />
              </div>
              <h2 className="text-3xl font-bold mt-3 text-white">
                {stats.totalUsers}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
              <div className="flex items-center justify-between">
                <p className="text-gray-300 text-sm">Restaurants</p>
                <Store className="text-purple-400" size={22} />
              </div>
              <h2 className="text-3xl font-bold mt-3 text-white">
                {stats.totalRestaurants}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-lg hover:scale-105 transition">
              <div className="flex items-center justify-between">
                <p className="text-gray-300 text-sm">Reservations</p>
                <CalendarDays className="text-yellow-400" size={22} />
              </div>
              <h2 className="text-3xl font-bold mt-3 text-white">
                {stats.totalReservations}
              </h2>
            </div>

            {/* Pie Chart Card */}
            <div className="bg-gradient-to-br from-purple-500/20 to-blue-700/20 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-lg hover:scale-105 transition col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-300 text-sm tracking-widest uppercase">
                    Revenue Breakdown
                  </p>
                  <p className="text-purple-400 text-xs mt-1">
                    🍕 Monthly share of total revenue
                  </p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-2xl border border-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                  <TrendingUp className="text-purple-400" size={32} />
                </div>
              </div>

              {stats?.chartData?.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <defs>
                        {stats.chartData.map((_, i) => (
                          <radialGradient
                            key={i}
                            id={`pieGrad${i}`}
                            cx="50%"
                            cy="50%"
                            r="50%"
                          >
                            <stop
                              offset="0%"
                              stopColor={
                                [
                                  "#a855f7",
                                  "#22c55e",
                                  "#3b82f6",
                                  "#f59e0b",
                                  "#ec4899",
                                  "#14b8a6",
                                  "#f97316",
                                  "#6366f1",
                                  "#84cc16",
                                  "#06b6d4",
                                  "#e11d48",
                                  "#8b5cf6",
                                ][i % 12]
                              }
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                [
                                  "#7c3aed",
                                  "#15803d",
                                  "#1d4ed8",
                                  "#b45309",
                                  "#be185d",
                                  "#0f766e",
                                  "#c2410c",
                                  "#4338ca",
                                  "#4d7c0f",
                                  "#0e7490",
                                  "#9f1239",
                                  "#6d28d9",
                                ][i % 12]
                              }
                              stopOpacity={0.8}
                            />
                          </radialGradient>
                        ))}
                      </defs>

                      <Pie
                        data={stats.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="revenue"
                        nameKey="month"
                        stroke="none"
                      >
                        {stats.chartData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={`url(#pieGrad${i})`}
                            style={{
                              filter:
                                "drop-shadow(0 0 6px rgba(168,85,247,0.5))",
                            }}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.85)",
                          border: "1px solid rgba(168,85,247,0.3)",
                          borderRadius: "12px",
                          color: "#fff",
                          fontSize: "12px",
                          boxShadow: "0 0 20px rgba(168,85,247,0.2)",
                        }}
                        formatter={(value) => [
                          `₹${value.toLocaleString("en-IN")}`,
                          "Revenue",
                        ]}
                        labelStyle={{ color: "#a855f7" }}
                      />

                      <Legend
                        formatter={(value) => (
                          <span style={{ color: "#d1d5db", fontSize: "11px" }}>
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {stats.chartData.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: [
                                "#a855f7",
                                "#22c55e",
                                "#3b82f6",
                                "#f59e0b",
                                "#ec4899",
                                "#14b8a6",
                                "#f97316",
                                "#6366f1",
                                "#84cc16",
                                "#06b6d4",
                                "#e11d48",
                                "#8b5cf6",
                              ][i % 12],
                            }}
                          />
                          <span className="text-gray-300 text-xs">
                            {d.month}
                          </span>
                        </div>
                        <span className="text-white text-xs font-semibold">
                          ₹{d.revenue.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">
                  No paid reservations yet 📊
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
