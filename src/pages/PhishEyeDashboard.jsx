// import React, { useMemo, useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   CartesianGrid,
//   Legend,
//   AreaChart,
//   Area,
// } from "recharts";
// import {
//   ShieldAlert,
//   ShieldCheck,
//   Search,
//   Bell,
//   Download,
//   Globe,
//   Loader2,
//   ChevronRight,
//   UserCog,
//   Database,
//   Activity,
//   TrendingUp,
//   AlertTriangle,
//   Zap,
//   Eye,
//   Filter,
//   ArrowUp,
//   ArrowDown,
//   Sparkles,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // ---------- Helpers ----------
// const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;
// const now = () => new Date().toISOString();

// // Quick, naive threat scoring for demo purposes
// function scoreDomain(url) {
//   const u = url.toLowerCase();
//   let score = 0;
//   const redFlags = ["-", "login", "verify", "secure", "update", "wallet", "bank", "gift", "free", "promo", "offer", "prize", "support", "help"];
//   redFlags.forEach((w) => {
//     if (u.includes(w)) score += 8;
//   });
//   if (u.startsWith("http://")) score += 10;
//   if ((u.match(/\./g) || []).length > 3) score += 12;
//   if (u.length > 45) score += 6;
//   if (/\d{5,}/.test(u)) score += 10;
//   if (/xn--/.test(u)) score += 7;
//   score = Math.min(100, Math.round(score));
//   const label = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
//   return { score, label };
// }

// function downloadCSV(filename, rows) {
//   const header = Object.keys(rows[0] || {}).join(",");
//   const body = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
//   const csv = [header, body].join("\n");
//   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", filename);
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }

// // ---------- Mock Data ----------
// const initialScans = [
//   { id: 1, url: "https://login-secure-update-prize.com", score: 85, label: "High", result: "Phishing", time: "2025-08-21 10:24" },
//   { id: 2, url: "https://accounts.google.com", score: 6, label: "Low", result: "Legitimate", time: "2025-08-21 10:12" },
//   { id: 3, url: "http://bank-support-verify-login.ru", score: 92, label: "High", result: "Phishing", time: "2025-08-20 18:03" },
//   { id: 4, url: "https://university.sanjivani.org", score: 8, label: "Low", result: "Legitimate", time: "2025-08-20 12:51" },
//   { id: 5, url: "https://secure-wallet-help-paypal.co.support.net", score: 77, label: "High", result: "Phishing", time: "2025-08-19 20:31" },
//   { id: 6, url: "https://github.com", score: 5, label: "Low", result: "Legitimate", time: "2025-08-18 09:15" },
//   { id: 7, url: "http://xn--pple-43a.com", score: 61, label: "Medium", result: "Suspicious", time: "2025-08-17 22:09" },
// ];

// const weeklySeries = [
//   { day: "Mon", phishing: 12, legit: 44, total: 56 },
//   { day: "Tue", phishing: 9, legit: 38, total: 47 },
//   { day: "Wed", phishing: 15, legit: 41, total: 56 },
//   { day: "Thu", phishing: 7, legit: 36, total: 43 },
//   { day: "Fri", phishing: 11, legit: 40, total: 51 },
//   { day: "Sat", phishing: 6, legit: 33, total: 39 },
//   { day: "Sun", phishing: 10, legit: 35, total: 45 },
// ];

// const COLORS = {
//   primary: "#6366F1",
//   success: "#10B981", 
//   warning: "#F59E0B",
//   danger: "#EF4444",
//   info: "#06B6D4",
//   purple: "#8B5CF6",
//   pink: "#EC4899",
// };

// const GRADIENT_COLORS = ["#667eea", "#764ba2", "#f093fb", "#f5576c", "#4facfe", "#00f2fe"];

// // ---------- UI ----------
// export default function PhishEyeDashboard() {
//   const [role, setRole] = useState("admin");
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [scans, setScans] = useState(initialScans);
//   const [filter, setFilter] = useState("all");

//   const stats = useMemo(() => {
//     const total = scans.length;
//     const phishing = scans.filter((s) => s.result === "Phishing").length;
//     const legit = scans.filter((s) => s.result === "Legitimate").length;
//     const suspicious = scans.filter((s) => s.result === "Suspicious").length;
//     const avgScore = scans.reduce((a, b) => a + b.score, 0) / (total || 1);
    
//     // Calculate trends (mock data for demo)
//     const phishingTrend = 12; // +12%
//     const legitTrend = -5; // -5%
//     const scoreTrend = 8; // +8%
//     const totalTrend = 15; // +15%
    
//     return { 
//       total, 
//       phishing, 
//       legit, 
//       suspicious, 
//       avgScore: Math.round(avgScore),
//       trends: { phishingTrend, legitTrend, scoreTrend, totalTrend }
//     };
//   }, [scans]);

//   const pieData = useMemo(() => (
//     [
//       { name: "Phishing", value: stats.phishing, color: COLORS.danger },
//       { name: "Legitimate", value: stats.legit, color: COLORS.success },
//       { name: "Suspicious", value: stats.suspicious, color: COLORS.warning },
//     ]
//   ), [stats]);

//   const filteredScans = useMemo(() => {
//     let out = scans.filter((s) => s.url.toLowerCase().includes(query.toLowerCase()));
//     if (filter !== "all") out = out.filter((s) => s.label.toLowerCase() === filter);
//     return out;
//   }, [scans, filter, query]);

//   const latestHighRisk = useMemo(() => scans.filter(s => s.label === "High").slice(0, 3), [scans]);

//   const handleScan = async () => {
//     if (!query.trim()) return;
//     setLoading(true);
//     await new Promise((r) => setTimeout(r, 1200));
//     const { score, label } = scoreDomain(query.trim());
//     const result = label === "High" ? "Phishing" : label === "Medium" ? "Suspicious" : "Legitimate";
//     const record = {
//       id: scans.length + 1,
//       url: query.trim(),
//       score,
//       label,
//       result,
//       time: new Date().toISOString().replace("T", " ").slice(0, 16),
//     };
//     setScans((s) => [record, ...s]);
//     setLoading(false);
//   };

//   const exportCSV = () => {
//     const rows = scans.map(({ id, url, score, label, result, time }) => ({ id, url, score, label, result, time }));
//     downloadCSV(`phisheye_scans_${new Date().toISOString().slice(0,10)}.csv`, rows);
//   };

//   useEffect(() => {
//     document.title = "PhishEye Dashboard";
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <motion.div 
//           className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
//           animate={{ 
//             scale: [1, 1.2, 1],
//             rotate: [0, 180, 360],
//           }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//         />
//         <motion.div 
//           className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
//           animate={{ 
//             scale: [1.2, 1, 1.2],
//             rotate: [360, 180, 0],
//           }}
//           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
//         />
//         <motion.div 
//           className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
//           animate={{ 
//             scale: [1, 1.3, 1],
//             x: [-50, 50, -50],
//             y: [-30, 30, -30],
//           }}
//           transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
//         />
//       </div>

//       <div className="relative z-10 p-6 md:p-10">
//         <div className="max-w-7xl mx-auto space-y-8">
//           {/* Header */}
//           <motion.div 
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
//           >
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-2xl">
//                   <Eye className="h-8 w-8 text-white" />
//                 </div>
//                 <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
//                   Phish<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Eye</span>
//                 </h1>
//               </div>
//               <p className="text-slate-300 text-lg">Advanced threat detection powered by AI intelligence</p>
//               <div className="flex items-center gap-2 text-sm text-slate-400">
//                 <Sparkles className="h-4 w-4" />
//                 <span>Real-time scanning • Smart alerts • Enterprise-grade security</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <Select value={role} onValueChange={setRole}>
//                 <SelectTrigger className="w-[160px] bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl rounded-2xl">
//                   <SelectValue placeholder="Role" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-slate-800 border-slate-700 text-white rounded-2xl">
//                   <SelectItem value="admin">Admin</SelectItem>
//                   <SelectItem value="user">User</SelectItem>
//                 </SelectContent>
//               </Select>
//               <Button 
//                 variant="default" 
//                 className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 rounded-2xl shadow-2xl px-6 py-3 transition-all duration-300 hover:scale-105"
//                 onClick={exportCSV}
//               >
//                 <Download className="mr-2 h-5 w-5" /> Export Data
//               </Button>
//             </div>
//           </motion.div>

//           {/* Enhanced Scan Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             <Card className="rounded-3xl shadow-2xl border-0 bg-white/10 backdrop-blur-xl border-white/20">
//               <CardContent className="pt-8 pb-6">
//                 <div className="flex flex-col md:flex-row gap-4">
//                   <div className="relative flex-1">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
//                     <Input
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       placeholder="Enter URL or domain to scan for threats..."
//                       className="pl-12 h-14 rounded-2xl bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-lg backdrop-blur-xl"
//                       onKeyDown={(e) => e.key === "Enter" && handleScan()}
//                     />
//                   </div>
//                   <Button 
//                     className="h-14 rounded-2xl px-8 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-2xl transition-all duration-300 hover:scale-105 text-lg font-semibold" 
//                     onClick={handleScan} 
//                     disabled={loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="mr-3 h-6 w-6 animate-spin" />
//                         Scanning...
//                       </>
//                     ) : (
//                       <>
//                         <Zap className="mr-3 h-6 w-6" />
//                         AI Scan
//                       </>
//                     )}
//                   </Button>
//                 </div>
                
//                 {/* Enhanced Quick filter */}
//                 <div className="mt-6 flex items-center gap-3">
//                   <Filter className="h-5 w-5 text-slate-400" />
//                   <span className="text-slate-300 font-medium">Risk Levels:</span>
//                   <div className="flex gap-2">
//                     {[
//                       { k: "all", label: "All", color: "from-slate-500 to-slate-600" },
//                       { k: "low", label: "Low Risk", color: "from-emerald-500 to-green-600" },
//                       { k: "medium", label: "Medium Risk", color: "from-amber-500 to-orange-600" },
//                       { k: "high", label: "High Risk", color: "from-red-500 to-pink-600" },
//                     ].map((f) => (
//                       <motion.div
//                         key={f.k}
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         <Badge
//                           variant={filter === f.k ? "default" : "secondary"}
//                           className={`cursor-pointer rounded-xl px-4 py-2 transition-all duration-300 ${
//                             filter === f.k 
//                               ? `bg-gradient-to-r ${f.color} text-white shadow-lg` 
//                               : "bg-white/10 text-slate-300 hover:bg-white/20"
//                           }`}
//                           onClick={() => setFilter(f.k)}
//                         >
//                           {f.label}
//                         </Badge>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Enhanced KPI Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <EnhancedStatCard
//               icon={<ShieldAlert className="h-6 w-6" />}
//               title="Threats Detected"
//               value={stats.phishing}
//               trend={stats.trends.phishingTrend}
//               gradient="from-red-500 to-pink-600"
//               delay={0.2}
//             />
//             <EnhancedStatCard
//               icon={<ShieldCheck className="h-6 w-6" />}
//               title="Safe URLs"
//               value={stats.legit}
//               trend={stats.trends.legitTrend}
//               gradient="from-emerald-500 to-green-600"
//               delay={0.3}
//             />
//             <EnhancedStatCard
//               icon={<Activity className="h-6 w-6" />}
//               title="Avg Risk Score"
//               value={stats.avgScore}
//               trend={stats.trends.scoreTrend}
//               gradient="from-purple-500 to-indigo-600"
//               delay={0.4}
//             />
//             <EnhancedStatCard
//               icon={<Database className="h-6 w-6" />}
//               title="Total Scans"
//               value={stats.total}
//               trend={stats.trends.totalTrend}
//               gradient="from-cyan-500 to-blue-600"
//               delay={0.5}
//             />
//           </div>

//           {/* Enhanced Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.6 }}
//             >
//               <Card className="rounded-3xl border-0 shadow-2xl bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
//                     <TrendingUp className="h-6 w-6 text-cyan-400" />
//                     Weekly Threat Analysis
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={weeklySeries}>
//                       <defs>
//                         <linearGradient id="phishingGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
//                           <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
//                         </linearGradient>
//                         <linearGradient id="legitGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
//                           <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                       <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
//                       <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'rgba(15, 23, 42, 0.9)', 
//                           border: 'none', 
//                           borderRadius: '12px',
//                           color: 'white'
//                         }} 
//                       />
//                       <Area type="monotone" dataKey="phishing" stroke="#EF4444" fillOpacity={1} fill="url(#phishingGradient)" strokeWidth={3} />
//                       <Area type="monotone" dataKey="legit" stroke="#10B981" fillOpacity={1} fill="url(#legitGradient)" strokeWidth={3} />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.7 }}
//             >
//               <Card className="rounded-3xl border-0 shadow-2xl bg-white/10 backdrop-blur-xl border-white/20">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
//                     <AlertTriangle className="h-6 w-6 text-amber-400" />
//                     Threat Distribution
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie 
//                         data={pieData} 
//                         dataKey="value" 
//                         nameKey="name" 
//                         outerRadius={100} 
//                         innerRadius={60}
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
//                         labelLine={false}
//                         stroke="none"
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'rgba(15, 23, 42, 0.9)', 
//                           border: 'none', 
//                           borderRadius: '12px',
//                           color: 'white'
//                         }} 
//                       />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.8 }}
//             >
//               <Card className="rounded-3xl border-0 shadow-2xl bg-white/10 backdrop-blur-xl border-white/20">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
//                     <Activity className="h-6 w-6 text-purple-400" />
//                     Risk Score Trends
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="h-80">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={scans.slice(0, 12)}>
//                       <defs>
//                         <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//                           <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
//                           <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.7}/>
//                         </linearGradient>
//                       </defs>
//                       <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                       <XAxis dataKey="id" tickFormatter={(id) => `#${id}`} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
//                       <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
//                       <Tooltip 
//                         contentStyle={{ 
//                           backgroundColor: 'rgba(15, 23, 42, 0.9)', 
//                           border: 'none', 
//                           borderRadius: '12px',
//                           color: 'white'
//                         }} 
//                       />
//                       <Bar dataKey="score" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </CardContent>
//               </Card>
//             </motion.div>
//           </div>

//           {/* Enhanced Alerts Panel */}
//           <AnimatePresence>
//             {role === "admin" && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.6, delay: 0.9 }}
//               >
//                 <Card className="rounded-3xl border-0 shadow-2xl bg-white/10 backdrop-blur-xl border-white/20">
//                   <CardHeader className="flex flex-row items-center justify-between pb-4">
//                     <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
//                       <Bell className="h-6 w-6 text-red-400 animate-pulse" />
//                       Critical Threat Alerts
//                     </CardTitle>
//                     <motion.div
//                       animate={{ pulse: [1, 1.1, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                     >
//                       <Badge variant="destructive" className="rounded-xl px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold">
//                         {latestHighRisk.length} Active
//                       </Badge>
//                     </motion.div>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {latestHighRisk.length === 0 && (
//                       <div className="text-center py-8">
//                         <ShieldCheck className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
//                         <p className="text-slate-300 text-lg">All clear! No high-risk threats detected.</p>
//                       </div>
//                     )}
//                     {latestHighRisk.map((alert, index) => (
//                       <motion.div 
//                         key={alert.id}
//                         initial={{ opacity: 0, x: -20 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.5, delay: index * 0.1 }}
//                         className="flex items-center justify-between p-4 bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-2xl border border-red-500/30 backdrop-blur-sm"
//                       >
//                         <div className="flex items-center gap-4">
//                           <motion.div
//                             animate={{ rotate: [0, 10, -10, 0] }}
//                             transition={{ duration: 2, repeat: Infinity }}
//                           >
//                             <ShieldAlert className="h-6 w-6 text-red-400" />
//                           </motion.div>
//                           <div>
//                             <div className="font-semibold text-white text-lg">{alert.url}</div>
//                             <div className="text-sm text-red-300">Risk Score: {alert.score}/100 • {alert.time}</div>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                           <Button size="sm" variant="destructive" className="rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300 hover:scale-105">
//                             Block Domain
//                           </Button>
//                           <Button size="sm" variant="secondary" className="rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
//                             Review
//                           </Button>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Enhanced Data Table */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 1.0 }}
//           >
//             <Card className="rounded-3xl border-0 shadow-2xl bg-white/10 backdrop-blur-xl border-white/20">
//               <CardHeader className="flex flex-row items-center justify-between pb-4">
//                 <CardTitle className="text-white text-xl font-bold flex items-center gap-3">
//                   <Globe className="h-6 w-6 text-blue-400" />
//                   Scan History
//                 </CardTitle>
//                 <div className="text-sm text-slate-400">
//                   Showing {filteredScans.length} of {scans.length} results
//                 </div>
//               </CardHeader>
//               <CardContent className="overflow-hidden">
//                 <div className="rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-white/10 hover:bg-white/5">
//                         <TableHead className="text-slate-300 font-semibold">#</TableHead>
//                         <TableHead className="text-slate-300 font-semibold">Domain / URL</TableHead>
//                         <TableHead className="text-slate-300 font-semibold">Risk Score</TableHead>
//                         <TableHead className="text-slate-300 font-semibold">Threat Level</TableHead>
//                         <TableHead className="text-slate-300 font-semibold">Classification</TableHead>
//                         <TableHead className="text-slate-300 font-semibold">Detected At</TableHead>
//                         <TableHead className="text-right text-slate-300 font-semibold">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredScans.map((scan, index) => (
//                         <motion.tr
//                           key={scan.id}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3, delay: index * 0.05 }}
//                           className="border-white/10 hover:bg-white/5 transition-colors duration-300"
//                         >
//                           <TableCell className="text-slate-300 font-mono">#{scan.id}</TableCell>
//                           <TableCell className="max-w-[320px] overflow-hidden text-ellipsis text-white font-medium">
//                             {scan.url}
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
//                                 <motion.div
//                                   initial={{ width: 0 }}
//                                   animate={{ width: `${scan.score}%` }}
//                                   transition={{ duration: 1, delay: index * 0.1 }}
//                                   className={`h-full rounded-full ${
//                                     scan.score >= 70 ? 'bg-gradient-to-r from-red-500 to-pink-500' :
//                                     scan.score >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
//                                     'bg-gradient-to-r from-emerald-500 to-green-500'
//                                   }`}
//                                 />
//                               </div>
//                               <span className="text-white font-bold text-sm">{scan.score}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <motion.div
//                               whileHover={{ scale: 1.05 }}
//                               transition={{ type: "spring", stiffness: 300 }}
//                             >
//                               <Badge 
//                                 className={`rounded-xl px-3 py-1 font-semibold text-white ${
//                                   scan.label === "High" ? "bg-gradient-to-r from-red-500 to-pink-600" :
//                                   scan.label === "Medium" ? "bg-gradient-to-r from-amber-500 to-orange-600" :
//                                   "bg-gradient-to-r from-emerald-500 to-green-600"
//                                 }`}
//                               >
//                                 {scan.label} Risk
//                               </Badge>
//                             </motion.div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="flex items-center gap-2">
//                               {scan.result === "Phishing" && <ShieldAlert className="h-4 w-4 text-red-400" />}
//                               {scan.result === "Suspicious" && <AlertTriangle className="h-4 w-4 text-amber-400" />}
//                               {scan.result === "Legitimate" && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
//                               <span className="text-white font-medium">{scan.result}</span>
//                             </div>
//                           </TableCell>
//                           <TableCell className="whitespace-nowrap text-slate-300 font-mono text-sm">
//                             {scan.time}
//                           </TableCell>
//                           <TableCell className="text-right">
//                             <motion.div
//                               whileHover={{ scale: 1.05 }}
//                               whileTap={{ scale: 0.95 }}
//                             >
//                               <Button 
//                                 size="sm" 
//                                 variant="ghost" 
//                                 className="rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
//                               >
//                                 Details <ChevronRight className="ml-1 h-4 w-4" />
//                               </Button>
//                             </motion.div>
//                           </TableCell>
//                         </motion.tr>
//                       ))}
//                     </TableBody>
//                     <TableCaption className="text-slate-400 mt-4">
//                       Live threat intelligence powered by advanced ML algorithms
//                     </TableCaption>
//                   </Table>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Enhanced Footer */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.6, delay: 1.2 }}
//             className="text-center py-8"
//           >
//             <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
//               <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
//               <span className="text-slate-300 text-sm">
//                 Built with ❤️ for Sanjivani College | Department of Information Technology
//               </span>
//               <div className="text-slate-400 text-xs">
//                 PhishEye v2.0 | 2025–2026
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Enhanced Stat Card Component
// function EnhancedStatCard({ icon, title, value, trend, gradient, delay = 0 }) {
//   const isPositive = trend > 0;
  
//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20, scale: 0.95 }}
//       animate={{ opacity: 1, y: 0, scale: 1 }}
//       transition={{ duration: 0.6, delay }}
//       whileHover={{ scale: 1.02, y: -5 }}
//       className="group"
//     >
//       <Card className="rounded-3xl border-0 shadow-2xl bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden relative">
//         {/* Gradient Background */}
//         <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
        
//         <CardHeader className="pb-3 relative">
//           <div className="flex items-center justify-between">
//             <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
//               {React.cloneElement(icon, { className: "h-6 w-6 text-white" })}
//             </div>
//             <div className="flex items-center gap-1">
//               {isPositive ? (
//                 <ArrowUp className="h-4 w-4 text-emerald-400" />
//               ) : (
//                 <ArrowDown className="h-4 w-4 text-red-400" />
//               )}
//               <span className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
//                 {Math.abs(trend)}%
//               </span>
//             </div>
//           </div>
//           <CardTitle className="text-slate-300 text-sm font-medium mt-3">{title}</CardTitle>
//         </CardHeader>
//         <CardContent className="relative">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ duration: 0.8, delay: delay + 0.2, type: "spring" }}
//             className="text-4xl font-black text-white mb-2"
//           >
//             {value}
//           </motion.div>
//           <div className="text-xs text-slate-400">
//             {isPositive ? 'Increase' : 'Decrease'} from last week
//           </div>
//         </CardContent>
        
//         {/* Hover Effect Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
//       </Card>
//     </motion.div>
//   );
// }

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Bell,
  Download,
  Globe,
  Loader2,
  ChevronRight,
  UserCog,
  Database,
  Activity,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

// ---------- Helpers ----------
const fmtPct = (n) => `${(n * 100).toFixed(1)}%`;
const now = () => new Date().toISOString();

// Quick, naive threat scoring for demo purposes
function scoreDomain(url) {
  // Very simple heuristics for the demo; replace with your ML/API
  const u = url.toLowerCase();
  let score = 0;
  const redFlags = ["-", "login", "verify", "secure", "update", "wallet", "bank", "gift", "free", "promo", "offer", "prize", "support", "help"];
  redFlags.forEach((w) => {
    if (u.includes(w)) score += 8;
  });
  if (u.startsWith("http://")) score += 10;
  if ((u.match(/\./g) || []).length > 3) score += 12; // too many subdomains
  if (u.length > 45) score += 6;
  if (/\d{5,}/.test(u)) score += 10; // long numeric sequences
  if (/xn--/.test(u)) score += 7; // punycode
  score = Math.min(100, Math.round(score));
  const label = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
  return { score, label };
}

function downloadCSV(filename, rows) {
  const header = Object.keys(rows[0] || {}).join(",");
  const body = rows.map((r) => Object.values(r).map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const csv = [header, body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ---------- Mock Data ----------
const initialScans = [
  { id: 1, url: "https://login-secure-update-prize.com", score: 85, label: "High", result: "Phishing", time: "2025-08-21 10:24" },
  { id: 2, url: "https://accounts.google.com", score: 6, label: "Low", result: "Legitimate", time: "2025-08-21 10:12" },
  { id: 3, url: "http://bank-support-verify-login.ru", score: 92, label: "High", result: "Phishing", time: "2025-08-20 18:03" },
  { id: 4, url: "https://university.sanjivani.org", score: 8, label: "Low", result: "Legitimate", time: "2025-08-20 12:51" },
  { id: 5, url: "https://secure-wallet-help-paypal.co.support.net", score: 77, label: "High", result: "Phishing", time: "2025-08-19 20:31" },
  { id: 6, url: "https://github.com", score: 5, label: "Low", result: "Legitimate", time: "2025-08-18 09:15" },
  { id: 7, url: "http://xn--pple-43a.com", score: 61, label: "Medium", result: "Suspicious", time: "2025-08-17 22:09" },
];

const weeklySeries = [
  { day: "Mon", phishing: 12, legit: 44 },
  { day: "Tue", phishing: 9, legit: 38 },
  { day: "Wed", phishing: 15, legit: 41 },
  { day: "Thu", phishing: 7, legit: 36 },
  { day: "Fri", phishing: 11, legit: 40 },
  { day: "Sat", phishing: 6, legit: 33 },
  { day: "Sun", phishing: 10, legit: 35 },
];

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"]; // Recharts needs colors

// ---------- UI ----------
export default function PhishEyeDashboard() {
  const [role, setRole] = useState("admin");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [scans, setScans] = useState(initialScans);
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const total = scans.length;
    const phishing = scans.filter((s) => s.result === "Phishing").length;
    const legit = scans.filter((s) => s.result === "Legitimate").length;
    const suspicious = scans.filter((s) => s.result === "Suspicious").length;
    const avgScore = scans.reduce((a, b) => a + b.score, 0) / (total || 1);
    return { total, phishing, legit, suspicious, avgScore: Math.round(avgScore) };
  }, [scans]);

  const pieData = useMemo(() => (
    [
      { name: "Phishing", value: stats.phishing },
      { name: "Legitimate", value: stats.legit },
      { name: "Suspicious", value: stats.suspicious },
    ]
  ), [stats]);

  const filteredScans = useMemo(() => {
    let out = scans.filter((s) => s.url.toLowerCase().includes(query.toLowerCase()));
    if (filter !== "all") out = out.filter((s) => s.label.toLowerCase() === filter);
    return out;
  }, [scans, filter, query]);

  const latestHighRisk = useMemo(() => scans.filter(s => s.label === "High").slice(0, 3), [scans]);

  // const handleScan = async () => {
  //   if (!query.trim()) return;
  //   setLoading(true);
  //   await new Promise((r) => setTimeout(r, 800)); // simulate inference/API latency
  //   const { score, label } = scoreDomain(query.trim());
  //   const result = label === "High" ? "Phishing" : label === "Medium" ? "Suspicious" : "Legitimate";
  //   const record = {
  //     id: scans.length + 1,
  //     url: query.trim(),
  //     score,
  //     label,
  //     result,
  //     time: new Date().toISOString().replace("T", " ").slice(0, 16),
  //   };
  //   setScans((s) => [record, ...s]);
  //   setLoading(false);
  // };
  // inside your handleScan (or replace handleScan entirely with this)
const handleScan = async () => {
  if (!query.trim()) return;
  setLoading(true);

  try {
    const url = query.trim();

    // features (include model-expected placeholders)
    const features = {
      url,
      UsingIP: /\d+\.\d+\.\d+\.\d+/.test(url) ? 1 : 0,
      LongURL: url.length > 75 ? 1 : 0,
      ShortURL: /(bit\.ly|tinyurl\.com|goo\.gl)/.test(url) ? 1 : 0,
      SymbolAt: url.includes("@") ? 1 : 0,
      Redirecting: url.includes("//", 7) ? 1 : 0,
      PrefixSuffix: /-/.test(url) ? 1 : 0,
      SubDomains: (url.match(/\./g) || []).length - 1,
      HTTPS: url.startsWith("https://") ? 1 : 0,
      DomainRegLen: -1,
      Favicon: -1,
      NonStdPort: -1,
      HTTPSDomainURL: -1,
      RequestURL: -1,
      AnchorURL: -1,
      LinksInScriptTags: -1,
      ServerFormHandler: -1,
      InfoEmail: -1,
      AbnormalURL: -1,
      WebsiteForwarding: -1,
      StatusBarCust: -1,
      DisableRightClick: -1,
      UsingPopupWindow: -1,
      IframeRedirection: -1,
      AgeofDomain: -1,
      DNSRecording: -1,
      WebsiteTraffic: -1,
      PageRank: -1,
      GoogleIndex: -1,
      LinksPointingToPage: -1,
      StatsReport: -1,
    };

    // POST payload must include url (backend requires it)
    const response = await fetch("http://127.0.0.1:8000/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });

    if (!response.ok) throw new Error(`API returned status ${response.status}`);
    const data = await response.json();
    if (!data || data.error) throw new Error(data.error || "Invalid API response");

    // Use backend's values directly — do NOT remap or override
    const scannedUrl = data.url ?? url;
    const score = Number(data.score ?? 0);
    const label = data.label ?? "Low";          // e.g. High / Medium / Low (level)
    const result = data.result ?? "Legitimate"; // e.g. Phishing / Suspicious / Legitimate
    const time = data.time ?? new Date().toISOString().replace("T", " ").slice(0, 16);

    const record = {
      id: data.id ?? scans.length + 1,
      url: scannedUrl,
      score,
      label,
      result,
      time,
    };

    setScans((prev) => [record, ...prev]);
  } catch (err) {
    console.error("API error:", err);
    alert("Failed to connect to detection API. Make sure backend is running and request contains 'url'.");
  } finally {
    setLoading(false);
  }
};




  const exportCSV = () => {
    const rows = scans.map(({ id, url, score, label, result, time }) => ({ id, url, score, label, result, time }));
    downloadCSV(`phisheye_scans_${new Date().toISOString().slice(0,10)}.csv`, rows);
  };
useEffect(() => {
  document.title = "PhishEye Dashboard";

  // Connect to backend WebSocket for live updates
  const ws = new WebSocket("ws://127.0.0.1:8000/ws/updates");

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("New scan received via WebSocket:", data);
      setScans((prev) => [data, ...prev]);
    } catch (err) {
      console.error("WebSocket parse error:", err);
    }
  };

  ws.onerror = (err) => console.error("WebSocket error:", err);
  ws.onclose = () => console.warn("WebSocket disconnected.");

  return () => ws.close();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">PhishEye — Smart Phishing Domain Detection</h1>
            <p className="text-slate-600 mt-1">Centralized, real-time dashboard for scanning, scoring, and alerting.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[160px] bg-white/70 backdrop-blur border-0 shadow">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default" className="rounded-2xl shadow" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Scan Bar */}
        {/* Scan Bar */}
<Card className="rounded-2xl shadow-xl border-0 bg-white/80">
  <CardContent className="pt-6">
    <form
  onSubmit={(e) => {
    e.preventDefault();
    handleScan();
  }}
>
  <div className="flex flex-col md:flex-row gap-3">
    {/* Input Field */}
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Paste a URL or domain to scan…"
        className="pl-10 h-12 rounded-2xl"
      />
    </div>

    {/* Scan Button */}
    <Button
      type="submit"
      className="h-12 rounded-2xl px-6"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <ShieldCheck className="mr-2 h-5 w-5" />
      )}
      Scan Now
    </Button>
  </div>

  {/* Quick Filter */}
  <div className="mt-3 flex items-center gap-2 text-sm">
    <span className="text-slate-600">Quick filter:</span>
    {[
      { k: "all", label: "All" },
      { k: "low", label: "Low" },
      { k: "medium", label: "Medium" },
      { k: "high", label: "High" },
    ].map((f) => (
      <Badge
        key={f.k}
        variant={filter === f.k ? "default" : "secondary"}
        className="cursor-pointer rounded-xl"
        onClick={() => setFilter(f.k)}
      >
        {f.label}
      </Badge>
    ))}
  </div>
</form>

  </CardContent>
</Card>


        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Phishing URLs"
            value={stats.phishing}
            hint="Total flagged as high risk"
          />
          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Legitimate URLs"
            value={stats.legit}
            hint="Safely classified"
          />
          <StatCard
            icon={<Activity className="h-5 w-5" />}
            title="Avg Threat Score"
            value={stats.avgScore}
            hint="Across last scans"
          />
          <StatCard
            icon={<Database className="h-5 w-5" />}
            title="Total Scans"
            value={stats.total}
            hint="All records"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-0 shadow-xl bg-white/80">
            <CardHeader>
              <CardTitle>Weekly Detection Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklySeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="phishing" stroke="#EF4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="legit" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-xl bg-white/80">
            <CardHeader>
              <CardTitle>Classification Mix</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={95} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 shadow-xl bg-white/80">
            <CardHeader>
              <CardTitle>Risk Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scans.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="id" tickFormatter={(id) => `#${id}`} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6366F1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel for Admin */}
        {role === "admin" && (
          <Card className="rounded-2xl border-0 shadow-xl bg-white/80">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> High-Risk Alerts</CardTitle>
              <Badge variant="destructive" className="rounded-xl">{latestHighRisk.length} new</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {latestHighRisk.length === 0 && (
                <p className="text-sm text-slate-600">No high-risk detections recently.</p>
              )}
              {latestHighRisk.map((a) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium">{a.url}</div>
                      <div className="text-xs text-red-700">Score {a.score} — {a.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="destructive" className="rounded-xl">Block</Button>
                    <Button size="sm" variant="secondary" className="rounded-xl">Mark Reviewed</Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Data Table */}
        <Card className="rounded-2xl border-0 shadow-xl bg-white/80">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> Recent Scans</CardTitle>
            <div className="text-xs text-slate-500">Showing {filteredScans.length} of {scans.length}</div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Domain / URL</TableHead>
                  <TableHead>Threat Score</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Detected At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredScans.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50">
                    <TableCell>{s.id}</TableCell>
                    <TableCell className="max-w-[340px] overflow-hidden text-ellipsis">{s.url}</TableCell>
                    <TableCell>{s.score}</TableCell>
                    <TableCell>
                      <Badge className={{
                        High: "bg-red-600",
                        Medium: "bg-amber-500",
                        Low: "bg-emerald-600",
                      }[s.label] + " text-white rounded-xl"}>{s.label}</Badge>
                    </TableCell>
                    <TableCell>{s.result}</TableCell>
                    <TableCell className="whitespace-nowrap">{s.time}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" className="rounded-xl">
                        View <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
             
            </Table>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 py-6">
          Built for Sanjivani College | Department of IT — PhishEye (2025–2026)
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, hint }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="rounded-2xl border-0 shadow-xl bg-white/80">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-slate-600 flex items-center gap-2">{icon} {title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-xs text-slate-500 mt-1">{hint}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}