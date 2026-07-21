/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap, Sparkles, Battery, Coins, Smile, Moon, CupSoda, BookOpen,
  Users, AlertTriangle, Play, Volume2, VolumeX, RotateCcw, FileText, Award,
  ArrowRight, ChevronRight, Info, User, Zap, BookmarkCheck, CheckCircle2,
  HelpCircle, TrendingDown, LayoutGrid, Trophy, LogOut, Star, UserPlus, KeyRound, Phone, Hash
} from "lucide-react";

import { PlayerStats, GameEvent, ChoiceOption, DailyActivity, GamePhase, GameHistoryEntry } from "./types";
import { DAILY_ACTIVITIES, GAME_EVENTS } from "./data/situations";
import { DAILY_OUTCOMES, OutcomeDetail } from "./data/dailyOutcomes";
import { StatRing } from "./components/StatRing";
import { gameAudio } from "./components/AudioEngine";

interface WeatherType { id: string; name: string; icon: string; description: string; color: string; }
const WEATHERS: WeatherType[] = [
  { id: "normal", name: "Trời Ôn Hòa", icon: "🍃", description: "Mát mẻ, dễ chịu. Mọi hoạt động diễn ra bình thường.", color: "text-blue-400 bg-blue-500/5 border-blue-500/10" },
  { id: "hot", name: "Nắng Nóng (40°C)", icon: "☀️", description: "Đi học/Làm thêm tốn thêm pin (-4 Pin). Ngủ hồi phục tốt hơn (+6 Pin).", color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
  { id: "flood", name: "Mưa Lũ Ngập Đường", icon: "⛈️", description: "Đi học mệt mỏi (+5 Stress). Nghỉ học ở nhà ngủ nướng vui vẻ (+5 Vui).", color: "text-sky-400 bg-sky-500/5 border-sky-500/10" },
  { id: "exam_week", name: "Mùa Thi Căng Thẳng", icon: "📊", description: "Tự học ở thư viện tăng x1.5 hiệu quả GPA. Đi nhậu nhẹt bị phạt -5 GPA.", color: "text-purple-400 bg-purple-500/5 border-purple-500/10" },
  { id: "inflation", name: "Bão Giá Lạm Phát", icon: "💸", description: "Làm thêm lương cao hơn (+10đ). Đi chơi/Tụ tập tốn kém hơn (-5đ).", color: "text-red-400 bg-red-500/5 border-red-500/10" },
  { id: "slay_day", name: "Thứ Sáu Thảnh Thơi", icon: "🎉", description: "Đi chơi hoặc tham gia câu lạc bộ được giảm thêm 5 Stress, tăng 5 Vui.", color: "text-pink-400 bg-pink-500/5 border-pink-500/10" }
];

interface Achievement { id: string; title: string; description: string; icon: string; requirement: string; }
const ACHIEVEMENTS: Achievement[] = [
  { id: "first_day", title: "Chào Tân Sinh Viên", description: "Sinh tồn thành công qua Ngày 1 đầy bỡ ngỡ.", icon: "🙋", requirement: "Vượt qua ngày 1" },
  { id: "gpa_god", title: "Thủ Khoa Đất Việt", description: "Đạt mốc điểm GPA tuyệt đối 100% (4.0/4.0).", icon: "🎓", requirement: "GPA đạt 100%" },
  { id: "skip_boss", title: "Chúa Tể Cúp Học", description: "Cúp học trốn lịch chính khóa từ 4 lần trở lên.", icon: "🤫", requirement: "Trốn học ≥ 4 lần" },
  { id: "rich_kid", title: "Triệu Phú Giảng Đường", description: "Tích lũy tài chính rực rỡ từ 95 VNĐ trở lên.", icon: "💰", requirement: "Tài sản ≥ 95 VNĐ" },
  { id: "zen_master", title: "Đắc Đạo Thảnh Thơi", description: "Hoàn thành học kỳ với mức độ Stress siêu thấp dưới 10%.", icon: "🧘", requirement: "Stress ≤ 10%" },
  { id: "survivor", title: "Kẻ Sống Sót Vĩ Đại", description: "Hoàn thành trọn vẹn 14 ngày của học kỳ giông bão.", icon: "🏆", requirement: "Sống sót học kỳ" }
];

interface UserProfile {
  username: string;
  fullName: string;
  studentId: string;
  avatar: string;
}

interface LeaderboardEntry {
  student_id: string;
  full_name: string;
  avatar: string;
  score: number;
}

const AVATARS = ["🧑‍🎓", "👨‍💻", "👩‍💻", "🥷", "🧙‍♂️", "🕵️‍♂️", "🦸‍♀️", "🤖"];

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500/30 rounded-full"
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, scale: Math.random() * 2 }}
          animate={{ y: [null, Math.random() * -200], opacity: [0.2, 0.8, 0] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
};

const RPGStatusBar: React.FC<any> = ({ label, value, max = 100, colorClass, icon, title, displayValue, pulse }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`space-y-1.5 ${pulse ? "animate-pulse" : ""}`}>
      <div className="flex items-center justify-between text-xs md:text-sm font-black">
        <div className="flex items-center gap-2 text-stone-350"><span className="scale-110 opacity-90">{icon}</span><span>{title}</span></div>
        <span className="font-mono text-stone-50 font-black">{displayValue}</span>
      </div>
      <div className="h-4.5 w-full bg-zinc-950/80 rounded-full overflow-hidden border border-zinc-900 shadow-inner relative">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ type: "spring", stiffness: 60, damping: 12 }} className={`h-full bg-gradient-to-r rounded-full shadow-[0_0_12px_rgba(255,255,255,0.05)] ${colorClass}`} />
      </div>
    </div>
  );
};

export default function App() {
  const [phase, setPhase] = useState<"AUTH" | "START" | "INTRO" | "GAMEPLAY" | "EVENT" | "DAILY_FEEDBACK" | "SUMMARY" | "GAMEOVER" | "LEADERBOARD">("AUTH");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "", 
    password: "", 
    fullName: "",    // Đã xóa tên mặc định
    studentId: "",   // Đã xóa mã số mặc định
    avatar: "👨‍💻"
  });

  const [major, setMajor] = useState<"IT" | "BIZ" | "LANG" | any>("IT");
  const [currentDay, setCurrentDay] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherType | null>(null);
  const [stats, setStats] = useState<PlayerStats>({ gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 });
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const SEMESTER_DAYS = 14;

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.studentId) return alert("Vui lòng điền đủ thông tin!");
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
      // Auto login after register
      setCurrentUser(formData as UserProfile);
      setPhase("START");
      gameAudio.playPositive();
    } catch (err) {
      alert("Lỗi kết nối tới Server Database!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) return alert("Vui lòng điền tài khoản!");
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, password: formData.password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
      setCurrentUser(data as UserProfile);
      setPhase("START");
      gameAudio.playSelect();
    } catch (err) {
      alert("Lỗi kết nối tới Server Database!");
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (res.ok) setLeaderboard(data);
    } catch (error) {
      console.error("Không thể tải bảng xếp hạng", error);
    }
  };

  useEffect(() => {
    if (phase === "LEADERBOARD") {
      loadLeaderboard();
    }
  }, [phase]);

  const calculateFinalScore = () => {
    const finalScore = (stats.gpa + (100 - stats.stress) + stats.energy + stats.money + stats.happiness) / 5;
    return Math.round(finalScore * 10) / 10;
  };

  const handleEndSemester = async () => {
    const score = calculateFinalScore();
    if (currentUser) {
      try {
        await fetch('/api/submit-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: currentUser.studentId,
            fullName: currentUser.fullName,
            avatar: currentUser.avatar,
            score: score
          })
        });
      } catch (err) {
        console.error("Lỗi khi lưu điểm", err);
      }
    }
    setPhase("SUMMARY");
    gameAudio.playPositive();
  };

  // Logic Game Sinh Tồn (Được giữ nguyên và rút gọn)
  const processNextDay = () => {
    if (currentDay >= SEMESTER_DAYS) {
      handleEndSemester();
    } else {
      setCurrentDay(prev => prev + 1);
      const nextWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
      setCurrentWeather(nextWeather);
      setPhase("GAMEPLAY");
    }
  };

  const triggerHapticVisual = () => { setIsVibrating(true); setTimeout(() => setIsVibrating(false), 500); };
  
  const handlePerformSlotActivity = (activityId: string, activityName: string, baseCost: Record<string, number>) => {
     gameAudio.playTap();
     const draftStats = { ...stats };
     const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
     statKeys.forEach(k => { draftStats[k] = Math.min(100, Math.max(0, draftStats[k] + (baseCost[k] || 0))); });
     setStats(draftStats);
     
     if (draftStats.energy <= 0 || draftStats.stress >= 100 || draftStats.money <= 0 || draftStats.gpa <= 0) {
        setPhase("GAMEOVER");
        gameAudio.playOver();
     } else {
        processNextDay();
     }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-stone-100 font-sans selection:bg-amber-500 flex flex-col relative overflow-hidden">
      <Particles />

      <header className="border-b border-zinc-900/80 bg-[#070709]/80 backdrop-blur-md sticky top-0 z-35 py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.5)]">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-sm tracking-widest bg-gradient-to-r from-amber-100 to-amber-500 bg-clip-text text-transparent uppercase">
              Freshman Survival
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1.5 rounded-full border border-zinc-800">
                <span className="text-lg">{currentUser.avatar}</span>
                <span className="text-xs font-bold text-stone-300 hidden md:block">{currentUser.studentId}</span>
                <button onClick={() => { setCurrentUser(null); setPhase("AUTH"); }} className="ml-2 text-rose-400 hover:text-rose-300">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-stone-400">
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          
          {phase === "AUTH" && (
            <motion.div key="auth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto w-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500" />
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-display font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-zinc-400 leading-snug">
                  Game Sinh Tồn Sinh Viên Năm Nhất
                </h2>
                <p className="text-sm text-zinc-400 font-medium">
                  {authMode === "login" 
                    ? "Đăng nhập tài khoản game Freshman Survival" 
                    : "Đăng ký tài khoản game Freshman Survival"}
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <input type="text" placeholder="Tên đăng nhập" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none transition-all" />
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                  <input type="password" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none transition-all" />
                </div>

                {authMode === "register" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                    <div className="relative">
                      <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <input type="text" placeholder="Họ và Tên" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none" />
                    </div>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                      <input type="text" placeholder="Mã Số Sinh Viên (VD: DE210164)" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full bg-zinc-950/50 border border-zinc-800 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none uppercase" />
                    </div>
                    <div className="pt-2">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block mb-2">Chọn Avatar:</label>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {AVATARS.map(ava => (
                          <button key={ava} onClick={() => setFormData({...formData, avatar: ava})} className={`text-2xl p-2 rounded-xl border transition-all ${formData.avatar === ava ? "bg-amber-500/20 border-amber-500 scale-110" : "bg-zinc-900 border-zinc-800 grayscale opacity-50 hover:grayscale-0 hover:opacity-100"}`}>{ava}</button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <button disabled={isLoading} onClick={authMode === "login" ? handleLogin : handleRegister} className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-95 disabled:opacity-50">
                  {isLoading ? "Đang xử lý DB..." : authMode === "login" ? "Đăng Nhập" : "Đăng Ký"}
                </button>
                <p className="text-center text-xs font-medium text-zinc-400 cursor-pointer hover:text-amber-400" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
                  {authMode === "login" ? "Chưa có tài khoản? Đăng ký ngay!" : "Đã có tài khoản? Đăng nhập"}
                </p>
              </div>
            </motion.div>
          )}

          {phase === "START" && (
            <motion.div key="start" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-10 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl text-center space-y-7 relative z-10">
              <div className="inline-block relative">
                <span className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></span>
                <span className="text-7xl relative z-10">{currentUser?.avatar}</span>
              </div>
              <div>
                <h1 className="text-3xl font-display font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">
                  Chào, {currentUser?.fullName}
                </h1>
                <p className="text-stone-400 text-sm mt-2 font-mono">{currentUser?.studentId}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button onClick={() => { setStats({ gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 }); setCurrentDay(1); setPhase("GAMEPLAY"); }} className="py-4 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm uppercase">Bắt đầu học kỳ</button>
                <button onClick={() => setPhase("LEADERBOARD")} className="py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-amber-500 font-black text-sm uppercase flex items-center justify-center gap-2"><Trophy className="h-4 w-4" /> Bảng xếp hạng</button>
              </div>
            </motion.div>
          )}

          {phase === "LEADERBOARD" && (
            <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full p-8 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl space-y-6">
              <div className="text-center space-y-2">
                <Trophy className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
                <h2 className="text-3xl font-display font-black uppercase tracking-widest text-stone-100">Đại Lộ Danh Vọng</h2>
                <p className="text-sm text-zinc-400">Dữ liệu được nạp trực tiếp từ cơ sở dữ liệu (MySQL)</p>
              </div>

              <div className="space-y-3 mt-6">
                {leaderboard.length === 0 ? (
                  <p className="text-center text-zinc-500 py-10">Chưa có ai hoàn thành học kỳ.</p>
                ) : (
                  leaderboard.map((entry, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border ${index === 0 ? 'bg-amber-500/10 border-amber-500/30' : index === 1 ? 'bg-zinc-300/10 border-zinc-300/30' : index === 2 ? 'bg-orange-700/10 border-orange-700/30' : 'bg-zinc-900/50 border-zinc-800'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`text-xl font-black ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-zinc-300' : index === 2 ? 'text-orange-600' : 'text-zinc-600'}`}>#{index + 1}</div>
                        <span className="text-3xl">{entry.avatar}</span>
                        <div>
                          <p className="font-bold text-stone-100">{entry.full_name}</p>
                          <p className="text-[11px] text-zinc-400 font-mono uppercase">{entry.student_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{entry.score}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase">Điểm</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button onClick={() => setPhase("START")} className="w-full mt-6 py-4 rounded-xl bg-zinc-900 text-stone-300 font-black text-sm uppercase">Quay lại</button>
            </motion.div>
          )}

          {phase === "GAMEPLAY" && (
            <motion.div key="gameplay" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <h2 className="text-2xl font-display font-black text-stone-100 uppercase">Ngày thứ {currentDay} / {SEMESTER_DAYS}</h2>
                  <div className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-black">
                    {currentWeather?.name || "Trời đẹp"}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-2">
                  <RPGStatusBar label="gpa" value={stats.gpa} colorClass="from-amber-500 to-yellow-400" icon={<GraduationCap className="h-4 w-4 text-amber-400" />} title="GPA" displayValue={`${stats.gpa}%`} />
                  <RPGStatusBar label="stress" value={stats.stress} colorClass="from-rose-600 to-red-500" icon={<AlertTriangle className="h-4 w-4 text-rose-400" />} title="STRESS" displayValue={`${stats.stress}%`} pulse={stats.stress >= 80} />
                  <RPGStatusBar label="energy" value={stats.energy} colorClass="from-emerald-500 to-green-400" icon={<Battery className="h-4 w-4 text-emerald-400" />} title="PIN" displayValue={`${stats.energy}%`} pulse={stats.energy <= 20} />
                  <RPGStatusBar label="money" value={stats.money} colorClass="from-yellow-500 to-amber-400" icon={<Coins className="h-4 w-4 text-yellow-400" />} title="VNĐ" displayValue={`${stats.money}`} />
                  <RPGStatusBar label="happiness" value={stats.happiness} colorClass="from-cyan-500 to-blue-400" icon={<Smile className="h-4 w-4 text-cyan-400" />} title="VUI" displayValue={`${stats.happiness}%`} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-zinc-900">
                  <button onClick={() => handlePerformSlotActivity("study", "Lên Giảng Đường", { gpa: 10, stress: 15, energy: -20, money: -5, happiness: -5 })} className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center cursor-pointer active:scale-95">📚 Đi Học</button>
                  <button onClick={() => handlePerformSlotActivity("parttime", "Làm Thêm", { gpa: -5, stress: 10, energy: -25, money: 25, happiness: -10 })} className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center cursor-pointer active:scale-95">💸 Làm Thêm</button>
                  <button onClick={() => handlePerformSlotActivity("party", "Nhậu Nhẹt", { gpa: -10, stress: -25, energy: -15, money: -20, happiness: 30 })} className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center cursor-pointer active:scale-95">🍻 Tụ Tập</button>
                  <button onClick={() => handlePerformSlotActivity("rest", "Ngủ Nướng", { gpa: -15, stress: -15, energy: 35, money: 0, happiness: 10 })} className="p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-center cursor-pointer active:scale-95">🛌 Ngủ Nướng</button>
                </div>
              </div>
            </motion.div>
          )}

          {phase === "SUMMARY" && (
            <motion.div key="summary" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-10 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl text-center space-y-6">
              <div className="text-6xl animate-bounce">🎉</div>
              <div><h2 className="text-3xl font-display font-black text-stone-100 uppercase tracking-widest">Tốt Nghiệp Năm Nhất!</h2><p className="text-sm font-bold text-stone-400 mt-2">Dữ liệu của bạn đã được cập nhật vào CSDL Server.</p></div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
                <span className="text-xs text-indigo-400 font-black uppercase tracking-widest block mb-2">ĐIỂM XẾP HẠNG CỦA BẠN</span>
                <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{calculateFinalScore()} <span className="text-lg text-zinc-500">/ 100</span></p>
              </div>
              <div className="grid grid-cols-2 gap-4"><button onClick={() => setPhase("LEADERBOARD")} className="py-4 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm uppercase">Bảng Xếp Hạng</button><button onClick={() => setPhase("START")} className="py-4 rounded-xl bg-zinc-900 text-stone-300 font-black text-sm uppercase">Chơi Lại</button></div>
            </motion.div>
          )}

          {phase === "GAMEOVER" && (
            <motion.div key="gameover" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-10 rounded-3xl bg-[#0b0b0d] border border-rose-900/30 shadow-2xl text-center space-y-6">
              <div className="text-6xl">💀</div>
              <div><h2 className="text-3xl font-display font-black text-rose-500 uppercase tracking-widest">Toang Học Kỳ!</h2><p className="text-sm font-bold text-stone-400 mt-2">Chỉ số của bạn đã chạm đáy. Bảo lưu chờ kỳ sau thôi.</p></div>
              <button onClick={() => setPhase("START")} className="w-full py-4 rounded-xl bg-rose-600 text-white font-black text-sm uppercase mt-4">Chơi Lại Từ Đầu</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}