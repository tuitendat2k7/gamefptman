/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GraduationCap,
  Sparkles,
  Battery,
  Coins,
  Smile,
  Moon,
  CupSoda,
  BookOpen,
  Users,
  AlertTriangle,
  Play,
  Volume2,
  VolumeX,
  RotateCcw,
  FileText,
  Award,
  ArrowRight,
  ChevronRight,
  Info,
  User,
  Zap,
  BookmarkCheck,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  LayoutGrid
} from "lucide-react";

import { PlayerStats, GameEvent, ChoiceOption, DailyActivity, GamePhase, GameHistoryEntry } from "./types";
import { DAILY_ACTIVITIES, GAME_EVENTS } from "./data/situations";
import { DAILY_OUTCOMES, OutcomeDetail } from "./data/dailyOutcomes";
import { StatRing } from "./components/StatRing";
import { gameAudio } from "./components/AudioEngine";

interface WeatherType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

const WEATHERS: WeatherType[] = [
  {
    id: "normal",
    name: "Trời Ôn Hòa",
    icon: "🍃",
    description: "Mát mẻ, dễ chịu. Mọi hoạt động diễn ra bình thường.",
    color: "text-blue-400 bg-blue-500/5 border-blue-500/10"
  },
  {
    id: "hot",
    name: "Nắng Nóng (40°C)",
    icon: "☀️",
    description: "Đi học/Làm thêm tốn thêm pin (-4 Pin). Ngủ hồi phục tốt hơn (+6 Pin).",
    color: "text-amber-400 bg-amber-500/5 border-amber-500/10"
  },
  {
    id: "flood",
    name: "Mưa Lũ Ngập Đường",
    icon: "⛈️",
    description: "Đi học mệt mỏi (+5 Stress). Nghỉ học ở nhà ngủ nướng vui vẻ (+5 Vui).",
    color: "text-sky-400 bg-sky-500/5 border-sky-500/10"
  },
  {
    id: "exam_week",
    name: "Mùa Thi Căng Thẳng",
    icon: "📊",
    description: "Tự học ở thư viện tăng x1.5 hiệu quả GPA. Đi nhậu nhẹt bị phạt -5 GPA.",
    color: "text-purple-400 bg-purple-500/5 border-purple-500/10"
  },
  {
    id: "inflation",
    name: "Bão Giá Lạm Phát",
    icon: "💸",
    description: "Làm thêm lương cao hơn (+10đ). Đi chơi/Tụ tập tốn kém hơn (-5đ).",
    color: "text-red-400 bg-red-500/5 border-red-500/10"
  },
  {
    id: "slay_day",
    name: "Thứ Sáu Thảnh Thơi",
    icon: "🎉",
    description: "Đi chơi hoặc tham gia câu lạc bộ được giảm thêm 5 Stress, tăng 5 Vui.",
    color: "text-pink-400 bg-pink-500/5 border-pink-500/10"
  }
];

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_day",
    title: "Chào Tân Sinh Viên",
    description: "Sinh tồn thành công qua Ngày 1 đầy bỡ ngỡ.",
    icon: "🙋",
    requirement: "Vượt qua ngày 1"
  },
  {
    id: "gpa_god",
    title: "Thủ Khoa Đất Việt",
    description: "Đạt mốc điểm GPA tuyệt đối 100% (4.0/4.0).",
    icon: "🎓",
    requirement: "GPA đạt 100%"
  },
  {
    id: "skip_boss",
    title: "Chúa Tể Cúp Học",
    description: "Cúp học trốn lịch chính khóa từ 4 lần trở lên.",
    icon: "🤫",
    requirement: "Trốn học ≥ 4 lần"
  },
  {
    id: "rich_kid",
    title: "Triệu Phú Giảng Đường",
    description: "Tích lũy tài chính rực rỡ từ 95 VNĐ trở lên.",
    icon: "💰",
    requirement: "Tài sản ≥ 95 VNĐ"
  },
  {
    id: "zen_master",
    title: "Đắc Đạo Thảnh Thơi",
    description: "Hoàn thành học kỳ với mức độ Stress siêu thấp dưới 10%.",
    icon: "🧘",
    requirement: "Stress ≤ 10%"
  },
  {
    id: "survivor",
    title: "Kẻ Sống Sót Vĩ Đại",
    description: "Hoàn thành trọn vẹn 14 ngày của học kỳ giông bão.",
    icon: "🏆",
    requirement: "Sống sót học kỳ"
  }
];

interface RPGStatusBarProps {
  label: string;
  value: number;
  max?: number;
  colorClass: string;
  icon: React.ReactNode;
  title: string;
  displayValue: string;
  pulse?: boolean;
}

const RPGStatusBar: React.FC<RPGStatusBarProps> = ({
  label,
  value,
  max = 100,
  colorClass,
  icon,
  title,
  displayValue,
  pulse = false
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`space-y-1.5 ${pulse ? "animate-pulse" : ""}`}>
      <div className="flex items-center justify-between text-xs md:text-sm font-black">
        <div className="flex items-center gap-2 text-stone-350">
          <span className="scale-110 opacity-90">{icon}</span>
          <span>{title}</span>
        </div>
        <span className="font-mono text-stone-50 font-black">{displayValue}</span>
      </div>
      <div className="h-4.5 w-full bg-zinc-950/80 rounded-full overflow-hidden border border-zinc-900 shadow-inner relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          className={`h-full bg-gradient-to-r rounded-full shadow-[0_0_12px_rgba(255,255,255,0.05)] ${colorClass}`}
        />
        {pulse && (
          <div className="absolute inset-0 bg-red-500/10 animate-ping rounded-full pointer-events-none" />
        )}
      </div>
    </div>
  );
};

interface CharacterAvatarProps {
  stats: PlayerStats;
  major: string;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ stats, major }) => {
  let face = "🧑‍🎓";
  let moodName = "Ổn định";
  let bubbleText = "Học kỳ năm nhất thật thú vị, cố gắng sống sót thôi!";
  let glowColor = "shadow-[0_0_40px_rgba(139,92,246,0.15)] border-violet-500/20 bg-violet-500/5";
  let characterAnimation = "animate-pulse";

  if (stats.stress >= 80) {
    face = "🤯";
    moodName = "Quá tải";
    bubbleText = "Áp lực điên cuồng, đầu sắp bốc hỏa rồi! Phải đi xả hơi gấp!";
    glowColor = "shadow-[0_0_40px_rgba(239,68,68,0.25)] border-red-500/30 bg-red-500/5";
    characterAnimation = "animate-bounce";
  } else if (stats.energy <= 20) {
    face = "😪";
    moodName = "Lao lực";
    bubbleText = "Hết sạch pin rồi... Mắt díp lại... Cần ngủ gấp...";
    glowColor = "shadow-[0_0_40px_rgba(107,114,128,0.2)] border-zinc-500/20 bg-zinc-500/5";
    characterAnimation = "animate-pulse";
  } else if (stats.money <= 15) {
    face = "😭";
    moodName = "Cháy túi";
    bubbleText = "Hết tiền rồi! Có ai cứu đói bữa mì tôm không...";
    glowColor = "shadow-[0_0_40px_rgba(245,158,11,0.2)] border-orange-500/25 bg-orange-500/5";
    characterAnimation = "animate-bounce";
  } else if (stats.gpa <= 30) {
    face = "🤡";
    moodName = "Nguy kịch";
    bubbleText = "GPA tụt dốc thảm hại, có khi nào phải bảo lưu về quê trồng rau...";
    glowColor = "shadow-[0_0_40px_rgba(244,63,94,0.2)] border-rose-500/20 bg-rose-500/5";
  } else if (stats.money >= 80) {
    face = "😎";
    moodName = "Phú hộ";
    bubbleText = "Rủng rỉnh tiền bạc! Chiều nay bao cả đám trà sữa lẩu nướng nhé!";
    glowColor = "shadow-[0_0_40px_rgba(234,179,8,0.25)] border-yellow-500/30 bg-yellow-500/5";
  } else if (stats.gpa >= 90) {
    face = "🤓";
    moodName = "Học bá";
    bubbleText = "Kiến thức lấp lánh! Mấy đề kiểm tra này chỉ là muỗi thôi.";
    glowColor = "shadow-[0_0_40px_rgba(59,130,246,0.25)] border-blue-500/30 bg-blue-500/5";
  } else if (stats.happiness >= 85) {
    face = "🥰";
    moodName = "Yêu đời";
    bubbleText = "Đời sinh viên vui ghê! Mọi thứ đang tiến triển cực tốt.";
    glowColor = "shadow-[0_0_40px_rgba(236,72,153,0.25)] border-pink-500/30 bg-pink-500/5";
  }

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-500 flex flex-col items-center ${glowColor}`}>
      <span className="text-xs text-zinc-400 font-black tracking-widest uppercase mb-3.5">Tình Trạng Nhân Vật</span>
      
      {/* Avatar Container */}
      <div className="relative flex items-center justify-center h-24 w-24 bg-neutral-950 rounded-full border border-zinc-800 shadow-inner">
        <span className={`text-5xl select-none ${characterAnimation}`}>{face}</span>
      </div>

      <div className="mt-2.5 text-center">
        <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-black text-stone-100 uppercase tracking-widest">
          Trạng thái: {moodName}
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="mt-4 w-full relative bg-zinc-900/60 border border-zinc-900/80 p-3 rounded-xl text-center">
        <p className="text-stone-200 text-xs md:text-sm font-bold leading-relaxed italic">"{bubbleText}"</p>
        <div className="absolute -top-1 w-2.5 h-2.5 bg-zinc-900 border-t border-l border-zinc-900/80 rotate-45 left-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
};

export default function App() {
  // Game Configuration & Flow state
  const [phase, setPhase] = useState<GamePhase>("START");
  const [playerName, setPlayerName] = useState("Nguyễn Văn Đạt");
  const [major, setMajor] = useState<"IT" | "BIZ" | "LANG" | any>("IT");
  const [currentDay, setCurrentDay] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isVibrating, setIsVibrating] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [unlockedNotice, setUnlockedNotice] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherType | null>(null);

  const [dailyFeedback, setDailyFeedback] = useState<{
    activityId: string;
    activityName: string;
    isCritical: "success" | "disaster" | "none";
    title: string;
    text: string;
    statsImpact: Partial<PlayerStats>;
    ancestralDodged?: boolean;
  } | null>(null);

  // Core Stats
  const [stats, setStats] = useState<PlayerStats>({
    gpa: 80,
    stress: 30,
    energy: 90,
    money: 60,
    happiness: 75,
  });

  // Gameplay state
  const [selectedActivity, setSelectedActivity] = useState<DailyActivity | null>(null);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [choiceFeedback, setChoiceFeedback] = useState<{
    text: string;
    statsImpact: Partial<PlayerStats>;
  } | null>(null);

  // Log history
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showIntroTutorial, setShowIntroTutorial] = useState(true);
  const [deathCause, setDeathCause] = useState<string>("");

  // Stats Counters
  const [skippedClassesCount, setSkippedClassesCount] = useState(0);
  const [dodgeCount, setDodgeCount] = useState(0);

  // Daily Time Slots & Timeline
  const [currentSlot, setCurrentSlot] = useState<"morning" | "afternoon" | "evening" | any>("morning");
  const [slotLog, setSlotLog] = useState<{
    slot: "morning" | "afternoon" | "evening";
    activityName: string;
    isSkipClass: boolean;
    statsImpact: Partial<PlayerStats>;
  }[]>([]);

  const SEMESTER_DAYS = 14;

  // Manage Sound
  useEffect(() => {
    gameAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Load Achievements on Mount
  useEffect(() => {
    const saved = localStorage.getItem("freshman_achievements");
    if (saved) {
      try {
        setUnlockedAchievements(JSON.parse(saved));
      } catch (e) {
        console.warn("Could not load achievements", e);
      }
    }
  }, []);

  const triggerHapticVisual = () => {
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 500);
  };

  const updateStatWithLimits = (current: number, change: number): number => {
    return Math.min(100, Math.max(0, current + change));
  };

  const formatGPAScore = (percent: number): string => {
    const rawGpa = (percent / 25).toFixed(2);
    return `${rawGpa}/4.0`;
  };

  const getDayOfWeek = (day: number) => {
    const dow = (day - 1) % 7; // 0 to 6
    const labels = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Sảy", "Chủ Nhật"];
    const weeks = Math.ceil(day / 7);
    return {
      label: labels[dow],
      week: weeks,
      isWeekend: dow >= 5,
      dowIndex: dow
    };
  };

  const getSlotSchedule = (day: number, slot: "morning" | "afternoon" | "evening") => {
    const dow = getDayOfWeek(day);
    if (dow.isWeekend) {
      return {
        type: "free" as const,
        label: "🍃 Cuối Tuần Tự Do",
        description: "Đi làm thêm kiếm VNĐ, ngủ nướng bồi bổ sức khỏe hoặc tụ tập bạn bè xả hơi."
      };
    }

    if (slot === "evening") {
      return {
        type: "free" as const,
        label: "🍻 Buổi Tối Tự Do",
        description: "Thời gian tuyệt vời để sinh hoạt CLB, nhậu nhẹt vỉa hè hoặc ngủ sớm."
      };
    }

    if (slot === "morning") {
      if (dow.dowIndex === 0 || dow.dowIndex === 2 || dow.dowIndex === 4) {
        return {
          type: "class" as const,
          label: "📚 Học Chính Khóa (Bắt buộc)",
          description: "Môn Lý thuyết chuyên ngành giảng đường lớn. Đi học nghiêm túc để giữ GPA!"
        };
      } else {
        return {
          type: "free" as const,
          label: "🍃 Buổi Sáng Trống Lịch",
          description: "Sáng nay được nghỉ! Có thể tự học thư viện, đi làm thêm hoặc ngủ nướng."
        };
      }
    }

    // slot === "afternoon"
    if (dow.dowIndex === 1 || dow.dowIndex === 3) {
      return {
        type: "class" as const,
        label: "💻 Thực Hành Nhóm (Bắt buộc)",
        description: "Thực hành phòng máy hoặc thảo luận thuyết trình nhóm căng thẳng!"
      };
    } else {
      return {
        type: "free" as const,
        label: "🍃 Buổi Chiều Trống Lịch",
        description: "Chiều nay trống lịch! Tranh thủ tự học hoặc tham gia hoạt động năng nổ."
      };
    }
  };

  const handleSelectMajor = (selected: "IT" | "BIZ" | "LANG") => {
    gameAudio.playTap();
    setMajor(selected);
    if (selected === "IT") {
      setStats({ gpa: 85, stress: 45, energy: 80, money: 50, happiness: 70 });
    } else if (selected === "BIZ") {
      setStats({ gpa: 75, stress: 30, energy: 90, money: 85, happiness: 75 });
    } else {
      setStats({ gpa: 80, stress: 25, energy: 95, money: 55, happiness: 90 });
    }
  };

  const handleStartGame = () => {
    gameAudio.playSelect();
    setPhase("INTRO");
  };

  const unlockAchievement = (id: string) => {
    if (!unlockedAchievements.includes(id)) {
      const updated = [...unlockedAchievements, id];
      setUnlockedAchievements(updated);
      localStorage.setItem("freshman_achievements", JSON.stringify(updated));
      setUnlockedNotice(ACHIEVEMENTS.find(a => a.id === id)?.title || "");
      gameAudio.playPositive();
      setTimeout(() => setUnlockedNotice(""), 4000);
    }
  };

  const handleConfirmOnboarding = () => {
    if (!playerName.trim()) {
      alert("Vui lòng nhập tên sinh viên!");
      return;
    }
    gameAudio.playPositive();

    let initStats = { gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 };
    if (major === "IT") {
      initStats = { gpa: 85, stress: 45, energy: 80, money: 50, happiness: 70 };
    } else if (major === "BIZ") {
      initStats = { gpa: 75, stress: 30, energy: 90, money: 85, happiness: 75 };
    } else {
      initStats = { gpa: 80, stress: 25, energy: 95, money: 55, happiness: 90 };
    }

    setStats(initStats);
    setSkippedClassesCount(0);
    setDodgeCount(0);

    const rolledWeather = WEATHERS[0]; // Tiết trời ôn hòa Ngày 1
    setCurrentWeather(rolledWeather);

    setPhase("GAMEPLAY");
    setCurrentDay(1);
    setHistory([]);
  };

  // Math engine with traits & weather adjustments
  const calculateFinalImpact = (
    activityId: string,
    baseCost: Record<string, number>,
    extraImpact: Partial<PlayerStats> = {}
  ) => {
    const finalImpact: Record<string, number> = {};
    const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;

    statKeys.forEach(k => {
      let change = 0;
      if (k in baseCost) change += baseCost[k];
      if (extraImpact && k in extraImpact) change += extraImpact[k]!;

      // Weather modifiers
      if (currentWeather) {
        if (currentWeather.id === "hot") {
          if ((activityId === "lecture" || activityId === "parttime") && k === "energy") {
            change -= 4;
          }
          if (activityId === "rest" && k === "energy" && change > 0) {
            change += 6;
          }
        }
        if (currentWeather.id === "flood") {
          if (activityId === "lecture" && k === "stress") {
            change += 5;
          }
          if (activityId === "rest" && k === "happiness") {
            change += 5;
          }
        }
        if (currentWeather.id === "exam_week") {
          if (activityId === "library" && k === "gpa" && change > 0) {
            change = Math.round(change * 1.5);
          }
          if (activityId === "party" && k === "gpa") {
            change -= 5;
          }
        }
        if (currentWeather.id === "inflation") {
          if (activityId === "parttime" && k === "money" && change > 0) {
            change += 10;
          }
          if (activityId === "party" && k === "money" && change < 0) {
            change -= 5;
          }
        }
        if (currentWeather.id === "slay_day") {
          if ((activityId === "party" || activityId === "club") && k === "stress" && change < 0) {
            change -= 5;
          }
          if ((activityId === "party" || activityId === "club") && k === "happiness" && change > 0) {
            change += 5;
          }
        }
      }

      finalImpact[k] = change;
    });

    let ancestralDodged = false;

    return { finalImpact, ancestralDodged };
  };

  const evaluateEndDayStats = (currStats: PlayerStats, finalImpact: Record<string, number>) => {
    const draftStats: PlayerStats = { ...currStats };
    const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => {
      draftStats[k] = updateStatWithLimits(draftStats[k], finalImpact[k] || 0);
    });

    const isHurt =
      (finalImpact.stress && finalImpact.stress > 0) ||
      (draftStats.stress > 80) ||
      (draftStats.energy < 20);

    if (isHurt) {
      triggerHapticVisual();
    }

    setStats(draftStats);

    // Dynamic Achievements check
    if (draftStats.gpa >= 100) unlockAchievement("gpa_god");
    if (draftStats.money >= 95) unlockAchievement("rich_kid");

    // Game-over checks
    if (draftStats.energy <= 0) {
      setDeathCause("Lao lực cạn kiệt năng lượng! Bạn bất tỉnh nhân sự ngay tại hành lang khu tự học và phải nhập viện truyền nước gấp. Kết thúc học kỳ.");
      gameAudio.playOver();
      setPhase("GAMEOVER");
      return true;
    }
    if (draftStats.stress >= 100) {
      setDeathCause("Stress vượt đỉnh 100%! Bạn bị đóng băng não bộ do áp lực bài vở dồn dập, không thể tiếp thu thêm bất cứ kiến thức gì.");
      gameAudio.playOver();
      setPhase("GAMEOVER");
      return true;
    }
    if (draftStats.money <= 0) {
      setDeathCause("Tài chính chạm đáy 0đ! Bạn không còn nổi 1 nghìn đồng ăn mì tôm úp vỉa hè, đành đóng vali bảo lưu về quê.");
      gameAudio.playOver();
      setPhase("GAMEOVER");
      return true;
    }
    if (draftStats.gpa <= 0) {
      setDeathCause("GPA chạm đáy phế tích! Bạn chính thức nhận quyết định buộc thôi học gửi trực tiếp về phụ huynh từ Phòng đào tạo.");
      gameAudio.playOver();
      setPhase("GAMEOVER");
      return true;
    }

    return false;
  };

  const handlePerformSlotActivity = (
    activityId: string,
    activityName: string,
    baseCost: Record<string, number>,
    isSkipClass = false
  ) => {
    const { finalImpact, ancestralDodged } = calculateFinalImpact(activityId, baseCost);

    if (ancestralDodged) {
      setDodgeCount(prev => {
        const newVal = prev + 1;
        if (newVal >= 2) unlockAchievement("spiritual_saved");
        return newVal;
      });
    }

    if (isSkipClass) {
      setSkippedClassesCount(prev => {
        const newVal = prev + 1;
        if (newVal >= 4) unlockAchievement("skip_boss");
        return newVal;
      });
    }

    const actDummy: DailyActivity = {
      id: activityId,
      name: activityName,
      description: "",
      icon: "",
      baseCost: baseCost as any,
      colorClass: ""
    };
    setSelectedActivity(actDummy);

    const slotLabel = currentSlot === "morning" ? "Sáng" : currentSlot === "afternoon" ? "Chiều" : "Tối";
    const loggedName = `${slotLabel}: ${isSkipClass ? `[CÚP HỌC] ` : ""}${activityName}`;

    const newSlotLog = [
      ...slotLog,
      {
        slot: currentSlot,
        activityName: loggedName,
        isSkipClass,
        statsImpact: finalImpact
      }
    ];
    setSlotLog(newSlotLog);
    gameAudio.playTap();

    const draftStats = { ...stats };
    const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => {
      draftStats[k] = updateStatWithLimits(draftStats[k], finalImpact[k] || 0);
    });

    const isHurt = (finalImpact.stress && finalImpact.stress > 0) || (draftStats.stress > 80) || (draftStats.energy < 25);
    if (isHurt) {
      triggerHapticVisual();
    }
    setStats(draftStats);

    // Slot transition
    if (currentSlot === "morning") {
      setCurrentSlot("afternoon");
    } else if (currentSlot === "afternoon") {
      setCurrentSlot("evening");
    } else {
      handleEndDay(newSlotLog, draftStats);
    }
  };

  const handleEndDay = (completedSlotLog: typeof slotLog, currentStats: PlayerStats) => {
    let matchingEvent: GameEvent | null = null;
    if (currentDay === 1) {
      matchingEvent = GAME_EVENTS.find(e => e.id === "e1") || null;
    } else {
      const shouldTrigger = Math.random() < 0.35;
      if (shouldTrigger) {
        const unusedEvents = GAME_EVENTS.filter(e => e.id !== "e1" && !history.some(h => h.eventTitle === e.title));
        const pool = unusedEvents.length > 0 ? unusedEvents : GAME_EVENTS.filter(e => e.id !== "e1");
        matchingEvent = pool[Math.floor(Math.random() * pool.length)] || null;
      }
    }

    const actsPlayedIds = completedSlotLog.map(l => {
      const name = l.activityName.toLowerCase();
      if (name.includes("thư viện")) return "library";
      if (name.includes("làm thêm")) return "parttime";
      if (name.includes("câu lạc bộ")) return "club";
      if (name.includes("nhậu")) return "party";
      if (name.includes("ngủ")) return "rest";
      return "lecture";
    });
    const rollActId = actsPlayedIds[Math.floor(Math.random() * actsPlayedIds.length)] || "lecture";
    const actOutcomes = DAILY_OUTCOMES[rollActId];
    const roll = Math.random();

    let isCritical: "success" | "disaster" | "none" = "none";
    let outcomeDetail: OutcomeDetail = {
      title: "Nhật Ký Ngày Bình Yên",
      text: "Bạn vừa kết thúc một ngày sinh viên cực kỳ bận rộn. Mệt nhoài nhưng thật xứng đáng vì đã quản lý thời gian khoa học!",
      statsImpact: {}
    };

    if (roll < 0.12 && actOutcomes) {
      isCritical = "success";
      outcomeDetail = actOutcomes.criticalSuccess;
      gameAudio.playPositive();
    } else if (roll < 0.24 && actOutcomes) {
      isCritical = "disaster";
      outcomeDetail = actOutcomes.criticalDisaster;
      gameAudio.playNegative();
    } else if (actOutcomes && actOutcomes.normalDays && actOutcomes.normalDays.length > 0) {
      outcomeDetail = actOutcomes.normalDays[Math.floor(Math.random() * actOutcomes.normalDays.length)];
    }

    let criticalImpact: Record<string, number> = {};
    let ancestralDodged = false;
    if (isCritical !== "none") {
      const calc = calculateFinalImpact(rollActId, {}, outcomeDetail.statsImpact);
      criticalImpact = calc.finalImpact;
      ancestralDodged = calc.ancestralDodged || false;

      const postCriticalStats = { ...currentStats };
      const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
      statKeys.forEach(k => {
        postCriticalStats[k] = updateStatWithLimits(postCriticalStats[k], criticalImpact[k] || 0);
      });
      setStats(postCriticalStats);
    }

    setDailyFeedback({
      activityId: rollActId,
      activityName: completedSlotLog.map(l => l.activityName.split(": ")[1] || l.activityName).join(" ➔ "),
      isCritical,
      title: outcomeDetail.title,
      text: outcomeDetail.text,
      statsImpact: criticalImpact,
      ancestralDodged
    });

    if (matchingEvent) {
      setActiveEvent(matchingEvent);
      setPhase("EVENT");
    } else {
      setPhase("DAILY_FEEDBACK");
    }
  };

  const handleSelectEventOption = (option: ChoiceOption) => {
    const isMainlyPositive = (option.outcome.gpa >= 0 && option.outcome.happiness >= 0);
    if (isMainlyPositive) {
      gameAudio.playPositive();
    } else {
      gameAudio.playNegative();
    }

    setChoiceFeedback({
      text: option.outcome.textFeedback,
      statsImpact: option.outcome.gpa !== undefined ? option.outcome : {} as any
    });
  };

  const handleConfirmFeedback = () => {
    gameAudio.playTap();
    if (!activeEvent) return;

    const eventImpact = choiceFeedback ? choiceFeedback.statsImpact : {};
    const { finalImpact, ancestralDodged } = calculateFinalImpact("event", {}, eventImpact);
    const daySummary = slotLog.map(l => l.activityName.split(": ")[1] || l.activityName).join(" ➔ ");

    const newLog: GameHistoryEntry = {
      day: currentDay,
      activityName: daySummary,
      eventTitle: ancestralDodged ? `[ĐÃ NÉ] ${activeEvent.title}` : activeEvent.title,
      choiceMade: choiceFeedback ? "Đã lướt qua" : undefined,
      statsImpact: finalImpact
    };

    setHistory([newLog, ...history]);

    const draftStats = { ...stats };
    const statKeys = ["gpa", "stress", "energy", "money", "happiness"] as const;
    statKeys.forEach(k => {
      draftStats[k] = updateStatWithLimits(draftStats[k], finalImpact[k] || 0);
    });
    setStats(draftStats);

    const isGameOver = evaluateEndDayStats(draftStats, finalImpact);

    // Clean states for next day
    setActiveEvent(null);
    setChoiceFeedback(null);
    setSelectedActivity(null);
    setSlotLog([]);
    setCurrentSlot("morning");

    if (!isGameOver) {
      unlockAchievement("first_day");
      if (currentDay >= SEMESTER_DAYS) {
        unlockAchievement("survivor");
        if (draftStats.stress <= 10) unlockAchievement("zen_master");
        gameAudio.playPositive();
        setPhase("SUMMARY");
      } else {
        const nextDay = currentDay + 1;
        setCurrentDay(nextDay);
        const nextWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
        setCurrentWeather(nextWeather);
        setPhase("GAMEPLAY");
      }
    }
  };

  const handleConfirmDailyFeedback = () => {
    gameAudio.playTap();
    if (!dailyFeedback) return;

    const finalImpact = dailyFeedback.statsImpact as Record<string, number>;
    const daySummary = slotLog.map(l => l.activityName.split(": ")[1] || l.activityName).join(" ➔ ");
    const displayActivityName =
      daySummary +
      (dailyFeedback.isCritical === "success" ? " (🔥 BẠO KÍCH)" : dailyFeedback.isCritical === "disaster" ? " (⚠️ ĐẠI NẠN)" : "");

    const newLog: GameHistoryEntry = {
      day: currentDay,
      activityName: displayActivityName,
      eventTitle: dailyFeedback.ancestralDodged ? "✨ Tổ Tiên Phù Hộ" : undefined,
      statsImpact: finalImpact
    };

    setHistory([newLog, ...history]);

    const isGameOver = evaluateEndDayStats(stats, finalImpact);

    setDailyFeedback(null);
    setSelectedActivity(null);
    setSlotLog([]);
    setCurrentSlot("morning");

    if (!isGameOver) {
      unlockAchievement("first_day");
      if (currentDay >= SEMESTER_DAYS) {
        unlockAchievement("survivor");
        if (stats.stress <= 10) unlockAchievement("zen_master");
        gameAudio.playPositive();
        setPhase("SUMMARY");
      } else {
        const nextDay = currentDay + 1;
        setCurrentDay(nextDay);
        const nextWeather = WEATHERS[Math.floor(Math.random() * WEATHERS.length)];
        setCurrentWeather(nextWeather);
        setPhase("GAMEPLAY");
      }
    }
  };

  const getStudentBadge = () => {
    if (stats.gpa >= 90 && stats.stress >= 75) {
      return {
        title: "🏆 THỦ KHOA GANH TẠ",
        description: "Lưng còng rạp vì gánh tạ bài tập nhóm của đồng bọn, tóc rụng xơ xác nhưng bảng điểm sáng lòa!",
        color: "bg-amber-500/10 border-amber-500/30 text-amber-400"
      };
    }
    if (stats.gpa >= 80 && stats.stress <= 30 && stats.happiness >= 75) {
      return {
        title: "✨ CAO NHÂN ĐẮC ĐẠO",
        description: "Vừa học siêu phàm vừa thong dong thảnh thơi, tâm lý bất biến giữa muôn vàn áp lực bài vở.",
        color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
      };
    }
    if (stats.gpa < 60 && stats.happiness >= 80) {
      return {
        title: "💃 CHIẾN THẦN ĐU ĐƯA",
        description: "Điểm số vừa đủ qua môn, không cuộc vui nào vắng mặt. Tốt nghiệp bằng Đời loại Xuất sắc!",
        color: "bg-pink-500/10 border-pink-500/30 text-pink-400"
      };
    }
    if (stats.money >= 80 && stats.gpa < 75) {
      return {
        title: "💰 PHÚ HỘ GIẢNG ĐƯỜNG",
        description: "Tiền đè chết người nhờ siêng làm thêm ca bục mặt, ví dày cộm nhưng lên lớp toàn ngủ gật.",
        color: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      };
    }
    if (stats.money <= 20 && stats.gpa >= 75) {
      return {
        title: "🍜 CHIẾN BINH MÌ TÔM",
        description: "Sinh tồn mãnh liệt bằng mì Hảo Hảo úp giấy tập qua ngày. GPA cao ngất ngưởng nhưng gầy rộc.",
        color: "bg-sky-500/10 border-sky-500/30 text-sky-400"
      };
    }
    return {
      title: "🎓 SINH VIÊN MẪU MỰC",
      description: "Một sinh viên bình thường, sống sót an toàn qua mùa thi không quá nổi bật hay tai tiếng.",
      color: "bg-blue-500/10 border-blue-500/30 text-blue-400"
    };
  };

  const handleRestart = () => {
    gameAudio.playSelect();
    setStats({ gpa: 80, stress: 30, energy: 90, money: 60, happiness: 75 });
    setCurrentDay(1);
    setSelectedActivity(null);
    setActiveEvent(null);
    setChoiceFeedback(null);
    setHistory([]);
    setCurrentSlot("morning");
    setSlotLog([]);
    setCurrentWeather(null);
    setPhase("START");
  };

  const dowInfo = getDayOfWeek(currentDay);
  const slotSchedule = getSlotSchedule(currentDay, currentSlot);
  const badge = getStudentBadge();

  const weatherGlowClass = useMemo(() => {
    if (!currentWeather) return "bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.03)_0%,_transparent_60%)]";
    switch (currentWeather.id) {
      case "sunny":
        return "bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.08)_0%,_transparent_60%)]";
      case "flood":
        return "bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08)_0%,_transparent_60%)]";
      case "exam_week":
        return "bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.08)_0%,_transparent_60%)]";
      case "inflation":
        return "bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08)_0%,_transparent_60%)]";
      case "slay_day":
        return "bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.08)_0%,_transparent_60%)]";
      default:
        return "bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.03)_0%,_transparent_60%)]";
    }
  }, [currentWeather]);

  return (
    <div className="min-h-screen bg-[#050507] text-stone-100 font-sans selection:bg-amber-500 selection:text-black flex flex-col justify-between transition-colors duration-1000 relative overflow-hidden">
      {/* Weather Environmental Ambient Glow Background */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ${weatherGlowClass}`} />
      {/* Dynamic Achievement Unlocked Notice Toast */}
      <AnimatePresence>
        {unlockedNotice && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl bg-zinc-900 border border-amber-500/30 text-amber-300 font-bold text-xs shadow-[0_10px_30px_rgba(245,158,11,0.15)] flex items-center gap-2.5"
          >
            <Award className="h-5 w-5 text-amber-400 animate-bounce shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase tracking-widest font-extrabold">ĐÃ MỞ KHÓA THÀNH TỰU!</span>
              <p className="text-stone-100 font-display text-sm leading-tight">{unlockedNotice}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Compact Header */}
      <header className="border-b border-zinc-900/80 bg-[#070709]/80 backdrop-blur-md sticky top-0 z-35 py-3 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none cursor-pointer" onClick={handleRestart}>
            <div className="h-7 w-7 rounded-lg bg-amber-500 flex items-center justify-center text-black font-extrabold">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-display font-bold text-sm uppercase tracking-widest bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Freshman Survival
            </span>
          </div>

          <div className="flex items-center gap-3">
            {phase === "GAMEPLAY" && (
              <button
                onClick={() => {
                  gameAudio.playTap();
                  setShowHistoryModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all text-xs font-bold text-stone-300 flex items-center gap-1.5 cursor-pointer select-none"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Nhật ký ({history.length})</span>
              </button>
            )}

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                gameAudio.playTap();
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-stone-400 hover:text-stone-200 transition-all active:scale-90 cursor-pointer"
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Responsive Grid Arena Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex flex-col justify-center">
        <motion.div
          animate={isVibrating ? {
            x: [-6, 6, -6, 6, -3, 3, 0],
            y: [-2, 2, -2, 2, 0, 0, 0]
          } : {}}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          {/* SIDEBAR STATUS & ACHIEVEMENT ROOM PANEL: lg:col-span-4 */}
          {phase !== "START" && phase !== "INTRO" && (
            <aside className="lg:col-span-4 space-y-5">
              {/* Profile card block */}
              <div className="p-5 rounded-2xl bg-[#0b0b0e]/90 border border-zinc-900/85 shadow-[0_12px_40px_rgba(0,0,0,0.4)] space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-xl bg-neutral-950 border border-zinc-800 flex items-center justify-center text-xl shadow-inner shrink-0">
                    🧑‍🎓
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-display font-black text-sm truncate text-stone-100 uppercase tracking-wide">{playerName}</h3>
                    <p className="text-[11px] text-zinc-400 font-extrabold uppercase tracking-widest mt-1">
                      {major === "IT" ? "💻 CNTT" : major === "BIZ" ? "📊 QTKD" : "🇬🇧 Anh Văn"}
                    </p>
                  </div>
                </div>

                {/* RPG HUD Health Bars */}
                <div className="space-y-4 border-t border-zinc-950/60 pt-4">
                  <RPGStatusBar
                    label="gpa"
                    value={stats.gpa}
                    colorClass="from-amber-500 to-yellow-400"
                    icon={<GraduationCap className="h-4.5 w-4.5 text-amber-400" />}
                    title="GPA HỌC LỰC"
                    displayValue={formatGPAScore(stats.gpa)}
                  />
                  <RPGStatusBar
                    label="stress"
                    value={stats.stress}
                    colorClass="from-rose-600 to-red-500"
                    icon={<AlertTriangle className="h-4.5 w-4.5 text-rose-400" />}
                    title="STRESS ÁP LỰC"
                    displayValue={`${stats.stress}%`}
                    pulse={stats.stress >= 80}
                  />
                  <RPGStatusBar
                    label="energy"
                    value={stats.energy}
                    colorClass="from-emerald-500 to-green-400"
                    icon={<Battery className="h-4.5 w-4.5 text-emerald-400" />}
                    title="PIN NĂNG LƯỢNG"
                    displayValue={`${stats.energy}%`}
                    pulse={stats.energy <= 20}
                  />
                  <RPGStatusBar
                    label="money"
                    value={stats.money}
                    colorClass="from-yellow-500 to-amber-400"
                    icon={<Coins className="h-4.5 w-4.5 text-yellow-400" />}
                    title="TIỀN BẠC VNĐ"
                    displayValue={`${stats.money} VNĐ`}
                    pulse={stats.money <= 15}
                  />
                  <RPGStatusBar
                    label="happiness"
                    value={stats.happiness}
                    colorClass="from-cyan-500 to-blue-400"
                    icon={<Smile className="h-4.5 w-4.5 text-cyan-400" />}
                    title="NIỀM VUI VẺ"
                    displayValue={`${stats.happiness}%`}
                  />
                </div>
              </div>

              {/* Character Live Stage */}
              <CharacterAvatar stats={stats} major={major} />

              {/* Dynamic Weather & Day Trend card */}
              {currentWeather && (
                <div className={`p-5 rounded-2xl border ${currentWeather.color} transition-all duration-300`}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-2xl shrink-0">{currentWeather.icon}</span>
                    <h4 className="font-display font-black text-sm uppercase tracking-wider">{currentWeather.name}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-stone-200 leading-relaxed font-bold font-sans">{currentWeather.description}</p>
                </div>
              )}

              {/* Achievements Trophies Card */}
              <div className="p-5 rounded-2xl bg-[#0b0b0e]/90 border border-zinc-900/80 shadow-md">
                <div className="flex items-center gap-2 border-b border-zinc-950 pb-3 mb-4">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h4 className="font-display font-black text-sm uppercase tracking-wider">Phòng Thành Tích ({unlockedAchievements.length}/6)</h4>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {ACHIEVEMENTS.map(a => {
                    const isUnlocked = unlockedAchievements.includes(a.id);
                    return (
                      <div
                        key={a.id}
                        className={`relative h-11 rounded-xl flex items-center justify-center text-2xl border transition-all group ${
                          isUnlocked
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-help"
                            : "bg-neutral-900/30 border-zinc-900 text-zinc-700 opacity-40"
                        }`}
                        title={`${a.title}: ${a.description}`}
                      >
                        <span>{a.icon}</span>

                        {/* Hover Popup Tooltip */}
                        <div className="absolute bottom-13 left-1/2 -translate-x-1/2 z-50 w-52 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-stone-200 leading-snug hidden group-hover:block shadow-2xl pointer-events-none">
                          <p className="font-black text-stone-50 mb-1">{a.title}</p>
                          <p className="font-semibold text-zinc-400 mb-1.5">{a.description}</p>
                          <span className="text-[10px] bg-zinc-900 text-amber-400 px-1.5 py-0.5 rounded font-mono font-black">ĐK: {a.requirement}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}

          {/* MAIN INTERACTION STAGE CORE VIEWPORT: lg:col-span-8 or 12 depending on phase */}
          <div className={`${phase === "START" || phase === "INTRO" ? "lg:col-span-12" : "lg:col-span-8"} w-full`}>
            <AnimatePresence mode="wait">
              {/* PHASE 1: START WELCOME SCREEN */}
              {phase === "START" && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-xl mx-auto p-10 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl text-center space-y-7"
                >
                  <div className="relative inline-block mx-auto">
                    <span className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse"></span>
                    <div className="h-24 w-24 rounded-2xl bg-neutral-950 border border-amber-500/20 flex items-center justify-center shadow-lg ring-1 ring-amber-500/10">
                      <GraduationCap className="h-12 w-12 text-amber-400 stroke-[1.2]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-widest bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500 bg-clip-text text-transparent uppercase">
                      Freshman Survival
                    </h1>
                    <p className="text-stone-300 text-xs md:text-sm max-w-sm mx-auto leading-relaxed font-sans font-medium">
                      Game nhập vai mô phỏng thời khóa biểu sinh tồn kỳ đại học năm nhất dành cho cả PC & Thiết bị di động.
                    </p>
                  </div>

                  {/* Achievements overview widget */}
                  <div className="p-5 rounded-2xl bg-[#0e0e11] border border-zinc-900/80 text-left max-w-sm mx-auto">
                    <p className="text-xs font-black text-amber-400 uppercase mb-2 tracking-widest flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-500" /> Thành tựu đã mở khóa:
                    </p>
                    <p className="text-sm text-stone-200 font-sans font-medium leading-relaxed">
                      Bạn đã chinh phục <span className="text-amber-400 font-black">{unlockedAchievements.length} / 6</span> cúp danh vọng. Hãy bắt đầu ca chơi mới để sưu tầm trọn bộ!
                    </p>
                  </div>

                  <button
                    onClick={handleStartGame}
                    className="w-full max-w-xs py-4.5 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest"
                  >
                    Bắt đầu nhập học
                  </button>
                </motion.div>
              )}

              {/* PHASE 2: CHARACTER CREATION (INTRO) */}
              {phase === "INTRO" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="max-w-4xl mx-auto p-8 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl space-y-7"
                >
                  <div className="text-center space-y-1.5 border-b border-zinc-900 pb-5">
                    <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest font-mono">HỒ SƠ TÂN SINH VIÊN</span>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-stone-100 uppercase tracking-wider">
                      Thiết Lập Nhân Vật
                    </h2>
                    <p className="text-xs md:text-sm text-stone-400 font-sans">
                      Hãy chọn tên và chuyên ngành của bạn để bắt đầu học kỳ năm nhất đầy bão táp!
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Name input */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block">
                        Tên sinh viên:
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-zinc-500">
                          <User className="h-5 w-5" />
                        </span>
                        <input
                          type="text"
                          maxLength={24}
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-[#121216] border border-zinc-800 rounded-xl text-sm font-black text-stone-100 focus:outline-none focus:border-amber-500/85 transition-all"
                          placeholder="Tên của bạn..."
                        />
                      </div>
                    </div>

                    {/* Right: Major preset list */}
                    <div className="space-y-2.5">
                      <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block">
                        Chuyên ngành đại học:
                      </label>
                      <div className="space-y-2.5">
                        {[
                          { id: "IT", name: "Công Nghệ Thông Tin", desc: "GPA cao, mệt & Stress nhiều hơn.", icon: <Zap className="h-5 w-5" /> },
                          { id: "BIZ", name: "Quản Trị Kinh Doanh", desc: "Tài chính rủng rỉnh, giao thiệp rộng.", icon: <Coins className="h-5 w-5" /> },
                          { id: "LANG", name: "Ngôn Ngữ Anh", desc: "Thư giãn, thảnh thơi, nhiều niềm vui.", icon: <Smile className="h-5 w-5" /> }
                        ].map(m => (
                          <button
                            key={m.id}
                            onClick={() => handleSelectMajor(m.id as any)}
                            className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                              major === m.id
                                ? "bg-amber-500/10 border-amber-500/40"
                                : "bg-[#121216]/50 border-zinc-900 hover:border-zinc-800"
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-neutral-900 ${major === m.id ? "bg-amber-400" : "bg-zinc-800 text-zinc-400"}`}>
                                {m.icon}
                              </div>
                              <div>
                                <p className="text-sm font-black text-stone-100">{m.name}</p>
                                <p className="text-[11px] text-stone-300 font-bold mt-0.5">{m.desc}</p>
                              </div>
                            </div>
                            {major === m.id && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-zinc-900 flex justify-end">
                    <button
                      onClick={handleConfirmOnboarding}
                      className="w-full md:w-auto px-10 py-4.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-sm shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-widest"
                    >
                      Xác Nhận Hồ Sơ & Nhập Học <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* PHASE 3: GAMEPLAY LOOP SCHEDULER */}
              {phase === "GAMEPLAY" && (
                <motion.div
                  key="gameplay"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  {/* HUD Day status & Current schedule card */}
                  <div className="p-6 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-900/60 pb-3.5 gap-2">
                      <div>
                        <span className="text-xs font-black text-amber-500 uppercase tracking-widest font-mono">
                          Tuần {dowInfo.week} — {dowInfo.label}
                        </span>
                        <h2 className="text-2xl font-display font-black text-stone-100 mt-1">
                          Hành Trình Ngày {currentDay} / {SEMESTER_DAYS}
                        </h2>
                      </div>

                      {/* Visual slot dots tracker */}
                      <div className="flex items-center gap-2 bg-neutral-900/60 px-4 py-1.5 rounded-full border border-zinc-800">
                        {["morning", "afternoon", "evening"].map(s => {
                          const isActive = currentSlot === s;
                          const isDone = (s === "morning" && currentSlot !== "morning") || (s === "afternoon" && currentSlot === "evening");
                          return (
                            <span
                              key={s}
                              className={`h-3 w-3 rounded-full transition-all ${
                                isActive ? "bg-amber-400 scale-110 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : isDone ? "bg-zinc-700" : "bg-neutral-900 border border-zinc-800"
                              }`}
                              title={s === "morning" ? "Buổi Sáng" : s === "afternoon" ? "Buổi Chiều" : "Buổi Tối"}
                            />
                          );
                        })}
                        <span className="text-[11px] text-zinc-400 font-black uppercase font-mono pl-1.5">{currentSlot === "morning" ? "Sáng" : currentSlot === "afternoon" ? "Chiều" : "Tối"}</span>
                      </div>
                    </div>

                    {/* Timeline Schedule Widget */}
                    <div className="p-5 rounded-2xl bg-[#121216]/50 border border-zinc-900 flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-black text-lg shrink-0 ${slotSchedule.type === "class" ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" : "bg-zinc-800/40 text-stone-400"}`}>
                        {slotSchedule.type === "class" ? "📚" : "🍃"}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-stone-100">{slotSchedule.label}</h4>
                        <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-bold font-sans">{slotSchedule.description}</p>
                      </div>
                    </div>

                    {/* Main Interaction Activity options container */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black text-zinc-400 uppercase tracking-widest block">
                          Chọn hành động thực hiện:
                        </label>
                        <span className="text-xs font-mono font-black text-zinc-500 uppercase">Click để chọn</span>
                      </div>

                      {slotSchedule.type === "class" ? (
                        /* CLASS SLOT: Option to study or skip */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          {/* Option 1: Attend class */}
                          <motion.button
                            whileHover={{ scale: 1.01, borderColor: "rgba(245, 158, 11, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePerformSlotActivity("lecture", "Học Chính Khóa", { gpa: 7, stress: 8, energy: -12, money: 0, happiness: -2 })}
                            className="text-left p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-zinc-900/40 hover:from-amber-500/10 hover:to-zinc-900/60 border border-zinc-900/80 hover:border-amber-500/30 transition-all cursor-pointer flex flex-col justify-between group min-h-40 md:h-44"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-neutral-950 border border-zinc-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                                <GraduationCap className="h-6 w-6" />
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-stone-100 uppercase tracking-wide">Lên Lớp Học</h5>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase font-mono font-black mt-1 inline-block">Bắt buộc</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">+7 GPA</span>
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">-12 PIN</span>
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-red-500/10 text-rose-300">+8 ÁP LỰC</span>
                            </div>
                          </motion.button>

                          {/* Option 2: Skip to Part-time */}
                          <motion.button
                            whileHover={{ scale: 1.01, borderColor: "rgba(251, 191, 36, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePerformSlotActivity("parttime", "Làm Thêm (Cúp học)", { gpa: -12, stress: 10, energy: -12, money: 15, happiness: -3 }, true)}
                            className="text-left p-5 rounded-2xl bg-gradient-to-br from-rose-500/5 to-zinc-900/40 hover:from-rose-500/10 hover:to-zinc-900/60 border border-zinc-900/80 hover:border-rose-500/30 transition-all cursor-pointer flex flex-col justify-between group min-h-40 md:h-44"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-neutral-950 border border-zinc-800 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                                <Coins className="h-6 w-6" />
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-stone-150 uppercase tracking-wide">Cúp Làm Thêm</h5>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 uppercase font-mono font-black mt-1 inline-block">Cúp học</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">+15 VNĐ</span>
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">-12 GPA</span>
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">-12 PIN</span>
                            </div>
                          </motion.button>

                          {/* Option 3: Skip to Sleep */}
                          <motion.button
                            whileHover={{ scale: 1.01, borderColor: "rgba(129, 140, 248, 0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handlePerformSlotActivity("rest", "Ngủ Nướng (Cúp học)", { gpa: -15, stress: -10, energy: 20, money: 0, happiness: 8 }, true)}
                            className="text-left p-5 rounded-2xl bg-[#0e0e11]/60 hover:bg-[#121216]/80 border border-zinc-900/80 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between group min-h-40 md:h-44"
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-11 w-11 rounded-xl bg-neutral-950 border border-zinc-800 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
                                <Moon className="h-6 w-6" />
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-stone-150 uppercase tracking-wide">Cúp Ngủ Nướng</h5>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 uppercase font-mono font-black mt-1 inline-block">Cúp học</span>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">+20 PIN</span>
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">+8 VUI</span>
                              <span className="text-[11px] font-mono font-black px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">-15 GPA</span>
                            </div>
                          </motion.button>
                        </div>
                      ) : (
                        /* FREE SLOT: Choose from activities */
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          {[
                            { id: "library", name: "Thư Viện", base: { gpa: 10, stress: 12, energy: -14, money: 0, happiness: -4 }, icon: <BookOpen className="h-6 w-6" />, col: "text-teal-400", border: "hover:border-teal-500/30", bg: "hover:bg-teal-500/5", plus: "+10 GPA", minus: "-14 PIN" },
                            { id: "parttime", name: "Làm Thêm", base: { gpa: -2, stress: 14, energy: -18, money: 20, happiness: -5 }, icon: <Coins className="h-6 w-6" />, col: "text-amber-400", border: "hover:border-amber-500/30", bg: "hover:bg-amber-500/5", plus: "+20 VNĐ", minus: "-18 PIN" },
                            { id: "club", name: "Câu Lạc Bộ", base: { gpa: 0, stress: -6, energy: -8, money: -3, happiness: 12 }, icon: <Users className="h-6 w-6" />, col: "text-pink-400", border: "hover:border-pink-500/30", bg: "hover:bg-pink-500/5", plus: "+12 VUI", minus: "-6 ÁP LỰC" },
                            { id: "rest", name: "Nghỉ Ngơi", base: { gpa: 0, stress: -10, energy: 18, money: 0, happiness: 6 }, icon: <Moon className="h-6 w-6" />, col: "text-indigo-400", border: "hover:border-indigo-500/30", bg: "hover:bg-indigo-500/5", plus: "+18 PIN", minus: "-10 ÁP LỰC" },
                            { id: "party", name: "Nhậu Nhẹt", base: { gpa: -2, stress: -12, energy: -6, money: -8, happiness: 15 }, icon: <CupSoda className="h-6 w-6" />, col: "text-rose-400", border: "hover:border-rose-500/30", bg: "hover:bg-rose-500/5", plus: "+15 VUI", minus: "-12 ÁP LỰC" }
                          ].map(act => (
                            <motion.button
                              key={act.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handlePerformSlotActivity(act.id, act.name, act.base)}
                              className={`text-center p-4 rounded-2xl bg-[#0e0e11]/90 border border-zinc-900/80 ${act.border} ${act.bg} transition-all cursor-pointer flex flex-col items-center justify-between min-h-[170px] md:h-48 group`}
                            >
                              <div className={`h-12 w-12 rounded-xl bg-neutral-950 border border-zinc-800 flex items-center justify-center text-lg ${act.col} group-hover:scale-105 transition-transform shrink-0`}>
                                {act.icon}
                              </div>
                              
                              <h5 className="text-xs md:text-sm font-black text-stone-100 uppercase tracking-wide mt-2">{act.name}</h5>
                              
                              <div className="w-full flex flex-col gap-1 mt-3">
                                <span className="text-[11px] font-mono font-black py-0.5 rounded bg-emerald-500/10 text-emerald-400 block w-full text-center">{act.plus}</span>
                                <span className="text-[11px] font-mono font-black py-0.5 rounded bg-rose-500/10 text-rose-400 block w-full text-center">{act.minus}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Simple Help Info Box */}
                  {showIntroTutorial && (
                    <div className="p-4.5 bg-amber-950/5 border border-amber-500/15 rounded-2xl relative text-xs md:text-sm text-amber-300 leading-relaxed font-sans flex items-start gap-2.5 animate-pulse">
                      <Info className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="font-black text-stone-100 block mb-1 text-xs md:text-sm">Mẹo Sinh Tồn:</span>
                        Hãy đảm bảo pin (Energy) của bạn luôn trên 20% và Stress dưới 80%. Hãy ngủ nướng nếu thấy pin cạn kiệt, và đi nhậu hoặc CLB để xả bớt Stress khi áp lực thi cử quá tải!
                      </div>
                      <button onClick={() => setShowIntroTutorial(false)} className="text-zinc-500 hover:text-white shrink-0 cursor-pointer text-xs font-bold px-1.5">✕</button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* PHASE 4: DAILY FEEDBACK DIGEST SCREEN */}
              {phase === "DAILY_FEEDBACK" && dailyFeedback && (
                <motion.div
                  key="daily_feedback"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl text-center space-y-6"
                >
                  <div className="flex justify-center">
                    {dailyFeedback.isCritical === "success" && (
                      <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                        🔥 BẠO KÍCH CỰC ĐỈNH
                      </span>
                    )}
                    {dailyFeedback.isCritical === "disaster" && (
                      <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-rose-450 text-xs font-black uppercase tracking-widest">
                        ⚠️ ĐẠI NẠN KHÓ ĐỠ
                      </span>
                    )}
                    {dailyFeedback.isCritical === "none" && (
                      <span className="px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-stone-200 text-xs font-black uppercase tracking-widest">
                        📝 NHẬT KÝ CUỐI NGÀY
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase font-black tracking-widest block">Chuỗi hoạt động: {dailyFeedback.activityName}</span>
                    <h3 className="text-xl md:text-2xl font-display font-black text-stone-100 leading-snug">
                      {dailyFeedback.title}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-200 font-sans leading-relaxed text-left max-w-md mx-auto p-5 rounded-2xl bg-[#0d0d10] border border-zinc-900 shadow-inner font-bold">
                    {dailyFeedback.text}
                  </p>

                  {/* Impact list outputs */}
                  {Object.keys(dailyFeedback.statsImpact).length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2.5 text-xs font-black font-mono">
                      {Object.entries(dailyFeedback.statsImpact).map(([k, v]) => {
                        const numV = v as number;
                        if (numV === 0) return null;
                        const isPos = numV > 0;
                        return (
                          <span key={k} className={`px-3 py-1.5 rounded-lg ${isPos ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-450"}`}>
                            {k.toUpperCase()}: {isPos ? `+${numV}` : numV}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {dailyFeedback.ancestralDodged && (
                    <div className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mx-auto">
                      🕉️ Tổ tiên hiển linh phù hộ: Triệt tiêu mọi thiệt hại chỉ số xấu!
                    </div>
                  )}

                  <button
                    onClick={handleConfirmDailyFeedback}
                    className="w-full max-w-xs py-4 px-6 rounded-xl bg-amber-500 text-neutral-950 font-black text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest"
                  >
                    Đồng ý gác ngày cũ
                  </button>
                </motion.div>
              )}

              {/* PHASE 5: CAMPUS RANDOM EVENT SCREEN */}
              {phase === "EVENT" && activeEvent && (
                <motion.div
                  key="event"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl space-y-7"
                >
                  <div className="text-center space-y-2 border-b border-zinc-900 pb-4">
                    <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full uppercase tracking-widest inline-block">
                      ⚠️ BIẾN CỐ PHÁT SINH
                    </span>
                    <h3 className="text-xl md:text-2xl font-display font-black text-stone-100 leading-snug pt-1">{activeEvent.title}</h3>
                  </div>

                  <p className="text-sm text-stone-200 font-sans font-bold leading-relaxed p-5 rounded-2xl bg-neutral-900/30 border border-zinc-900/60 text-left">
                    {activeEvent.description}
                  </p>

                  {/* Choice option list */}
                  <div className="space-y-3">
                    {activeEvent.options.map(opt => {
                      const isSelected = choiceFeedback?.text === opt.outcome.textFeedback;
                      return (
                        <button
                          key={opt.id}
                          disabled={choiceFeedback !== null}
                          onClick={() => handleSelectEventOption(opt)}
                          className={`w-full text-left p-5 rounded-2xl border transition-all cursor-pointer block ${
                            isSelected
                              ? "bg-amber-500/10 border-amber-500/40 text-amber-200"
                              : choiceFeedback !== null
                              ? "bg-zinc-950/30 border-zinc-900 opacity-45 cursor-not-allowed"
                              : "bg-[#0f0f13]/60 border-zinc-900 hover:border-zinc-800"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-sm md:text-base font-black leading-snug">{opt.text}</span>
                            {isSelected && <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0 ml-2" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Choice feedback outcome box */}
                  <AnimatePresence>
                    {choiceFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-left space-y-4 shadow-inner"
                      >
                        <p className="text-xs md:text-sm font-bold text-stone-200 leading-relaxed font-sans">{choiceFeedback.text}</p>

                        <div className="flex flex-wrap gap-2 text-[11px] font-mono font-black">
                          {Object.entries(choiceFeedback.statsImpact).map(([k, v]) => {
                            const numV = v as number;
                            if (numV === 0) return null;
                            const isP = numV > 0;
                            return (
                              <span key={k} className={`px-2.5 py-1 rounded-lg ${isP ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-450"}`}>
                                {k.toUpperCase()}: {isP ? `+${numV}` : numV}
                              </span>
                            );
                          })}
                        </div>

                        <button
                          onClick={handleConfirmFeedback}
                          className="w-full py-4.5 rounded-xl bg-indigo-650 text-white font-black text-xs md:text-sm shadow hover:bg-indigo-650 cursor-pointer block text-center uppercase tracking-widest"
                        >
                          Tiếp tục hành trình
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* PHASE 6: SUMMARY SUCCESS GRADUATION */}
              {phase === "SUMMARY" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-xl mx-auto p-8 md:p-10 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl space-y-7 text-center"
                >
                  <div className="relative inline-block">
                    <span className="absolute inset-0 rounded-full bg-emerald-500/15 blur-xl animate-pulse"></span>
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-5xl">
                      🎉
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-black text-stone-100 uppercase tracking-widest">
                      Hoàn Thành Học Kỳ!
                    </h2>
                    <p className="text-sm font-bold text-stone-350 max-w-sm mx-auto leading-relaxed">
                      Chúc mừng bạn đã sinh tồn xuất sắc qua 14 ngày đầy bão tố của năm nhất đại học!
                    </p>
                  </div>

                  {/* Earned badge details */}
                  <div className={`p-6 rounded-2xl border ${badge.color} text-left space-y-2.5 max-w-md mx-auto shadow-md`}>
                    <span className="text-[11px] font-black uppercase tracking-widest block opacity-75">BẰNG CHỨNG NHẬN ĐẠI HỌC</span>
                    <h4 className="text-base md:text-lg font-display font-black tracking-wide leading-tight">{badge.title}</h4>
                    <p className="text-xs md:text-sm text-stone-200 leading-relaxed font-sans font-bold">{badge.description}</p>
                  </div>

                  {/* Summary GPA Score Card */}
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-2">
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-zinc-900">
                      <span className="text-[11px] text-zinc-400 block uppercase font-black tracking-wider">GPA học kỳ</span>
                      <p className="text-2xl font-display font-black text-amber-400 mt-1">{formatGPAScore(stats.gpa)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-zinc-900">
                      <span className="text-[11px] text-zinc-400 block uppercase font-black tracking-wider">Niềm Vui (Happiness)</span>
                      <p className="text-2xl font-display font-black text-sky-400 mt-1">{stats.happiness}%</p>
                    </div>
                  </div>

                  <button
                    onClick={handleRestart}
                    className="w-full max-w-xs py-4.5 rounded-xl bg-emerald-500 text-neutral-950 font-black text-sm shadow-lg hover:scale-102 active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest"
                  >
                    Bắt đầu ca chơi mới
                  </button>
                </motion.div>
              )}

              {/* PHASE 7: GAMEOVER CRITICAL DEATH */}
              {phase === "GAMEOVER" && (
                <motion.div
                  key="gameover"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-xl mx-auto p-8 rounded-3xl bg-[#0b0b0d] border border-zinc-900 shadow-2xl space-y-7 text-center animate-pulse"
                >
                  <div className="relative inline-block">
                    <span className="absolute inset-0 rounded-full bg-rose-500/10 blur-xl"></span>
                    <div className="h-20 w-20 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-5xl animate-bounce">
                      💀
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-display font-black text-rose-500 uppercase tracking-widest">
                      Kỳ Thi Thất Bại!
                    </h2>
                    <p className="text-sm font-bold text-stone-400">Năm nhất đại học quả là một đấu trường đầy chông gai...</p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#120a0c]/80 border border-rose-900/30 text-left space-y-2.5 max-w-md mx-auto shadow-md">
                    <span className="text-[11px] font-black text-rose-450 uppercase tracking-widest block opacity-75">NGUYÊN NHÂN BI KỊCH</span>
                    <p className="text-sm text-stone-200 font-sans leading-relaxed font-bold">{deathCause}</p>
                  </div>

                  <button
                    onClick={handleRestart}
                    className="w-full max-w-xs py-4.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer mx-auto block uppercase tracking-widest"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw className="h-5 w-5" />
                      <span>Thử ca chơi khác</span>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* FOOTER BAR */}
      <footer className="border-t border-zinc-950 py-6 px-4 text-center text-xs text-zinc-500 font-mono select-none">
        <p>© 2026 Freshman Survival Applet — Designed Minimalist & Bento Styled</p>
      </footer>

      {/* COMPACT VIEW HISTORY DIALOG MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <>
            <motion.div
              key="modal_backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistoryModal(false)}
              className="fixed inset-0 bg-black/85 z-[90] backdrop-blur-sm"
            />

            <motion.div
              key="modal_panel"
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="fixed inset-x-4 top-10 bottom-10 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[520px] md:h-[620px] bg-[#0c0c0f] border border-zinc-900 rounded-3xl z-[100] flex flex-col p-6 md:p-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  <h4 className="font-display font-black text-sm uppercase tracking-wider">Lịch Sử Sinh Tồn ({history.length} Ngày)</h4>
                </div>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-xs text-stone-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-xl cursor-pointer transition font-bold"
                >
                  Đóng
                </button>
              </div>

              {/* History scroll section */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4 scrollbar-none">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-zinc-650 py-12">
                    <BookmarkCheck className="h-12 w-12 text-zinc-700 mb-3 stroke-[1.5]" />
                    <p className="text-sm font-black text-zinc-500">Chưa có nhật ký ghi nhận.</p>
                    <p className="text-xs text-zinc-600 mt-1">Hoàn tất ngày chơi đầu tiên để tạo tệp lưu trữ.</p>
                  </div>
                ) : (
                  history.map((entry, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-neutral-900/40 border border-zinc-900 text-left space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-black uppercase">Ngày thứ {entry.day}</span>
                        {entry.eventTitle && (
                          <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase">Biến cố</span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-stone-100">{entry.activityName}</p>
                      {entry.eventTitle && (
                        <p className="text-xs text-zinc-400 mt-1 italic font-medium">
                          Hành xử biến cố: {entry.eventTitle}
                        </p>
                      )}

                      {/* Stat impacts */}
                      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-mono font-black">
                        {Object.entries(entry.statsImpact).map(([k, v]) => {
                          const numVal = v as number;
                          if (numVal === 0) return null;
                          const isPos = numVal > 0;
                          return (
                            <span key={k} className={`px-2 py-0.5 rounded ${isPos ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-450"}`}>
                              {k.toUpperCase()}: {isPos ? `+${numVal}` : numVal}
                            </span>
                          );
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
