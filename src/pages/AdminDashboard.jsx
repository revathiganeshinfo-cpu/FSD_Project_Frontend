import { useState, useEffect } from "react";
import API from "../services/api";
import {
  CalendarDays, Clock, Users, CheckCircle, XCircle, Loader2,
} from "lucide-react";
import { Store, IndianRupee, TrendingUp } from "lucide-react";
import { Mail, ShieldCheck, Activity } from "lucide-react";
import logo from "../assets/logo1.png";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart, Pie, Cell, Legend } from "recharts";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("revenue");

  /* ================= USERS ================= */
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : res.data.users || []);
    } catch (err) { console.error(err); }
  };

  const handleBlockUser = async (id) => {
    setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    await API.put(`/api/admin/users/${id}/block`);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u._id !== id));
    await API.delete(`/api/admin/users/${id}`);
  };

  /* ================= RESTAURANTS ================= */
  const [restaurants, setRestaurants] = useState([]);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", price: "", image: "", cuisine: "", about: "" });

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/api/restaurants");
      setRestaurants(res.data || []);
    } catch (err) { console.error(err); }
  };

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/admin/restaurants", {
        name: form.name, location: form.location, cuisine: form.cuisine || "General",
        price: Number(form.price), images: form.image ? [form.image] : [], description: form.about,
      });
      setForm({ name: "", location: "", price: "", image: "", cuisine: "", about: "" });
      fetchRestaurants();
    } catch (err) { alert("Add failed"); }
  };

  const updateRestaurant = async () => {
    try {
      await API.put(`/api/admin/restaurants/${editId}`, {
        name: form.name, location: form.location, cuisine: form.cuisine,
        price: Number(form.price), images: form.image ? [form.image] : [], description: form.about,
      });
      setEditId(null);
      setForm({ name: "", location: "", price: "", image: "", cuisine: "", about: "" });
      fetchRestaurants();
    } catch (err) { alert("Update failed"); }
  };

  const deleteRestaurant = async (id) => {
    try {
      await API.delete(`/api/admin/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) { alert("Delete failed"); }
  };

  /* ================= RESERVATIONS ================= */
  const [reservations, setReservations] = useState([]);
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationFilter, setReservationFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [resPage, setResPage] = useState(1);
  const RES_PER_PAGE = 8;

  const fetchReservations = async () => {
    try {
      const res = await API.get("/api/admin/reservations");
      setReservations(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleConfirmReservation = async (id) => {
    await API.put(`/api/admin/reservations/${id}/confirm`);
    setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status: "confirmed" } : r));
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("Cancel this reservation?")) return;
    await API.put(`/api/admin/reservations/${id}/cancel`);
    setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status: "cancelled" } : r));
  };

  const resStats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === "pending").length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    paid: reservations.filter(r => r.status === "paid").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length,
    revenue: reservations.filter(r => r.status === "paid").reduce((sum, r) => sum + (r.paidAmount || 0), 0),
  };

  const filteredReservations = reservations
    .filter((r) => reservationFilter === "all" || r.status === reservationFilter)
    .filter((r) => {
      const q = reservationSearch.toLowerCase();
      return r.user?.name?.toLowerCase().includes(q) || r.restaurant?.name?.toLowerCase().includes(q);
    })
    .filter((r) => {
      if (!dateFrom && !dateTo) return true;
      const rDate = new Date(r.date);
      const from = dateFrom ? new Date(dateFrom) : null;
      const to = dateTo ? new Date(dateTo) : null;
      if (from && to) return rDate >= from && rDate <= to;
      if (from) return rDate >= from;
      if (to) return rDate <= to;
      return true;
    });

  const paginatedReservations = filteredReservations.slice((resPage - 1) * RES_PER_PAGE, resPage * RES_PER_PAGE);
  const totalResPages = Math.ceil(filteredReservations.length / RES_PER_PAGE);

  const exportToCSV = () => {
    const headers = ["User", "Email", "Restaurant", "Date", "Time", "Party Size", "Total Amount", "Paid Amount", "Status"];
    const rows = filteredReservations.map((r) => [
      r.user?.name || "", r.user?.email || "", r.restaurant?.name || "",
      new Date(r.date).toLocaleDateString(), r.time || "", r.partySize || "",
      r.totalAmount || 0, r.paidAmount || 0, r.status || "",
    ]);
    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reservations_${new Date().toLocaleDateString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ================= REVIEWS ================= */
  const [reviews, setReviews] = useState([]);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState("all");

  const fetchReviews = async () => {
    try {
      const res = await API.get("/api/admin/reviews");
      setReviews(res.data || []);
    } catch (err) { console.error(err); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    setReviews((prev) => prev.filter((r) => r._id !== id));
    await API.delete(`/api/admin/reviews/${id}`);
  };

  const filteredReviews = reviews
    .filter((r) => reviewFilter === "all" || r.rating === Number(reviewFilter))
    .filter((r) => {
      const q = reviewSearch.toLowerCase();
      return r.user?.name?.toLowerCase().includes(q) || r.restaurant?.name?.toLowerCase().includes(q) || r.comment?.toLowerCase().includes(q);
    });

  /* ================= STATS ================= */
  const [stats, setStats] = useState(null);
  const fetchStats = async () => {
    try {
      const res = await API.get("/api/admin/stats");
      setStats(res.data.stats);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
  const loadTab = async () => {
    if (activeTab === "users") await fetchUsers();
    if (activeTab === "restaurants") await fetchRestaurants();
    if (activeTab === "reservations") await fetchReservations();
    if (activeTab === "revenue") await fetchStats();
    if (activeTab === "reviews") await fetchReviews();
  };
  loadTab();
}, [activeTab]);

useEffect(() => {
  
  const resetPage = () => setResPage(1);
  resetPage();
}, [reservationFilter, reservationSearch, dateFrom, dateTo]);
  const tabs = [
    { key: "revenue", label: "Dashboard", icon: "📊" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "restaurants", label: "Restaurants", icon: "🍽" },
    { key: "reservations", label: "Reservations", icon: "📅" },
    { key: "reviews", label: "Reviews", icon: "⭐" },
  ];

  const inputCls = "w-full p-3 rounded-xl outline-none text-sm font-medium transition-all duration-200 bg-white border border-orange-200 text-gray-700 placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 shadow-sm";
  const ORANGE_COLORS = ["#f97316", "#fb923c", "#fdba74", "#ea580c", "#c2410c", "#fed7aa", "#f59e0b", "#fbbf24"];
  const STATUS_COLORS = { pending: "#f59e0b", confirmed: "#3b82f6", paid: "#22c55e", cancelled: "#ef4444" };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fff7ed 100%)" }}>

      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 min-h-screen fixed left-0 top-0 z-20 flex flex-col shadow-xl"
        style={{ background: "linear-gradient(180deg, #f97316 0%, #ea580c 100%)" }}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/20">
          <img src={logo} alt="logo" className="w-10 h-10 rounded-full object-cover shadow-lg ring-2 ring-white/40" />
          <div>
            <h1 className="text-sm font-bold text-white tracking-wider font-[Cinzel]">Regal Grandeur</h1>
            <p className="text-[10px] text-orange-100/70">Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${activeTab === tab.key ? "bg-white text-orange-600 shadow-lg" : "text-white/80 hover:bg-white/20 hover:text-white"}`}>
              <span className="text-base">{tab.icon}</span>
              {tab.label}
              {activeTab === tab.key && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/20">
          <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/20 hover:text-white transition-all duration-200">
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="currentColor">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="ml-64 flex-1 min-h-screen p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {tabs.find(t => t.key === activeTab)?.icon} {tabs.find(t => t.key === activeTab)?.label}
            </h2>
            <p className="text-gray-400 text-sm mt-0.5">Welcome back, Admin 👋</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-orange-100">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white shadow">A</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Admin</p>
              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>

        {/* ================= DASHBOARD ================= */}
        {activeTab === "revenue" && stats && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Users", value: stats.totalUsers, icon: <Users size={22} />, color: "#3b82f6", light: "#eff6ff" },
                { label: "Restaurants", value: stats.totalRestaurants, icon: <Store size={22} />, color: "#a855f7", light: "#faf5ff" },
                { label: "Reservations", value: stats.totalReservations, icon: <CalendarDays size={22} />, color: "#f59e0b", light: "#fffbeb" },
                { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString("en-IN")}`, icon: <IndianRupee size={22} />, color: "#f97316", light: "#fff7ed" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: s.light, color: s.color }}>{s.icon}</div>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* Wave Chart */}
              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Monthly Revenue</p>
                    <p className="text-xs text-gray-400 mt-0.5">Based on paid reservations</p>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50"><TrendingUp className="text-orange-500" size={18} /></div>
                </div>
                {stats?.chartData?.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={stats.chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #fed7aa", borderRadius: "10px", color: "#374151", fontSize: "11px" }}
                          formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} labelStyle={{ color: "#f97316" }} />
                        <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2.5} fill="url(#orangeGrad)"
                          dot={{ r: 3, fill: "#f97316", strokeWidth: 0 }}
                          activeDot={{ r: 5, fill: "#f97316", stroke: "#fff", strokeWidth: 2 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex justify-between px-1 mt-2">
                      {stats.chartData.map((d) => (
                        <span key={d.month} className="text-[9px] text-gray-400">{d.month}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-10 text-sm">No data yet 📊</p>
                )}
              </div>

              {/* Status Breakdown Pie */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-gray-800">Status Breakdown</p>
                    <p className="text-xs text-gray-400 mt-0.5">By reservation status</p>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50"><CalendarDays className="text-orange-500" size={18} /></div>
                </div>
                {stats?.statusData?.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={140}>
                      <PieChart>
                        <Pie data={stats.statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={60}
                          paddingAngle={3} dataKey="count" nameKey="status" stroke="none">
                          {stats.statusData.map((s, i) => (
                            <Cell key={i} fill={STATUS_COLORS[s.status] || "#94a3b8"} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #fed7aa", borderRadius: "10px", color: "#374151", fontSize: "11px" }}
                          formatter={(v, n) => [v, n]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-1.5 mt-2">
                      {stats.statusData.map((s, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[s.status] || "#94a3b8" }} />
                            <span className="text-[10px] text-gray-500 capitalize">{s.status}</span>
                          </div>
                          <span className="text-[10px] text-gray-700 font-semibold">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center py-10 text-sm">No data yet</p>
                )}
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid md:grid-cols-3 gap-6">

              {/* Top Restaurants */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-800">🏆 Top Restaurants</p>
                  <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Most Bookings</span>
                </div>
                <div className="space-y-3">
                  {(stats?.topRestaurants || []).map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                        ${i === 0 ? "bg-yellow-400" : i === 1 ? "bg-gray-400" : i === 2 ? "bg-orange-400" : "bg-orange-200"}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{r.name}</p>
                        <p className="text-[10px] text-gray-400">{r.bookings} bookings</p>
                      </div>
                      <span className="text-[10px] text-green-600 font-semibold">₹{r.revenue?.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                  {!stats?.topRestaurants?.length && <p className="text-gray-400 text-xs text-center py-4">No data yet</p>}
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-gray-800">📋 Recent Reservations</p>
                  <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Last 5</span>
                </div>
                <div className="space-y-3">
                  {(stats?.recentReservations || []).map((r, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${r.user?.name}&background=f97316&color=fff`}
                        className="w-7 h-7 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-700 truncate">{r.user?.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{r.restaurant?.name}</p>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold
                        ${r.status === "paid" ? "bg-green-100 text-green-600"
                          : r.status === "confirmed" ? "bg-blue-100 text-blue-600"
                          : r.status === "cancelled" ? "bg-red-100 text-red-500"
                          : "bg-yellow-100 text-yellow-600"}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                  {!stats?.recentReservations?.length && <p className="text-gray-400 text-xs text-center py-4">No data yet</p>}
                </div>
              </div>

              {/* Right Column: Recent Reviews + Recent Users */}
              <div className="space-y-4">

                {/* Recent Reviews */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-800">⭐ Recent Reviews</p>
                    <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Last 5</span>
                  </div>
                  <div className="space-y-2.5">
                    {(stats?.recentReviews || []).map((r, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <img src={`https://ui-avatars.com/api/?name=${r.user?.name}&background=f97316&color=fff`}
                          className="w-6 h-6 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-gray-700 truncate">{r.user?.name}</p>
                          <p className="text-[9px] text-gray-400 truncate">{r.restaurant?.name}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} className={`w-2.5 h-2.5 ${s <= r.rating ? "text-orange-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    ))}
                    {!stats?.recentReviews?.length && <p className="text-gray-400 text-[10px] text-center py-2">No reviews yet</p>}
                  </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-gray-800">👥 New Users</p>
                    <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Last 5</span>
                  </div>
                  <div className="space-y-2.5">
                    {(stats?.recentUsers || []).map((u, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <img src={`https://ui-avatars.com/api/?name=${u.name}&background=f97316&color=fff`}
                          className="w-6 h-6 rounded-full flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-semibold text-gray-700 truncate">{u.name}</p>
                          <p className="text-[9px] text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold
                          ${u.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-500"}`}>
                          {u.role}
                        </span>
                      </div>
                    ))}
                    {!stats?.recentUsers?.length && <p className="text-gray-400 text-[10px] text-center py-2">No users yet</p>}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ================= USERS ================= */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Users size={16} className="text-orange-500" /> All Users
              </h3>
              <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full font-medium">{users.length} total</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["User", "Email", "Role", "Status", "Actions"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.slice((userPage - 1) * 5, userPage * 5).map((u) => (
                    <tr key={u._id} className={`border-b border-gray-50 hover:bg-orange-50/50 transition duration-150 ${u.isBlocked ? "opacity-50" : ""}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${u.name}&background=f97316&color=fff`} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-sm font-semibold text-gray-700">{u.name}</p>
                            <p className="text-[10px] text-gray-400">#{u._id.slice(-5)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-xs"><div className="flex items-center gap-1.5"><Mail size={11} />{u.email}</div></td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit
                          ${u.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"}`}>
                          <ShieldCheck size={10} />{u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit
                          ${u.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                          <Activity size={10} />{u.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.role !== "admin" && (
                          <div className="flex gap-2">
                            <button onClick={() => handleBlockUser(u._id)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition
                                ${u.isBlocked ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"}`}>
                              {u.isBlocked ? "Unblock" : "Block"}
                            </button>
                            <button onClick={() => handleDeleteUser(u._id)}
                              className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition">Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setUserPage(p => Math.max(p - 1, 1))} disabled={userPage === 1}
                className="px-4 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium disabled:opacity-30 transition">← Prev</button>
              <span className="text-xs text-gray-400">Page {userPage} / {Math.ceil(users.length / 5) || 1}</span>
              <button onClick={() => setUserPage(p => Math.min(p + 1, Math.ceil(users.length / 5)))} disabled={userPage === Math.ceil(users.length / 5)}
                className="px-4 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium disabled:opacity-30 transition">Next →</button>
            </div>
          </div>
        )}

        {/* ================= RESTAURANTS ================= */}
        {activeTab === "restaurants" && (
          <div className="space-y-6">
            <form onSubmit={editId ? (e) => { e.preventDefault(); updateRestaurant(); } : addRestaurant}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-5">{editId ? "✏️ Edit Restaurant" : "➕ Add Restaurant"}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input placeholder="Restaurant Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
                <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} />
                <input type="number" placeholder="Price per person" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} />
                <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputCls} />
                <input placeholder="Cuisine (eg: South Indian)" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className={inputCls} />
                <textarea placeholder="About restaurant..." value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} className={`${inputCls} col-span-1 md:col-span-3 h-20 resize-none`} />
              </div>
              <div className="flex gap-3 mt-4">
                {editId ? (
                  <>
                    <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg transition">Update</button>
                    <button type="button" onClick={() => { setEditId(null); setForm({ name: "", location: "", price: "", image: "", cuisine: "", about: "" }); }}
                      className="px-6 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">Cancel</button>
                  </>
                ) : (
                  <button type="submit" className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:shadow-lg transition">Add Restaurant</button>
                )}
              </div>
            </form>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {["Image", "Name", "Location", "Cuisine", "About", "Price", "Actions"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((r) => (
                      <tr key={r._id} className="border-b border-gray-50 hover:bg-orange-50/50 transition duration-150">
                        <td className="px-5 py-4">
                          {r.images?.[0] ? <img src={r.images[0]} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                            : <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-300 text-xs">N/A</div>}
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-800">{r.name}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{r.location}</td>
                        <td className="px-5 py-4"><span className="px-2.5 py-1 rounded-full text-[10px] bg-orange-100 text-orange-600 font-medium">{r.cuisine || "—"}</span></td>
                        <td className="px-5 py-4 max-w-[150px]"><p className="truncate text-gray-400 text-xs">{r.description || "No description"}</p></td>
                        <td className="px-5 py-4 text-orange-600 font-bold">₹{r.price}</td>
                        <td className="px-5 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditId(r._id); setForm({ name: r.name, location: r.location, price: r.price, image: r.images?.[0] || "", cuisine: r.cuisine || "", about: r.description || "" }); }}
                              className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition">Edit</button>
                            <button onClick={() => deleteRestaurant(r._id)}
                              className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= RESERVATIONS ================= */}
        {activeTab === "reservations" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { label: "Total", value: resStats.total, color: "#6366f1" },
                { label: "Pending", value: resStats.pending, color: "#f59e0b" },
                { label: "Confirmed", value: resStats.confirmed, color: "#3b82f6" },
                { label: "Paid", value: resStats.paid, color: "#22c55e" },
                { label: "Cancelled", value: resStats.cancelled, color: "#ef4444" },
                { label: "Revenue", value: `₹${resStats.revenue.toLocaleString("en-IN")}`, color: "#f97316" },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">{s.label}</p>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl flex-1 min-w-[200px]">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input type="text" placeholder="Search by user or restaurant..."
                    value={reservationSearch} onChange={(e) => setReservationSearch(e.target.value)}
                    className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full" />
                </div>
                <button onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold hover:shadow-lg transition">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2 flex-wrap">
                  {["all", "pending", "confirmed", "paid", "cancelled"].map((s) => (
                    <button key={s} onClick={() => setReservationFilter(s)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition capitalize
                        ${reservationFilter === s ? "bg-orange-500 text-white shadow-sm" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-gray-400 font-medium">From</span>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-orange-200 text-xs text-gray-600 outline-none focus:border-orange-400 bg-orange-50" />
                  <span className="text-xs text-gray-400 font-medium">To</span>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-orange-200 text-xs text-gray-600 outline-none focus:border-orange-400 bg-orange-50" />
                  {(dateFrom || dateTo) && (
                    <button onClick={() => { setDateFrom(""); setDateTo(""); }}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-400 text-xs hover:bg-red-100 transition font-medium">Clear</button>
                  )}
                </div>
                <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl font-medium">{filteredReservations.length} results</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {["User", "Restaurant", "Schedule", "Amount", "Status", "Actions"].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReservations.map((r) => (
                      <tr key={r._id} className="border-b border-gray-50 hover:bg-orange-50/50 transition duration-150">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${r.user?.name}&background=f97316&color=fff`} className="w-8 h-8 rounded-full" />
                            <div>
                              <p className="text-sm font-semibold text-gray-700">{r.user?.name}</p>
                              <p className="text-[10px] text-gray-400">{r.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-xs font-medium">{r.restaurant?.name}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs space-y-1">
                          <div className="flex items-center gap-1.5"><CalendarDays size={11} className="text-orange-400" />{new Date(r.date).toLocaleDateString()}</div>
                          <div className="flex items-center gap-1.5"><Clock size={11} className="text-orange-400" />{r.time}</div>
                          <div className="flex items-center gap-1.5"><Users size={11} className="text-orange-400" />{r.partySize} people</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="text-gray-800 font-bold">₹{r.totalAmount || 0}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Paid: ₹{r.paidAmount || 0}</p>
                          <span className={`mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold inline-block
                            ${r.status === "paid" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                            {r.status === "paid" ? "paid" : "unpaid"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit
                            ${r.status === "confirmed" || r.status === "paid" ? "bg-green-100 text-green-600"
                              : r.status === "pending" ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-500"}`}>
                            {(r.status === "confirmed" || r.status === "paid") && <CheckCircle size={10} />}
                            {r.status === "pending" && <Loader2 size={10} />}
                            {r.status === "cancelled" && <XCircle size={10} />}
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {r.status === "pending" && (
                              <button onClick={() => handleConfirmReservation(r._id)}
                                className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-green-100 text-green-600 hover:bg-green-200 transition">✓ Confirm</button>
                            )}
                            {r.status !== "cancelled" && r.status !== "paid" && (
                              <button onClick={() => handleCancelReservation(r._id)}
                                className="px-3 py-1 rounded-lg text-[10px] font-semibold bg-red-100 text-red-500 hover:bg-red-200 transition">✕ Cancel</button>
                            )}
                            {(r.status === "cancelled" || r.status === "paid") && (
                              <span className="text-[10px] text-gray-400 italic">No actions</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredReservations.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No reservations found 📭</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {totalResPages > 1 && (
                <div className="flex justify-center items-center gap-3 px-6 py-4 border-t border-gray-100">
                  <button onClick={() => setResPage(p => Math.max(p - 1, 1))} disabled={resPage === 1}
                    className="px-4 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium disabled:opacity-30 transition">← Prev</button>
                  <span className="text-xs text-gray-400">Page {resPage} / {totalResPages}</span>
                  <button onClick={() => setResPage(p => Math.min(p + 1, totalResPages))} disabled={resPage === totalResPages}
                    className="px-4 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 text-xs font-medium disabled:opacity-30 transition">Next →</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= REVIEWS ================= */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl flex-1 min-w-[200px]">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" placeholder="Search by user, restaurant or comment..."
                  value={reviewSearch} onChange={(e) => setReviewSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-600 placeholder-gray-400 w-full" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "5", "4", "3", "2", "1"].map((s) => (
                  <button key={s} onClick={() => setReviewFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition
                      ${reviewFilter === s ? "bg-orange-500 text-white shadow-sm" : "bg-orange-50 text-orange-600 hover:bg-orange-100"}`}>
                    {s === "all" ? "All" : `${"★".repeat(Number(s))}`}
                  </button>
                ))}
              </div>
              <span className="text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl font-medium">{filteredReviews.length} reviews</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredReviews.map((r) => (
                <div key={r._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${r.user?.name}&background=f97316&color=fff`} className="w-9 h-9 rounded-full shadow-sm" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{r.user?.name}</p>
                        <p className="text-[10px] text-gray-400">{r.user?.email}</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteReview(r._id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-[10px] text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full font-medium">🍽 {r.restaurant?.name}</span>
                  <div className="flex items-center gap-1 my-2">
                    {[1,2,3,4,5].map((star) => (
                      <svg key={star} className={`w-4 h-4 ${star <= r.rating ? "text-orange-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-gray-400 ml-1">({r.rating}/5)</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment || "No comment"}</p>
                  <p className="text-[10px] text-gray-400 mt-3">{new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <div className="col-span-2 text-center py-16 text-gray-400">
                  <p className="text-4xl mb-3">⭐</p>
                  <p className="text-sm">No reviews found</p>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}