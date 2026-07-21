/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap, Battery, Coins, Smile, Moon, CupSoda, BookOpen,
  Users, AlertTriangle, Volume2, VolumeX, RotateCcw, FileText, Award,
  ArrowRight, Info, User, Zap, BookmarkCheck, CheckCircle2,
  Trophy, LogOut, UserPlus, KeyRound, Hash
} from "lucide-react";

import { PlayerStats, GameEvent, ChoiceOption, DailyActivity, GamePhase, GameHistoryEntry } from "./types";
import { GAME_EVENTS } from "./data/situations";
import { DAILY_OUTCOMES, OutcomeDetail } from "./data/dailyOutcomes";
import { gameAudio } from "./components/AudioEngine";

interface WeatherType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const WEATHERS: WeatherType[] = [
  { id: "normal", name: "Trời Ôn Hòa", icon: "🍃", description: "Mát mẻ, dễ chịu. Mọi hoạt động diễn ra bình thường.", color: "text-blue-400 bg-black/40 border-blue-500/30" },
  { id: "hot", name: "Nắng Nóng (40°C)", icon: "☀️", description: "Đi học/Làm thêm tốn thêm pin (-4 Pin). Ngủ hồi phục tốt hơn (+6 Pin).", color: "text-amber-400 bg-black/40 border-amber-500/30" },
  { id: "flood", name: "Mưa Lũ Ngập Đường", icon: "⛈️", description: "Đi học mệt mỏi (+5 Stress). Nghỉ học ở nhà ngủ nướng vui vẻ (+5 Vui).", color: "text-sky-400 bg-black/40 border-sky-500/30" },
  { id: "exam_week", name: "Mùa Thi Căng Thẳng", icon: "📊", description: "Tự học ở thư viện tăng x1.5 hiệu quả GPA. Đi nhậu nhẹt bị phạt -5 GPA.", color: "text-purple-400 bg-black/40 border-purple-500/30" },
  { id: "inflation", name: "Bão Giá Lạm Phát", icon: "💸", description: "Làm thêm lương cao hơn (+10đ). Đi chơi/Tụ tập tốn kém hơn (-5đ).", color: "text-red-400 bg-black/40 border-red-500/30" },
  { id: "slay_day", name: "Thứ Sáu Thảnh Thơi", icon: "🎉", description: "Đi chơi hoặc tham gia câu lạc bộ được giảm thêm 5 Stress, tăng 5 Vui.", color: "text-pink-400 bg-black/40 border-pink-500/30" }
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

interface UserProfile { username: string; fullName: string; studentId: string; avatar: string; }
interface LeaderboardEntry { student_id: string; full_name: string; avatar: string; score: number; }
const AVATARS = ["🧑‍🎓", "👨‍💻", "👩‍💻", "🥷", "🧙‍♂️", "🕵️‍♂️", "🦸‍♀️", "🤖"];

// --- HỆ THỐNG BẦU TRỜI & THỜI GIAN ĐỘNG ---
const SkyBackground = ({ slot, phase }: { slot: string, phase: string }) => {
  const isGameplay = ["GAMEPLAY", "EVENT", "DAILY_FEEDBACK"].includes(phase);
  const activeSlot = isGameplay ? slot : "evening"; 

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none transition-colors duration-1000">
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlot === 'morning' ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-sky-300 via-blue-200 to-amber-100`} />
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlot === 'afternoon' ? 'opacity-100' : 'opacity-0'} bg-gradient-to-br from-orange-400 via-rose-400 to-purple-600`} />
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlot === 'evening' ? 'opacity-100' : 'opacity-0'} bg-[#050507]`} />

      <motion.div
        animate={{
          y: activeSlot === 'morning' ? '15vh' : activeSlot === 'afternoon' ? '60vh' : '100vh',
          x: activeSlot === 'morning' ? '20vw' : activeSlot === 'afternoon' ? '70vw' : '50vw',
          opacity: activeSlot === 'evening' ? 0 : 1,
          scale: activeSlot === 'afternoon' ? 1.5 : 1
        }}
        transition={{ duration: 2, type: 'spring' }}
        className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-300 to-orange-400 rounded-full shadow-[0_0_80px_rgba(250,204,21,0.8)]"
      />

      <motion.div
        animate={{
          y: activeSlot === 'evening' ? '15vh' : '100vh',
          x: '75vw',
          opacity: activeSlot === 'evening' ? 1 : 0
        }}
        transition={{ duration: 2, type: 'spring' }}
        className="absolute top-0 left-0 w-24 h-24 bg-stone-200 rounded-full shadow-[0_0_60px_rgba(255,255,255,0.4)]"
      >
        <div className="absolute top-1 right-4 w-20 h-20 bg-[#050507] rounded-full transition-colors duration-1000" />
      </motion.div>

      <AnimatePresence>
        {activeSlot === 'evening' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, scale: Math.random() * 1.5, opacity: Math.random() * 0.5 + 0.2 }}
                animate={{ opacity: [0.2, 0.9, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RPGStatusBar: React.FC<any> = ({ label, value, max = 100, colorClass, icon, title, displayValue, pulse = false }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`space-y-1.5 ${pulse ? "animate-pulse" : ""}`}>
      <div className="flex items-center justify-between text-xs md:text-sm font-black">
        <div className="flex items-center gap-2 text-stone-300"><span className="scale-110 opacity-90">{icon}</span><span>{title}</span></div>
        <span className="font-mono text-stone-50 font-black">{displayValue}</span>
      </div>
      <div className="h-4.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ type: "spring", stiffness: 60, damping: 12 }} className={`h-full bg-gradient-to-r rounded-full shadow-[0_0_12px_rgba(255,255,255,0.05)] ${colorClass}`} />
        {pulse && <div className="absolute inset-0 bg-red-500/20 animate-ping rounded-full pointer-events-none" />}
      </div>
    </div>
  );
};

const CharacterAvatar: React.FC<any> = ({ stats, major }) => {
  let face = "🧑‍🎓"; let moodName = "Ổn định"; let bubbleText = "Học kỳ năm nhất thật thú vị, cố gắng sống sót thôi!"; let characterAnimation = "animate-pulse";
  
  // Nền kính mờ đen tiêu chuẩn cho mọi trạng thái
  let glowColor = "shadow-[0_0_30px_rgba(139,92,246,0.15)] border-violet-500/30 bg-black/40"; 

  if (stats.stress >= 80) { face = "🤯"; moodName = "Quá tải"; bubbleText = "Áp lực điên cuồng, đầu sắp bốc hỏa rồi! Phải đi xả hơi gấp!"; glowColor = "shadow-[0_0_30px_rgba(239,68,68,0.2)] border-red-500/30 bg-black/40"; characterAnimation = "animate-bounce"; }
  else if (stats.energy <= 20) { face = "😪"; moodName = "Lao lực"; bubbleText = "Hết sạch pin rồi... Mắt díp lại... Cần ngủ gấp..."; glowColor = "shadow-[0_0_30px_rgba(107,114,128,0.2)] border-zinc-500/30 bg-black/40"; characterAnimation = "animate-pulse"; }
  else if (stats.money <= 15) { face = "😭"; moodName = "Cháy túi"; bubbleText = "Hết tiền rồi! Có ai cứu đói bữa mì tôm không..."; glowColor = "shadow-[0_0_30px_rgba(245,158,11,0.2)] border-orange-500/30 bg-black/40"; characterAnimation = "animate-bounce"; }
  else if (stats.gpa <= 30) { face = "🤡"; moodName = "Nguy kịch"; bubbleText = "GPA tụt dốc thảm hại, có khi nào phải bảo lưu về quê trồng rau..."; glowColor = "shadow-[0_0_30px_rgba(244,63,94,0.2)] border-rose-500/30 bg-black/40"; }
  else if (stats.money >= 80) { face = "😎"; moodName = "Phú hộ"; bubbleText = "Rủng rỉnh tiền bạc! Chiều nay bao cả đám trà sữa lẩu nướng nhé!"; glowColor = "shadow-[0_0_30px_rgba(234,179,8,0.2)] border-yellow-500/30 bg-black/40"; }
  else if (stats.gpa >= 90) { face = "🤓"; moodName = "Học bá"; bubbleText = "Kiến thức lấp lánh! Mấy đề kiểm tra này chỉ là muỗi thôi."; glowColor = "shadow-[0_0_30px_rgba(59,130,246,0.2)] border-blue-500/30 bg-black/40"; }
  else if (stats.happiness >= 85) { face = "🥰"; moodName = "Yêu đời"; bubbleText = "Đời sinh viên vui ghê! Mọi thứ đang tiến triển cực tốt."; glowColor = "shadow-[0_0_30px_rgba(236,72,153,0.2)] border-pink-500/30 bg-black/40"; }

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center backdrop-blur-md ${glowColor}`}>
      <span className="text-xs text-zinc-300 font-black tracking-widest uppercase mb-3.5 drop-shadow-md">Tình Trạng Nhân Vật</span>
      <div className="relative flex items-center justify-center h-24 w-24 bg-black/60 rounded-full border border-white/10 shadow-inner">
        <span className={`text-5xl select-none ${characterAnimation}`}>{face}</span>
      </div>
      <div className="mt-2.5 text-center">
        <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono font-black text-stone-100 uppercase tracking-widest shadow-sm">Trạng thái: {moodName}</span>
      </div>
      <div className="mt-4 w-full relative bg-black/40 border border-white/10 p-3 rounded-xl text-center shadow-lg">
        <p className="text-stone-200 text-xs md:text-sm font-bold leading-relaxed italic">"{bubbleText}"</p>
      </div>
    </div>
  );
};

export default function App() {
  const [phase, setPhase] = useState<GamePhase | "AUTH" | "LEADERBOARD">("AUTH");
  const [prevPhase, setPrevPhase] = useState<any>("START");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", fullName: "", studentId: "", avatar: "👨‍💻" });

  const [playerName, setPlayerName] = useState("");
  const [major, setMajor] = useState<"IT" | "BIZ" | "LANG" | any>("IT");
  const [currentDay, setCurrentDay] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [unlockedNotice, setUnlockedNotice] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherType | null>(null);

  const [dailyFeedback, setDailyFeedback] = useState<any>(null);
  const [stats, setStats] = useState<PlayerStats>({ gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 });
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [choiceFeedback, setChoiceFeedback] = useState<any>(null);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showIntroTutorial, setShowIntroTutorial] = useState(true);
  const [deathCause, setDeathCause] = useState<string>("");

  const [skippedClassesCount, setSkippedClassesCount] = useState(0);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [currentSlot, setCurrentSlot] = useState<"morning" | "afternoon" | "evening" | any>("morning");
  const [slotLog, setSlotLog] = useState<any[]>([]);

  const SEMESTER_DAYS = 14;

  useEffect(() => { gameAudio.enabled = soundEnabled; }, [soundEnabled]);
  
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`achievements_${currentUser.username}`);
      if (saved) { try { setUnlockedAchievements(JSON.parse(saved)); } catch (e) { } } 
      else { setUnlockedAchievements([]); }
    } else { setUnlockedAchievements([]); }
  }, [currentUser]);

  const loadLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (res.ok) setLeaderboard(data);
    } catch (error) { console.error("Không thể tải bảng xếp hạng", error); }
  };
  useEffect(() => { if (phase === "LEADERBOARD") loadLeaderboard(); }, [phase]);

  const handleRegister = async () => {
    if (!formData.username || !formData.password || !formData.studentId || !formData.fullName) return alert("Vui lòng điền đủ thông tin!");
    setIsLoading(true);
    try {
      const res = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) return alert(data.error);
      setCurrentUser(formData as UserProfile); setPlayerName(formData.fullName); setPhase("START"); gameAudio.playPositive();
    } catch (err) { alert("Lỗi kết nối tới Server Database!"); } finally { setIsLoading(false); }
  };

  const handleLogin = async () => {
    if (!formData.username || !formData.password) return alert("Vui lòng điền tài khoản!");
    setIsLoading(true);
    try {
      const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: formData.username, password: formData.password }) });
      const data = await res.json();
      if (!res.ok) return alert(data.error);
      setCurrentUser(data as UserProfile); setPlayerName(data.fullName); setPhase("START"); gameAudio.playSelect();
    } catch (err) { alert("Lỗi kết nối tới Server Database!"); } finally { setIsLoading(false); }
  };

  const calculateFinalScore = () => Math.round(((stats.gpa + (100 - stats.stress) + stats.energy + stats.money + stats.happiness) / 5) * 10) / 10;
  const handleEndSemester = async () => {
    const score = calculateFinalScore();
    if (currentUser) {
      try { await fetch('/api/submit-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentId: currentUser.studentId, fullName: currentUser.fullName, avatar: currentUser.avatar, score: score }) }); } catch (err) { }
    }
  };

  const triggerHapticVisual = () => { setIsVibrating(true); setTimeout(() => setIsVibrating(false), 500); };
  const updateStatWithLimits = (current: number, change: number): number => Math.min(100, Math.max(0, current + change));
  const formatGPAScore = (percent: number): string => `${(percent / 25).toFixed(2)}/4.0`;

  const getDayOfWeek = (day: number) => {
    const dow = (day - 1) % 7; const labels = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
    return { label: labels[dow], week: Math.ceil(day / 7), isWeekend: dow >= 5, dowIndex: dow };
  };

  const getSlotSchedule = (day: number, slot: "morning" | "afternoon" | "evening") => {
    const dow = getDayOfWeek(day);
    if (dow.isWeekend) return { type: "free" as const, label: "🍃 Cuối Tuần Tự Do", description: "Đi làm thêm kiếm VNĐ, ngủ nướng bồi bổ sức khỏe hoặc tụ tập bạn bè xả hơi." };
    if (slot === "evening") return { type: "free" as const, label: "🍻 Buổi Tối Tự Do", description: "Thời gian tuyệt vời để sinh hoạt CLB, nhậu nhẹt vỉa hè hoặc ngủ sớm." };
    if (slot === "morning") {
      if (dow.dowIndex === 0 || dow.dowIndex === 2 || dow.dowIndex === 4) return { type: "class" as const, label: "📚 Học Chính Khóa (Bắt buộc)", description: "Môn Lý thuyết chuyên ngành giảng đường lớn. Đi học nghiêm túc để giữ GPA!" };
      else return { type: "free" as const, label: "🍃 Buổi Sáng Trống Lịch", description: "Sáng nay được nghỉ! Có thể tự học thư viện, đi làm thêm hoặc ngủ nướng." };
    }
    if (dow.dowIndex === 1 || dow.dowIndex === 3) return { type: "class" as const, label: "💻 Thực Hành Nhóm (Bắt buộc)", description: "Thực hành phòng máy hoặc thảo luận thuyết trình nhóm căng thẳng!" };
    else return { type: "free" as const, label: "🍃 Buổi Chiều Trống Lịch", description: "Chiều nay trống lịch! Tranh thủ tự học hoặc tham gia hoạt động năng nổ." };
  };

  const handleSelectMajor = (selected: "IT" | "BIZ" | "LANG") => {
    gameAudio.playTap(); setMajor(selected);
    if (selected === "IT") setStats({ gpa: 85, stress: 45, energy: 80, money: 50, happiness: 70 });
    else if (selected === "BIZ") setStats({ gpa: 75, stress: 30, energy: 90, money: 85, happiness: 75 });
    else setStats({ gpa: 80, stress: 25, energy: 95, money: 55, happiness: 90 });
  };

  const handleStartGame = () => { gameAudio.playSelect(); setPhase("INTRO"); };
  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id) && currentUser) {
      const updated = [...unlockedAchievements, id]; setUnlockedAchievements(updated); localStorage.setItem(`achievements_${currentUser.username}`, JSON.stringify(updated));
      setUnlockedNotice(ACHIEVEMENTS.find(a => a.id === id)?.title || ""); gameAudio.playPositive(); setTimeout(() => setUnlockedNotice(""), 4000);
    }
  };

  const handleConfirmOnboarding = () => {
    if (!playerName.trim()) return alert("Vui lòng nhập tên sinh viên!"); gameAudio.playPositive();
    let initStats = { gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 };
    if (major === "IT") initStats = { gpa: 85, stress: 45, energy: 80, money: 50, happiness: 70 };
    else if (major === "BIZ") initStats = { gpa: 75, stress: 30, energy: 90, money: 85, happiness: 75 };
    else initStats = { gpa: 80, stress: 25, energy: 95, money: 55, happiness: 90 };

    setStats(initStats); setSkippedClassesCount(0); setDodgeCount(0);
    setCurrentWeather(WEATHERS[0]); setPhase("GAMEPLAY"); setCurrentDay(1); setHistory([]); setCurrentSlot("morning");
  };

  const calculateFinalImpact = (activityId: string, baseCost: Record<string, number>, extraImpact: Partial<PlayerStats> = {}) => {
    const finalImpact: Record<string, number> = {}; const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => {
      let change = 0; if (k in baseCost) change += baseCost[k]; if (extraImpact && k in extraImpact) change += extraImpact[k]!;
      if (currentWeather) {
        if (currentWeather.id === "hot") { if ((activityId === "lecture" || activityId === "parttime") && k === "energy") change -= 4; if (activityId === "rest" && k === "energy" && change > 0) change += 6; }
        if (currentWeather.id === "flood") { if (activityId === "lecture" && k === "stress") change += 5; if (activityId === "rest" && k === "happiness") change += 5; }
        if (currentWeather.id === "exam_week") { if (activityId === "library" && k === "gpa" && change > 0) change = Math.round(change * 1.5); if (activityId === "party" && k === "gpa") change -= 5; }
        if (currentWeather.id === "inflation") { if (activityId === "parttime" && k === "money" && change > 0) change += 10; if (activityId === "party" && k === "money" && change < 0) change -= 5; }
        if (currentWeather.id === "slay_day") { if ((activityId === "party" || activityId === "club") && k === "stress" && change < 0) change -= 5; if ((activityId === "party" || activityId === "club") && k === "happiness" && change > 0) change += 5; }
      }
      finalImpact[k] = change;
    });
    return { finalImpact, ancestralDodged: false };
  };

  const evaluateEndDayStats = (currStats: PlayerStats, finalImpact: Record<string, number>) => {
    const draftStats: PlayerStats = { ...currStats }; const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => { draftStats[k] = updateStatWithLimits(draftStats[k], finalImpact[k] || 0); });
    if ((finalImpact.stress && finalImpact.stress > 0) || draftStats.stress > 80 || draftStats.energy < 20) triggerHapticVisual();
    setStats(draftStats);

    if (draftStats.gpa >= 100) unlockAchievement("gpa_god"); if (draftStats.money >= 95) unlockAchievement("rich_kid");

    if (draftStats.energy <= 0) { setDeathCause("Lao lực cạn kiệt năng lượng! Bạn bất tỉnh nhân sự ngay tại hành lang khu tự học và phải nhập viện truyền nước gấp. Kết thúc học kỳ."); gameAudio.playOver(); setPhase("GAMEOVER"); return true; }
    if (draftStats.stress >= 100) { setDeathCause("Stress vượt đỉnh 100%! Bạn bị đóng băng não bộ do áp lực bài vở dồn dập, không thể tiếp thu thêm bất cứ kiến thức gì."); gameAudio.playOver(); setPhase("GAMEOVER"); return true; }
    if (draftStats.money <= 0) { setDeathCause("Tài chính chạm đáy 0đ! Bạn không còn nổi 1 nghìn đồng ăn mì tôm úp vỉa hè, đành đóng vali bảo lưu về quê."); gameAudio.playOver(); setPhase("GAMEOVER"); return true; }
    if (draftStats.gpa <= 0) { setDeathCause("GPA chạm đáy phế tích! Bạn chính thức nhận quyết định buộc thôi học gửi trực tiếp về phụ huynh từ Phòng đào tạo."); gameAudio.playOver(); setPhase("GAMEOVER"); return true; }
    return false;
  };

  const handlePerformSlotActivity = (activityId: string, activityName: string, baseCost: Record<string, number>, isSkipClass = false) => {
    const { finalImpact, ancestralDodged } = calculateFinalImpact(activityId, baseCost);
    if (ancestralDodged) { setDodgeCount(prev => { const newVal = prev + 1; if (newVal >= 2) unlockAchievement("spiritual_saved"); return newVal; }); }
    if (isSkipClass) { setSkippedClassesCount(prev => { const newVal = prev + 1; if (newVal >= 4) unlockAchievement("skip_boss"); return newVal; }); }

    setSelectedActivity({ id: activityId, name: activityName, description: "", icon: "", baseCost: baseCost as any, colorClass: "" });
    const slotLabel = currentSlot === "morning" ? "Sáng" : currentSlot === "afternoon" ? "Chiều" : "Tối";
    const loggedName = `${slotLabel}: ${isSkipClass ? `[CÚP HỌC] ` : ""}${activityName}`;
    const newSlotLog = [...slotLog, { slot: currentSlot, activityName: loggedName, isSkipClass, statsImpact: finalImpact }];
    setSlotLog(newSlotLog); gameAudio.playTap();

    const draftStats = { ...stats }; const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => { draftStats[k] = updateStatWithLimits(draftStats[k], finalImpact[k] || 0); });
    if ((finalImpact.stress && finalImpact.stress > 0) || draftStats.stress > 80 || draftStats.energy < 25) triggerHapticVisual();
    setStats(draftStats);

    if (currentSlot === "morning") setCurrentSlot("afternoon");
    else if (currentSlot === "afternoon") setCurrentSlot("evening");
    else handleEndDay(newSlotLog, draftStats);
  };

  const handleEndDay = (completedSlotLog: typeof slotLog, currentStats: PlayerStats) => {
    let matchingEvent: GameEvent | null = null;
    if (currentDay === 1) matchingEvent = GAME_EVENTS.find(e => e.id === "e1") || null;
    else if (Math.random() < 0.35) {
      const unusedEvents = GAME_EVENTS.filter(e => e.id !== "e1" && !history.some(h => h.eventTitle === e.title));
      const pool = unusedEvents.length > 0 ? unusedEvents : GAME_EVENTS.filter(e => e.id !== "e1");
      matchingEvent = pool[Math.floor(Math.random() * pool.length)] || null;
    }

    const actsPlayedIds = completedSlotLog.map(l => {
      const name = l.activityName.toLowerCase();
      if (name.includes("thư viện")) return "library"; if (name.includes("làm thêm")) return "parttime"; if (name.includes("câu lạc bộ")) return "club"; if (name.includes("nhậu")) return "party"; if (name.includes("ngủ")) return "rest"; return "lecture";
    });
    const rollActId = actsPlayedIds[Math.floor(Math.random() * actsPlayedIds.length)] || "lecture";
    const actOutcomes = DAILY_OUTCOMES[rollActId];
    const roll = Math.random();

    let isCritical: "success" | "disaster" | "none" = "none";
    let outcomeDetail: OutcomeDetail = { title: "Nhật Ký Ngày Bình Yên", text: "Bạn vừa kết thúc một ngày sinh viên cực kỳ bận rộn. Mệt nhoài nhưng thật xứng đáng vì đã quản lý thời gian khoa học!", statsImpact: {} };

    if (roll < 0.12 && actOutcomes) { isCritical = "success"; outcomeDetail = actOutcomes.criticalSuccess; gameAudio.playPositive(); }
    else if (roll < 0.24 && actOutcomes) { isCritical = "disaster"; outcomeDetail = actOutcomes.criticalDisaster; gameAudio.playNegative(); }
    else if (actOutcomes && actOutcomes.normalDays && actOutcomes.normalDays.length > 0) outcomeDetail = actOutcomes.normalDays[Math.floor(Math.random() * actOutcomes.normalDays.length)];

    let criticalImpact: Record<string, number> = {}; let ancestralDodged = false;
    if (isCritical !== "none") {
      const calc = calculateFinalImpact(rollActId, {}, outcomeDetail.statsImpact); criticalImpact = calc.finalImpact; ancestralDodged = calc.ancestralDodged || false;
      const postCriticalStats = { ...currentStats }; const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
      statKeys.forEach(k => { postCriticalStats[k] = updateStatWithLimits(postCriticalStats[k], criticalImpact[k] || 0); });
      setStats(postCriticalStats);
    }
    setDailyFeedback({ activityId: rollActId, activityName: completedSlotLog.map(l => l.activityName.split(": ")[1] || l.activityName).join(" ➔ "), isCritical, title: outcomeDetail.title, text: outcomeDetail.text, statsImpact: criticalImpact, ancestralDodged });
    if (matchingEvent) { setActiveEvent(matchingEvent); setPhase("EVENT"); } else setPhase("DAILY_FEEDBACK");
  };

  const handleSelectEventOption = (option: ChoiceOption) => {
    if (option.outcome.gpa >= 0 && option.outcome.happiness >= 0) gameAudio.playPositive(); else gameAudio.playNegative();
    setChoiceFeedback({ text: option.outcome.textFeedback, statsImpact: option.outcome.gpa !== undefined ? option.outcome : {} as any });
  };

  const handleConfirmFeedback = async () => {
    gameAudio.playTap(); if (!activeEvent) return;
    const eventImpact = choiceFeedback ? choiceFeedback.statsImpact : {};
    const { finalImpact, ancestralDodged } = calculateFinalImpact("event", {}, eventImpact);
    const daySummary = slotLog.map(l => l.activityName.split(": ")[1] || l.activityName).join(" ➔ ");

    const newLog: GameHistoryEntry = { day: currentDay, activityName: daySummary, eventTitle: ancestralDodged ? `[ĐÃ NÉ] ${activeEvent.title}` : activeEvent.title, choiceMade: choiceFeedback ? "Đã lướt qua" : undefined, statsImpact: finalImpact };
    setHistory([newLog, ...history]);
    const draftStats = { ...stats }; const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => { draftStats[k] = updateStatWithLimits(draftStats[k], finalImpact[k] || 0); });
    setStats(draftStats);

    const isGameOver = evaluateEndDayStats(draftStats, finalImpact);
    setActiveEvent(null); setChoiceFeedback(null); setSelectedActivity(null); setSlotLog([]); setCurrentSlot("morning");

    if (!isGameOver) {
      unlockAchievement("first_day");
      if (currentDay >= SEMESTER_DAYS) { unlockAchievement("survivor"); if (draftStats.stress <= 10) unlockAchievement("zen_master"); await handleEndSemester(); gameAudio.playPositive(); setPhase("SUMMARY"); }
      else { setCurrentDay(currentDay + 1); setCurrentWeather(WEATHERS[Math.floor(Math.random() * WEATHERS.length)]); setPhase("GAMEPLAY"); }
    }
  };

  const handleConfirmDailyFeedback = async () => {
    gameAudio.playTap(); if (!dailyFeedback) return;
    const finalImpact = dailyFeedback.statsImpact as Record<string, number>;
    const daySummary = slotLog.map(l => l.activityName.split(": ")[1] || l.activityName).join(" ➔ ");
    const displayActivityName = daySummary + (dailyFeedback.isCritical === "success" ? " (🔥 BẠO KÍCH)" : dailyFeedback.isCritical === "disaster" ? " (⚠️ ĐẠI NẠN)" : "");

    const newLog: GameHistoryEntry = { day: currentDay, activityName: displayActivityName, eventTitle: dailyFeedback.ancestralDodged ? "✨ Tổ Tiên Phù Hộ" : undefined, statsImpact: finalImpact };
    setHistory([newLog, ...history]);
    const isGameOver = evaluateEndDayStats(stats, finalImpact);
    setDailyFeedback(null); setSelectedActivity(null); setSlotLog([]); setCurrentSlot("morning");

    if (!isGameOver) {
      unlockAchievement("first_day");
      if (currentDay >= SEMESTER_DAYS) { unlockAchievement("survivor"); if (stats.stress <= 10) unlockAchievement("zen_master"); await handleEndSemester(); gameAudio.playPositive(); setPhase("SUMMARY"); }
      else { setCurrentDay(currentDay + 1); setCurrentWeather(WEATHERS[Math.floor(Math.random() * WEATHERS.length)]); setPhase("GAMEPLAY"); }
    }
  };

  const getStudentBadge = () => {
    if (stats.gpa >= 90 && stats.stress >= 75) return { title: "🏆 THỦ KHOA GANH TẠ", description: "Lưng còng rạp vì gánh tạ bài tập nhóm của đồng bọn, tóc rụng xơ xác nhưng bảng điểm sáng lòa!", color: "bg-amber-500/10 border-amber-500/30 text-amber-400" };
    if (stats.gpa >= 80 && stats.stress <= 30 && stats.happiness >= 75) return { title: "✨ CAO NHÂN ĐẮC ĐẠO", description: "Vừa học siêu phàm vừa thong dong thảnh thơi, tâm lý bất biến giữa muôn vàn áp lực bài vở.", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" };
    if (stats.gpa < 60 && stats.happiness >= 80) return { title: "💃 CHIẾN THẦN ĐU ĐƯA", description: "Điểm số vừa đủ qua môn, không cuộc vui nào vắng mặt. Tốt nghiệp bằng Đời loại Xuất sắc!", color: "bg-pink-500/10 border-pink-500/30 text-pink-400" };
    if (stats.money >= 80 && stats.gpa < 75) return { title: "💰 PHÚ HỘ GIẢNG ĐƯỜNG", description: "Tiền đè chết người nhờ siêng làm thêm ca bục mặt, ví dày cộm nhưng lên lớp toàn ngủ gật.", color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400" };
    if (stats.money <= 20 && stats.gpa >= 75) return { title: "🍜 CHIẾN BINH MÌ TÔM", description: "Sinh tồn mãnh liệt bằng mì Hảo Hảo úp giấy tập qua ngày. GPA cao ngất ngưởng nhưng gầy rộc.", color: "bg-sky-500/10 border-sky-500/30 text-sky-400" };
    return { title: "🎓 SINH VIÊN MẪU MỰC", description: "Một sinh viên bình thường, sống sót an toàn qua mùa thi không quá nổi bật hay tai tiếng.", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" };
  };

  const handleRestart = () => {
    gameAudio.playSelect(); setStats({ gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 });
    setCurrentDay(1); setSelectedActivity(null); setActiveEvent(null); setChoiceFeedback(null); setHistory([]); setCurrentSlot("morning"); setSlotLog([]); setCurrentWeather(null); setPhase("START");
  };

  const dowInfo = getDayOfWeek(currentDay);
  const slotSchedule = getSlotSchedule(currentDay, currentSlot);
  const badge = getStudentBadge();

  return (
    <div className="min-h-screen text-stone-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col justify-between relative overflow-hidden">
      
      {/* Dynamic Sky Background Component */}
      <SkyBackground slot={currentSlot} phase={phase} />

      {/* Global Notice Toast */}
      <AnimatePresence>
        {unlockedNotice && (
          <motion.div initial={{ opacity: 0, y: -50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }} className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-black/70 border border-amber-500/50 text-amber-300 font-bold text-xs shadow-2xl flex items-center gap-2.5 backdrop-blur-xl">
            <Award className="h-5 w-5 text-amber-400 animate-bounce shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-400 block uppercase tracking-widest font-extrabold">ĐÃ MỞ KHÓA THÀNH TỰU!</span>
              <p className="text-stone-100 font-display text-sm leading-tight">{unlockedNotice}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-white/10 bg-black/40 backdrop-blur-2xl sticky top-0 z-35 py-3 px-4 md:px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none cursor-pointer" onClick={() => phase !== "AUTH" ? setPhase("START") : null}>
            <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center text-black font-extrabold drop-shadow-md">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
              Freshman Survival
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && phase !== "AUTH" && (
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
                <span className="text-lg">{currentUser.avatar}</span>
                <span className="text-xs font-bold text-stone-200 hidden md:block">{currentUser.studentId}</span>
                <button onClick={() => { setCurrentUser(null); setPhase("AUTH"); }} className="ml-2 text-rose-400 hover:text-rose-300 transition-colors">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
            {phase === "GAMEPLAY" && (
              <button onClick={() => { gameAudio.playTap(); setShowHistoryModal(true); }} className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 transition-all text-xs font-bold text-stone-200 flex items-center gap-1.5 cursor-pointer select-none">
                <FileText className="h-3.5 w-3.5" />
                <span>Nhật ký ({history.length})</span>
              </button>
            )}
            {/* Nút Bảng xếp hạng hiển thị khi đã đăng nhập */}
            {currentUser && phase !== "AUTH" && phase !== "LEADERBOARD" && (
              <button 
                onClick={() => { 
                  gameAudio.playTap(); 
                  setPrevPhase(phase); // Lưu lại màn hình hiện tại đang chơi
                  setPhase("LEADERBOARD"); 
                }} 
                className="px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 transition-all text-xs font-bold text-amber-400 flex items-center gap-1.5 cursor-pointer select-none"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Xếp hạng</span>
              </button>
            )}
            <button onClick={() => { setSoundEnabled(!soundEnabled); gameAudio.playTap(); }} className="p-2 rounded-xl bg-black/40 backdrop-blur-md hover:bg-black/60 border border-white/10 text-stone-300 hover:text-stone-100 transition-all active:scale-90 cursor-pointer" title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}>
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col justify-center relative z-10">
        <motion.div animate={isVibrating ? { x: [-6, 6, -6, 6, -3, 3, 0], y: [-2, 2, -2, 2, 0, 0, 0] } : {}} transition={{ duration: 0.4 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SIDEBAR */}
          {phase !== "START" && phase !== "INTRO" && phase !== "AUTH" && phase !== "LEADERBOARD" && (
            <aside className="lg:col-span-4 space-y-5">
              {/* KHỐI KÍNH MỜ ĐEN SANG TRỌNG */}
              <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-xl shadow-inner shrink-0">{currentUser?.avatar || "🧑‍🎓"}</div>
                  <div className="overflow-hidden">
                    <h3 className="font-display font-black text-sm truncate text-stone-100 uppercase tracking-wide drop-shadow-md">{playerName}</h3>
                    <p className="text-[11px] text-zinc-300 font-extrabold uppercase tracking-widest mt-1">{major === "IT" ? "💻 CNTT" : major === "BIZ" ? "📊 QTKD" : "🇬🇧 Anh Văn"}</p>
                  </div>
                </div>
                <div className="space-y-4 border-t border-white/10 pt-4">
                  <RPGStatusBar label="gpa" value={stats.gpa} colorClass="from-amber-500 to-yellow-400" icon={<GraduationCap className="h-4.5 w-4.5 text-amber-400" />} title="GPA HỌC LỰC" displayValue={formatGPAScore(stats.gpa)} />
                  <RPGStatusBar label="stress" value={stats.stress} colorClass="from-rose-600 to-red-500" icon={<AlertTriangle className="h-4.5 w-4.5 text-rose-400" />} title="STRESS ÁP LỰC" displayValue={`${stats.stress}%`} pulse={stats.stress >= 80} />
                  <RPGStatusBar label="energy" value={stats.energy} colorClass="from-emerald-500 to-green-400" icon={<Battery className="h-4.5 w-4.5 text-emerald-400" />} title="NĂNG LƯỢNG" displayValue={`${stats.energy}%`} pulse={stats.energy <= 20} />
                  <RPGStatusBar label="money" value={stats.money} colorClass="from-yellow-500 to-amber-400" icon={<Coins className="h-4.5 w-4.5 text-yellow-400" />} title="TIỀN BẠC VNĐ" displayValue={`${stats.money} VNĐ`} pulse={stats.money <= 15} />
                  <RPGStatusBar label="happiness" value={stats.happiness} colorClass="from-cyan-500 to-blue-400" icon={<Smile className="h-4.5 w-4.5 text-cyan-400" />} title="NIỀM VUI VẺ" displayValue={`${stats.happiness}%`} />
                </div>
              </div>
              
              <CharacterAvatar stats={stats} major={major} />
              
              {currentWeather && (
                <div className={`p-5 rounded-2xl border backdrop-blur-2xl shadow-lg ${currentWeather.color} transition-all duration-300`}>
                  <div className="flex items-center gap-2.5 mb-2.5"><span className="text-2xl shrink-0 drop-shadow-md">{currentWeather.icon}</span><h4 className="font-display font-black text-sm uppercase tracking-wider text-stone-100">{currentWeather.name}</h4></div>
                  <p className="text-xs md:text-sm text-stone-200 leading-relaxed font-bold font-sans drop-shadow-sm">{currentWeather.description}</p>
                </div>
              )}
              
              <div className="p-5 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4"><Award className="h-5 w-5 text-amber-500" /><h4 className="font-display font-black text-sm uppercase tracking-wider">Phòng Thành Tích ({unlockedAchievements.length}/6)</h4></div>
                <div className="grid grid-cols-7 gap-2">
                  {ACHIEVEMENTS.map(a => {
                    const isUnlocked = unlockedAchievements.includes(a.id);
                    return (
                      <div key={a.id} className={`relative h-11 rounded-xl flex items-center justify-center text-2xl border transition-all group ${isUnlocked ? "bg-amber-500/20 border-amber-500/50 text-amber-400 cursor-help shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-black/40 border-white/5 text-zinc-600 opacity-60"}`} title={`${a.title}: ${a.description}`}>
                        <span>{a.icon}</span>
                        <div className="absolute bottom-13 left-1/2 -translate-x-1/2 z-50 w-52 p-3 rounded-xl bg-black/90 backdrop-blur-2xl border border-zinc-700 text-xs text-stone-200 leading-snug hidden group-hover:block shadow-2xl pointer-events-none">
                          <p className="font-black text-stone-50 mb-1">{a.title}</p><p className="font-semibold text-zinc-400 mb-1.5">{a.description}</p><span className="text-[10px] bg-white/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-black">ĐK: {a.requirement}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          <div className={`${phase === "START" || phase === "INTRO" || phase === "AUTH" || phase === "LEADERBOARD" ? "lg:col-span-12" : "lg:col-span-8"} w-full`}>
            <AnimatePresence mode="wait">

              {/* MÀN HÌNH ĐĂNG NHẬP / ĐĂNG KÝ (AUTH) */}
              {phase === "AUTH" && (
                <motion.div key="auth" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="max-w-md mx-auto w-full p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500" />
                  
                  <div className="text-center space-y-2 mb-2">
                    <h2 className="text-2xl md:text-3xl font-display font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-zinc-400 drop-shadow-sm">
                      Game Sinh Tồn Sinh Viên Năm Nhất
                    </h2>
                    <p className="text-sm text-zinc-300 font-medium">
                      {authMode === "login" 
                        ? "Đăng nhập tài khoản Game Freshman Survival" 
                        : "Đăng ký tài khoản Game Freshman Survival"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                      <input type="text" placeholder="Tên đăng nhập" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none transition-all text-white placeholder-zinc-500" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                      <input type="password" placeholder="Mật khẩu" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none transition-all text-white placeholder-zinc-500" />
                    </div>

                    {authMode === "register" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                        <div className="relative">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <input type="text" placeholder="Họ và Tên (VD: Nguyễn Văn A)" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none text-white placeholder-zinc-500" />
                        </div>
                        <div className="relative">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                          <input type="text" placeholder="Mã Số Sinh Viên (VD: DE210164)" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none uppercase text-white placeholder-zinc-500" />
                        </div>
                        <div className="pt-2">
                          <label className="text-xs font-black text-zinc-300 uppercase tracking-widest block mb-2 drop-shadow-sm">Chọn Avatar:</label>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {AVATARS.map(ava => (
                              <button key={ava} onClick={() => setFormData({...formData, avatar: ava})} className={`text-2xl p-2 rounded-xl border transition-all ${formData.avatar === ava ? "bg-amber-500/20 border-amber-500 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "bg-black/40 border-white/10 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"}`}>{ava}</button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <button disabled={isLoading} onClick={authMode === "login" ? handleLogin : handleRegister} className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all active:scale-95 disabled:opacity-50">
                      {isLoading ? "Đang xử lý DB..." : authMode === "login" ? "Đăng Nhập" : "Đăng Ký"}
                    </button>
                    <p className="text-center text-xs font-medium text-zinc-300 cursor-pointer hover:text-amber-400 drop-shadow-sm" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
                      {authMode === "login" ? "Chưa có tài khoản? Đăng ký ngay!" : "Đã có tài khoản? Đăng nhập"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* BẢNG XẾP HẠNG (LEADERBOARD) */}
              {phase === "LEADERBOARD" && (
                <motion.div key="leaderboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto w-full p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-6">
                  <div className="text-center space-y-2">
                    <Trophy className="h-12 w-12 text-amber-500 mx-auto animate-bounce drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                    <h2 className="text-3xl font-display font-black uppercase tracking-widest text-stone-100 drop-shadow-md">Đại Lộ Danh Vọng</h2>
                    <p className="text-sm text-zinc-300">Top sinh viên có thành tích xuất sắc nhất sau 14 ngày</p>
                  </div>

                  <div className="space-y-3 mt-6">
                    {leaderboard.length === 0 ? (
                      <p className="text-center text-zinc-400 py-10">Chưa có ai hoàn thành học kỳ. Hãy là người đầu tiên!</p>
                    ) : (
                      leaderboard.slice(0, 10).map((entry, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-2xl border backdrop-blur-md ${index === 0 ? 'bg-amber-500/20 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]' : index === 1 ? 'bg-zinc-300/20 border-zinc-300/50' : index === 2 ? 'bg-orange-700/20 border-orange-700/50' : 'bg-black/40 border-white/10'}`}>
                          <div className="flex items-center gap-4">
                            <div className={`text-xl font-black ${index === 0 ? 'text-amber-400 drop-shadow-sm' : index === 1 ? 'text-zinc-200' : index === 2 ? 'text-orange-500' : 'text-zinc-400'}`}>#{index + 1}</div>
                            <span className="text-3xl drop-shadow-md">{entry.avatar}</span>
                            <div>
                              <p className="font-bold text-stone-100 drop-shadow-sm">{entry.full_name}</p>
                              <p className="text-[11px] text-zinc-400 font-mono uppercase">{entry.student_id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">{entry.score}</p>
                            <p className="text-[10px] text-zinc-300 font-bold uppercase">Điểm tổng hợp</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button onClick={() => setPhase(prevPhase)} className="w-full mt-6 py-4 rounded-xl bg-black/60 hover:bg-black/80 border border-white/10 text-stone-200 font-black text-sm uppercase transition-all cursor-pointer backdrop-blur-md">
                    Quay lại
                  </button>
                </motion.div>
              )}

              {/* PHASE 1: START WELCOME SCREEN */}
              {phase === "START" && (
                <motion.div key="start" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-xl mx-auto p-10 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl text-center space-y-7">
                  <div className="relative inline-block mx-auto">
                    <span className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl animate-pulse"></span>
                    <div className="h-24 w-24 rounded-2xl bg-black/60 border border-amber-500/40 flex items-center justify-center shadow-xl ring-1 ring-amber-500/20 backdrop-blur-md">
                      <GraduationCap className="h-12 w-12 text-amber-400 stroke-[1.2] drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-widest bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500 bg-clip-text text-transparent uppercase drop-shadow-sm">Freshman Survival</h1>
                    <p className="text-stone-200 text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-sans font-medium drop-shadow-sm">Xin chào, {currentUser?.fullName}! Sẵn sàng nhập học kỳ đại học năm nhất dành cho cả PC & Thiết bị di động chưa?</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 text-left max-w-sm mx-auto backdrop-blur-md shadow-inner">
                    <p className="text-xs font-black text-amber-400 uppercase mb-2 tracking-widest flex items-center gap-1.5"><Award className="h-4 w-4 text-amber-500" /> Thành tựu đã mở khóa:</p>
                    <p className="text-sm text-stone-100 font-sans font-medium leading-relaxed">Bạn đã chinh phục <span className="text-amber-400 font-black drop-shadow-sm">{unlockedAchievements.length} / 6</span> cúp danh vọng. Hãy bắt đầu ca chơi mới để sưu tầm trọn bộ!</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button onClick={handleStartGame} className="w-full py-4.5 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest">
                      Bắt đầu nhập học
                    </button>
                    <button onClick={() => { setPrevPhase(phase); setPhase("LEADERBOARD"); }} className="w-full py-4.5 rounded-xl bg-black/60 backdrop-blur-md hover:bg-black/80 border border-white/10 text-amber-400 font-black text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto flex items-center justify-center gap-2 uppercase tracking-widest">
                      <Trophy className="h-4 w-4" /> Bảng xếp hạng
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PHASE 2: CHARACTER CREATION (INTRO) */}
              {phase === "INTRO" && (
                <motion.div key="intro" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-4xl mx-auto p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-7">
                  <div className="text-center space-y-1.5 border-b border-white/10 pb-5">
                    <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest font-mono drop-shadow-sm">HỒ SƠ TÂN SINH VIÊN</span>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-stone-100 uppercase tracking-wider drop-shadow-md">Thiết Lập Nhân Vật</h2>
                    <p className="text-xs md:text-sm text-stone-300 font-sans">Hãy xác nhận tên và chọn chuyên ngành của bạn để bắt đầu học kỳ năm nhất đầy bão táp!</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <label className="text-xs font-black text-zinc-300 uppercase tracking-widest block drop-shadow-sm">Tên sinh viên:</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-zinc-400"><User className="h-5 w-5" /></span>
                        <input type="text" maxLength={24} value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-sm font-black text-stone-100 focus:outline-none focus:border-amber-500/85 transition-all shadow-inner" placeholder="Tên của bạn..." />
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <label className="text-xs font-black text-zinc-300 uppercase tracking-widest block drop-shadow-sm">Chuyên ngành đại học:</label>
                      <div className="space-y-2.5">
                        {[
                          { id: "IT", name: "Công Nghệ Thông Tin", desc: "GPA cao, mệt & Stress nhiều hơn.", icon: <Zap className="h-5 w-5" /> },
                          { id: "BIZ", name: "Quản Trị Kinh Doanh", desc: "Tài chính rủng rỉnh, giao thiệp rộng.", icon: <Coins className="h-5 w-5" /> },
                          { id: "LANG", name: "Ngôn Ngữ Anh", desc: "Thư giãn, thảnh thơi, nhiều niềm vui.", icon: <Smile className="h-5 w-5" /> }
                        ].map(m => (
                          <button key={m.id} onClick={() => handleSelectMajor(m.id as any)} className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between backdrop-blur-md ${major === m.id ? "bg-amber-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]" : "bg-black/40 border-white/10 hover:bg-black/60"}`}>
                            <div className="flex items-center gap-3.5">
                              <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-neutral-900 shadow-inner ${major === m.id ? "bg-amber-400" : "bg-zinc-700 text-zinc-300"}`}>{m.icon}</div>
                              <div><p className="text-sm font-black text-stone-100 drop-shadow-sm">{m.name}</p><p className="text-[11px] text-zinc-300 font-bold mt-0.5">{m.desc}</p></div>
                            </div>
                            {major === m.id && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 drop-shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-white/10 flex justify-end">
                    <button onClick={handleConfirmOnboarding} className="w-full md:w-auto px-10 py-4.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-widest">
                      Xác Nhận Hồ Sơ & Nhập Học <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PHASE 3: GAMEPLAY LOOP SCHEDULER */}
              {phase === "GAMEPLAY" && (
                <motion.div key="gameplay" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                  {/* PANEL LỚN NHẤT */}
                  <div className="p-6 rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-3.5 gap-2">
                      <div>
                        <span className="text-xs font-black text-amber-400 uppercase tracking-widest font-mono drop-shadow-sm">Tuần {dowInfo.week} — {dowInfo.label}</span>
                        <h2 className="text-2xl font-display font-black text-stone-100 mt-1 drop-shadow-md">Hành Trình Ngày {currentDay} / {SEMESTER_DAYS}</h2>
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-inner">
                        {["morning", "afternoon", "evening"].map(s => {
                          const isActive = currentSlot === s;
                          const isDone = (s === "morning" && currentSlot !== "morning") || (s === "afternoon" && currentSlot === "evening");
                          return <span key={s} className={`h-3 w-3 rounded-full transition-all ${isActive ? "bg-amber-400 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.8)]" : isDone ? "bg-zinc-500" : "bg-black/60 border border-white/20"}`} title={s === "morning" ? "Buổi Sáng" : s === "afternoon" ? "Buổi Chiều" : "Buổi Tối"} />
                        })}
                        <span className="text-[11px] text-zinc-300 font-black uppercase font-mono pl-1.5">{currentSlot === "morning" ? "Sáng" : currentSlot === "afternoon" ? "Chiều" : "Tối"}</span>
                      </div>
                    </div>
                    
                    {/* WIDGET THỜI GIAN */}
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-4 shadow-inner">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-black text-lg shrink-0 shadow-md ${slotSchedule.type === "class" ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-white/10 text-stone-200 border border-white/20"}`}>
                        {slotSchedule.type === "class" ? "📚" : "🍃"}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-stone-100 drop-shadow-sm">{slotSchedule.label}</h4>
                        <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-bold font-sans">{slotSchedule.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-zinc-300 uppercase tracking-widest block drop-shadow-sm">Chọn hành động thực hiện:</label>
                        <span className="text-xs font-mono font-black text-zinc-400 uppercase">Click để chọn</span>
                      </div>
                      {slotSchedule.type === "class" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          <motion.button whileHover={{ scale: 1.01, borderColor: "rgba(245, 158, 11, 0.5)" }} whileTap={{ scale: 0.98 }} onClick={() => handlePerformSlotActivity("lecture", "Học Chính Khóa", { gpa: 7, stress: 8, energy: -12, money: 0, happiness: -2 })} className="text-left p-5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all cursor-pointer flex flex-col justify-between group min-h-40 md:h-44 shadow-lg">
                            <div className="flex items-center gap-3"><div className="h-11 w-11 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner"><GraduationCap className="h-6 w-6 drop-shadow-sm" /></div><div><h5 className="text-sm font-black text-stone-100 uppercase tracking-wide drop-shadow-sm">Lên Lớp Học</h5><span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 uppercase font-mono font-black mt-1 inline-block shadow-sm">Bắt buộc</span></div></div>
                            <div className="flex flex-wrap gap-1.5 mt-4"><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shadow-sm">+7 GPA</span><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 shadow-sm">-12 PIN</span><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-red-500/20 text-rose-300 shadow-sm">+8 ÁP LỰC</span></div>
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.01, borderColor: "rgba(244, 63, 94, 0.5)" }} whileTap={{ scale: 0.98 }} onClick={() => handlePerformSlotActivity("parttime", "Làm Thêm (Cúp học)", { gpa: -12, stress: 10, energy: -12, money: 15, happiness: -3 }, true)} className="text-left p-5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all cursor-pointer flex flex-col justify-between group min-h-40 md:h-44 shadow-lg">
                            <div className="flex items-center gap-3"><div className="h-11 w-11 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner"><Coins className="h-6 w-6 drop-shadow-sm" /></div><div><h5 className="text-sm font-black text-stone-100 uppercase tracking-wide drop-shadow-sm">Cúp Làm Thêm</h5><span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 uppercase font-mono font-black mt-1 inline-block shadow-sm">Cúp học</span></div></div>
                            <div className="flex flex-wrap gap-1.5 mt-4"><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shadow-sm">+15 VNĐ</span><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 shadow-sm">-12 GPA</span><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 shadow-sm">-12 PIN</span></div>
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.01, borderColor: "rgba(129, 140, 248, 0.5)" }} whileTap={{ scale: 0.98 }} onClick={() => handlePerformSlotActivity("rest", "Ngủ Nướng (Cúp học)", { gpa: -15, stress: -10, energy: 20, money: 0, happiness: 8 }, true)} className="text-left p-5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 backdrop-blur-md transition-all cursor-pointer flex flex-col justify-between group min-h-40 md:h-44 shadow-lg">
                            <div className="flex items-center gap-3"><div className="h-11 w-11 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0 shadow-inner"><Moon className="h-6 w-6 drop-shadow-sm" /></div><div><h5 className="text-sm font-black text-stone-100 uppercase tracking-wide drop-shadow-sm">Cúp Ngủ Nướng</h5><span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 uppercase font-mono font-black mt-1 inline-block shadow-sm">Cúp học</span></div></div>
                            <div className="flex flex-wrap gap-1.5 mt-4"><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shadow-sm">+20 PIN</span><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shadow-sm">+8 VUI</span><span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 shadow-sm">-15 GPA</span></div>
                          </motion.button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { id: "library", name: "Thư Viện", base: { gpa: 10, stress: 12, energy: -14, money: 0, happiness: -4 }, icon: <BookOpen className="h-6 w-6" />, col: "text-teal-400", border: "hover:border-teal-500/50", bg: "hover:bg-black/60", plus: "+10 GPA", minus: "-14 PIN" },
                            { id: "parttime", name: "Làm Thêm", base: { gpa: -2, stress: 14, energy: -18, money: 20, happiness: -5 }, icon: <Coins className="h-6 w-6" />, col: "text-amber-400", border: "hover:border-amber-500/50", bg: "hover:bg-black/60", plus: "+20 VNĐ", minus: "-18 PIN" },
                            { id: "club", name: "Câu Lạc Bộ", base: { gpa: 0, stress: -6, energy: -8, money: -3, happiness: 12 }, icon: <Users className="h-6 w-6" />, col: "text-pink-400", border: "hover:border-pink-500/50", bg: "hover:bg-black/60", plus: "+12 VUI", minus: "-6 ÁP LỰC" },
                            { id: "rest", name: "Nghỉ Ngơi", base: { gpa: 0, stress: -10, energy: 18, money: 0, happiness: 6 }, icon: <Moon className="h-6 w-6" />, col: "text-indigo-400", border: "hover:border-indigo-500/50", bg: "hover:bg-black/60", plus: "+18 PIN", minus: "-10 ÁP LỰC" },
                            { id: "party", name: "Nhậu Nhẹt", base: { gpa: -2, stress: -12, energy: -6, money: -8, happiness: 15 }, icon: <CupSoda className="h-6 w-6" />, col: "text-rose-400", border: "hover:border-rose-500/50", bg: "hover:bg-black/60", plus: "+15 VUI", minus: "-12 ÁP LỰC" }
                          ].map(act => (
                            <motion.button key={act.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handlePerformSlotActivity(act.id, act.name, act.base)} className={`text-center p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md ${act.border} ${act.bg} transition-all cursor-pointer flex flex-col items-center justify-between min-h-[170px] md:h-48 group shadow-lg`}>
                              <div className={`h-12 w-12 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center text-lg ${act.col} group-hover:scale-105 transition-transform shrink-0 shadow-inner`}>{act.icon}</div>
                              <h5 className="text-xs md:text-sm font-black text-stone-100 uppercase tracking-wide mt-2 drop-shadow-sm">{act.name}</h5>
                              <div className="w-full flex flex-col gap-1 mt-3">
                                <span className="text-[11px] font-mono font-black py-0.5 rounded bg-emerald-500/20 text-emerald-400 block w-full text-center shadow-sm">{act.plus}</span>
                                <span className="text-[11px] font-mono font-black py-0.5 rounded bg-rose-500/20 text-rose-400 block w-full text-center shadow-sm">{act.minus}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {showIntroTutorial && (
                    <div className="p-4.5 bg-black/50 border border-amber-500/40 rounded-2xl relative text-xs md:text-sm text-amber-200 leading-relaxed font-sans flex items-start gap-2.5 animate-pulse backdrop-blur-xl shadow-lg">
                      <Info className="h-5 w-5 shrink-0 text-amber-400 mt-0.5 drop-shadow-md" /><div className="flex-1"><span className="font-black text-stone-100 block mb-1 text-xs md:text-sm drop-shadow-sm">Mẹo Sinh Tồn:</span>Hãy đảm bảo pin (Energy) của bạn luôn trên 20% và Stress dưới 80%. Hãy ngủ nướng nếu thấy pin cạn kiệt, và đi nhậu hoặc CLB để xả bớt Stress khi áp lực thi cử quá tải!</div><button onClick={() => setShowIntroTutorial(false)} className="text-zinc-300 hover:text-white shrink-0 cursor-pointer text-xs font-bold px-1.5">✕</button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* CÁC PHASE CÒN LẠI ĐƯỢC ÁP DỤNG GLASSMORPHISM TƯƠNG TỰ */}
              {phase === "DAILY_FEEDBACK" && dailyFeedback && (
                <motion.div key="daily_feedback" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-xl mx-auto p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl text-center space-y-6">
                  <div className="flex justify-center">
                    {dailyFeedback.isCritical === "success" && <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black uppercase tracking-widest shadow-sm">🔥 BẠO KÍCH CỰC ĐỈNH</span>}
                    {dailyFeedback.isCritical === "disaster" && <span className="px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-rose-400 text-xs font-black uppercase tracking-widest shadow-sm">⚠️ ĐẠI NẠN KHÓ ĐỠ</span>}
                    {dailyFeedback.isCritical === "none" && <span className="px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-stone-200 text-xs font-black uppercase tracking-widest shadow-sm">📝 NHẬT KÝ CUỐI NGÀY</span>}
                  </div>
                  <div className="space-y-1.5"><span className="text-[11px] font-mono text-zinc-300 uppercase font-black tracking-widest block drop-shadow-sm">Chuỗi hoạt động: {dailyFeedback.activityName}</span><h3 className="text-xl md:text-2xl font-display font-black text-stone-100 leading-snug drop-shadow-md">{dailyFeedback.title}</h3></div>
                  <p className="text-sm text-stone-100 font-sans leading-relaxed text-left max-w-md mx-auto p-5 rounded-2xl bg-black/60 border border-white/10 shadow-inner font-bold">{dailyFeedback.text}</p>
                  {Object.keys(dailyFeedback.statsImpact).length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2.5 text-xs font-black font-mono">
                      {Object.entries(dailyFeedback.statsImpact).map(([k, v]) => {
                        const numV = v as number; if (numV === 0) return null; const isPos = numV > 0;
                        return <span key={k} className={`px-3 py-1.5 rounded-lg ${isPos ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"} shadow-sm`}>{k.toUpperCase()}: {isPos ? `+${numV}` : numV}</span>;
                      })}
                    </div>
                  )}
                  {dailyFeedback.ancestralDodged && <div className="text-xs font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mx-auto shadow-sm">🕉️ Tổ tiên hiển linh phù hộ: Triệt tiêu mọi thiệt hại chỉ số xấu!</div>}
                  <button onClick={handleConfirmDailyFeedback} className="w-full max-w-xs py-4 px-6 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest">Đồng ý gác ngày cũ</button>
                </motion.div>
              )}

              {phase === "EVENT" && activeEvent && (
                <motion.div key="event" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-xl mx-auto p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-7">
                  <div className="text-center space-y-2 border-b border-white/10 pb-4"><span className="text-xs font-black text-indigo-300 bg-indigo-500/20 border border-indigo-500/40 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block shadow-sm">⚠️ BIẾN CỐ PHÁT SINH</span><h3 className="text-xl md:text-2xl font-display font-black text-stone-100 leading-snug pt-1 drop-shadow-md">{activeEvent.title}</h3></div>
                  <p className="text-sm text-stone-100 font-sans font-bold leading-relaxed p-5 rounded-2xl bg-black/40 border border-white/10 text-left shadow-inner">{activeEvent.description}</p>
                  <div className="space-y-3">
                    {activeEvent.options.map(opt => {
                      const isSelected = choiceFeedback?.text === opt.outcome.textFeedback;
                      return (
                        <button key={opt.id} disabled={choiceFeedback !== null} onClick={() => handleSelectEventOption(opt)} className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer block ${isSelected ? "bg-amber-500/20 border-amber-500/50 text-amber-200 shadow-md" : choiceFeedback !== null ? "bg-black/60 border-white/5 opacity-50 cursor-not-allowed" : "bg-black/40 border-white/10 hover:bg-black/60 shadow-md"}`}>
                          <div className="flex items-center justify-between gap-1"><span className="text-sm md:text-base font-black leading-snug">{opt.text}</span>{isSelected && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 ml-2 drop-shadow-md" />}</div>
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {choiceFeedback && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-black/60 border border-white/10 text-left space-y-4 shadow-inner">
                        <p className="text-xs md:text-sm font-bold text-stone-100 leading-relaxed font-sans">{choiceFeedback.text}</p>
                        <div className="flex flex-wrap gap-2 text-[11px] font-mono font-black">
                          {Object.entries(choiceFeedback.statsImpact).map(([k, v]) => {
                            const numV = v as number; if (numV === 0) return null; const isP = numV > 0;
                            return <span key={k} className={`px-2.5 py-1 rounded-lg ${isP ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"} shadow-sm`}>{k.toUpperCase()}: {isP ? `+${numV}` : numV}</span>;
                          })}
                        </div>
                        <button onClick={handleConfirmFeedback} className="w-full py-4.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs md:text-sm shadow-lg cursor-pointer block text-center uppercase tracking-widest active:scale-95 transition-all">Tiếp tục hành trình</button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {phase === "SUMMARY" && (
                <motion.div key="summary" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-8 md:p-10 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-7 text-center">
                  <div className="relative inline-block"><span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-pulse"></span><div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-5xl shadow-lg backdrop-blur-md">🎉</div></div>
                  <div className="space-y-2"><h2 className="text-3xl font-display font-black text-stone-100 uppercase tracking-widest drop-shadow-md">Hoàn Thành Học Kỳ!</h2><p className="text-sm font-bold text-stone-200 max-w-sm mx-auto leading-relaxed drop-shadow-sm">Chúc mừng bạn đã sinh tồn xuất sắc qua 14 ngày đầy bão tố! Kết quả đã lưu vào CSDL.</p></div>
                  <div className={`p-6 rounded-2xl border backdrop-blur-md ${badge.color.replace('bg-','bg-black/60 ')} text-left space-y-2.5 max-w-md mx-auto shadow-lg`}><span className="text-[11px] font-black uppercase tracking-widest block opacity-75 drop-shadow-sm">BẰNG CHỨNG NHẬN ĐẠI HỌC</span><h4 className="text-base md:text-lg font-display font-black tracking-wide leading-tight drop-shadow-md">{badge.title}</h4><p className="text-xs md:text-sm text-stone-100 leading-relaxed font-sans font-bold">{badge.description}</p></div>
                  
                  <div className="p-6 rounded-2xl bg-black/40 border border-indigo-500/40 max-w-md mx-auto backdrop-blur-md shadow-lg">
                    <span className="text-xs text-indigo-300 font-black uppercase tracking-widest block mb-2 drop-shadow-sm">ĐIỂM XẾP HẠNG CỦA BẠN</span>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-lg">
                      {calculateFinalScore()} <span className="text-lg text-zinc-400">/ 100</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                    <button onClick={() => { setPrevPhase(phase); setPhase("LEADERBOARD"); }} className="w-full py-4.5 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-102 active:scale-95 transition-all cursor-pointer uppercase tracking-widest">
                      Bảng Xếp Hạng
                    </button>
                    <button onClick={handleRestart} className="w-full py-4.5 rounded-xl bg-black/60 border border-white/10 text-stone-200 font-black text-sm shadow-lg hover:scale-102 active:scale-95 transition-all cursor-pointer uppercase tracking-widest backdrop-blur-md">
                      Chơi Lại
                    </button>
                  </div>
                </motion.div>
              )}

              {phase === "GAMEOVER" && (
                <motion.div key="gameover" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-xl mx-auto p-8 rounded-3xl bg-black/50 backdrop-blur-2xl border border-white/10 shadow-2xl space-y-7 text-center animate-pulse">
                  <div className="relative inline-block"><span className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl"></span><div className="h-20 w-20 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-5xl animate-bounce shadow-lg backdrop-blur-md">💀</div></div>
                  <div className="space-y-2"><h2 className="text-3xl font-display font-black text-rose-500 uppercase tracking-widest drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">Kỳ Thi Thất Bại!</h2><p className="text-sm font-bold text-stone-300 drop-shadow-sm">Năm nhất đại học quả là một đấu trường đầy chông gai...</p></div>
                  <div className="p-6 rounded-2xl bg-black/60 backdrop-blur-md border border-rose-500/40 text-left space-y-2.5 max-w-md mx-auto shadow-lg"><span className="text-[11px] font-black text-rose-400 uppercase tracking-widest block opacity-75 drop-shadow-sm">NGUYÊN NHÂN BI KỊCH</span><p className="text-sm text-stone-100 font-sans leading-relaxed font-bold">{deathCause}</p></div>
                  <button onClick={handleRestart} className="w-full max-w-xs py-4.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-sm shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest">
                    <div className="flex items-center justify-center gap-2"><RotateCcw className="h-5 w-5" /><span>Thử ca chơi khác</span></div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-white/10 bg-black/20 py-6 px-4 text-center text-xs text-zinc-400 font-mono select-none relative z-10 backdrop-blur-md">
        <p>© 2026 Freshman Survival Applet — Designed Minimalist & Bento Styled</p>
      </footer>

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <>
            <motion.div key="modal_backdrop" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} onClick={() => setShowHistoryModal(false)} className="fixed inset-0 bg-black/60 z-[90] backdrop-blur-md" />
            <motion.div key="modal_panel" initial={{ opacity: 0, y: 30, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className="fixed inset-x-4 top-10 bottom-10 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[520px] md:h-[620px] bg-black/70 backdrop-blur-3xl border border-white/20 rounded-3xl z-[100] flex flex-col p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-amber-500 drop-shadow-md" /><h4 className="font-display font-black text-sm uppercase tracking-wider text-stone-100 drop-shadow-md">Lịch Sử Sinh Tồn ({history.length} Ngày)</h4></div>
                <button onClick={() => setShowHistoryModal(false)} className="text-xs text-stone-200 hover:text-white bg-black/60 hover:bg-black/80 px-4 py-2 rounded-xl cursor-pointer transition font-bold border border-white/10 shadow-sm">Đóng</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scrollbar-none">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 py-12"><BookmarkCheck className="h-12 w-12 text-zinc-500 mb-3 stroke-[1.5]" /><p className="text-sm font-black text-zinc-300 drop-shadow-sm">Chưa có nhật ký ghi nhận.</p><p className="text-xs text-zinc-400 mt-1">Hoàn tất ngày chơi đầu tiên để tạo tệp lưu trữ.</p></div>
                ) : (
                  history.map((entry, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/10 text-left space-y-2 shadow-inner">
                      <div className="flex items-center justify-between text-xs font-mono"><span className="text-amber-400 font-black uppercase drop-shadow-sm">Ngày thứ {entry.day}</span>{entry.eventTitle && <span className="px-2.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase shadow-sm">Biến cố</span>}</div>
                      <p className="text-sm font-bold text-stone-100 drop-shadow-sm">{entry.activityName}</p>
                      {entry.eventTitle && <p className="text-xs text-zinc-300 mt-1 italic font-medium">Hành xử biến cố: {entry.eventTitle}</p>}
                      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-mono font-black">
                        {Object.entries(entry.statsImpact).map(([k, v]) => {
                          const numVal = v as number; if (numVal === 0) return null; const isPos = numVal > 0;
                          return <span key={k} className={`px-2 py-0.5 rounded ${isPos ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"} shadow-sm`}>{k.toUpperCase()}: {isPos ? `+${numVal}` : numVal}</span>;
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}