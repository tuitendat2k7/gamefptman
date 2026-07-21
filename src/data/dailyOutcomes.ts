import { PlayerStats } from "../types";

export interface OutcomeDetail {
  title: string;
  text: string;
  statsImpact: Partial<PlayerStats>;
  audioEffect?: "positive" | "negative" | "over" | "select" | "tap";
}

export interface ActivityOutcomes {
  criticalSuccess: OutcomeDetail;
  criticalDisaster: OutcomeDetail;
  normalDays: OutcomeDetail[];
}

export const DAILY_OUTCOMES: Record<string, ActivityOutcomes> = {
  lecture: {
    criticalSuccess: {
      title: "🎯 Trả lời xuất sắc",
      text: "Bạn trả lời đúng câu hỏi hóc búa, cả lớp vỗ tay tán thưởng và được giảng viên cộng thẳng điểm chuyên cần.",
      statsImpact: { gpa: 12, happiness: 10, stress: -5 },
      audioEffect: "positive"
    },
    criticalDisaster: {
      title: "💀 Bị gọi tên bất ngờ",
      text: "Đang ngủ gật thì bị gọi lên bảng giải đề thi cũ. Nhìn bảng ngơ ngác, nhận điểm kém kèm lời phê nghiêm khắc.",
      statsImpact: { gpa: -10, stress: 15, happiness: -10 },
      audioEffect: "negative"
    },
    normalDays: [
      {
        title: "📚 Giờ học tập trung",
        text: "Lên lớp nghe giảng đầy đủ, ghi chép chu đáo các nội dung trọng tâm chuẩn bị thi.",
        statsImpact: {}
      },
      {
        title: "💤 Ngủ gật trong lớp",
        text: "Mưa mát rượi khiến bạn gật gù ngủ thiếp đi. Bài học trôi tuột nhưng hồi phục chút thể lực.",
        statsImpact: { gpa: -2, energy: 6, stress: -3 }
      },
      {
        title: "💬 Buôn chuyện bàn cuối",
        text: "Tụ tập tám đủ chuyện từ ăn uống đến drama với bạn bên cạnh, tiết học trôi qua cực nhanh.",
        statsImpact: { gpa: -3, happiness: 8, stress: -5 }
      }
    ]
  },
  library: {
    criticalSuccess: {
      title: "✨ Khai phá kiến thức",
      text: "Tìm được tài liệu mẫu giải đúng bài tập lớn đang bế tắc. Tiến độ đồ án tự dưng hoàn thành sớm.",
      statsImpact: { gpa: 15, stress: -10, happiness: 10 },
      audioEffect: "positive"
    },
    criticalDisaster: {
      title: "🥵 Điều hòa hỏng đột ngột",
      text: "Thư viện mất điều hòa giữa trưa nắng nóng. Không gian ngột ngạt khiến bạn nhức đầu, không học nổi chữ nào.",
      statsImpact: { energy: -15, stress: 15, gpa: -4 },
      audioEffect: "negative"
    },
    normalDays: [
      {
        title: "📖 Tập trung cày cuốc",
        text: "Đeo tai nghe và tập trung giải quyết bài tập lớn. Một ngày tự học rất hiệu quả.",
        statsImpact: {}
      },
      {
        title: "📱 Lướt mạng vô tri",
        text: "Mở laptop định học nhưng rốt cuộc dành 2 tiếng lướt mạng xã hội rồi xách balo đi về.",
        statsImpact: { gpa: -2, stress: 3, energy: -3 }
      },
      {
        title: "😴 Ngủ quên trên bàn",
        text: "Tiếng máy lạnh rì rầm dễ chịu khiến bạn gục đầu xuống bàn ngủ say sưa đến chiều.",
        statsImpact: { gpa: -1, energy: 10, stress: -8 }
      }
    ]
  },
  parttime: {
    criticalSuccess: {
      title: "💸 Nhận tiền bo hậu hĩnh",
      text: "Gặp khách hàng sộp hài lòng với phục vụ chu đáo, bo thêm số tiền lớn bằng nửa ngày lương.",
      statsImpact: { money: 20, happiness: 12, stress: -3 },
      audioEffect: "positive"
    },
    criticalDisaster: {
      title: "💔 Làm vỡ khay ly đĩa",
      text: "Vấp ngã làm rơi khay ly thủy tinh của quán. Chủ tiệm khó tính trừ thẳng tiền lương đền bù.",
      statsImpact: { money: -15, stress: 15, happiness: -10 },
      audioEffect: "negative"
    },
    normalDays: [
      {
        title: "☕ Ca làm yên bình",
        text: "Làm việc bận rộn nhưng trôi chảy, tích lũy thêm thu nhập để trang trải cuộc sống sinh viên.",
        statsImpact: {}
      },
      {
        title: "🥱 Hôm nay vắng khách",
        text: "Quán vắng hoe vì trời mưa lớn. Bạn có nhiều thời gian ngồi nghỉ và chém gió với đồng nghiệp.",
        statsImpact: { money: -1, energy: 6, stress: -5 }
      },
      {
        title: "💢 Khách hàng hạch sách",
        text: "Gặp phải vị khách cằn nhằn bắt bẻ món ăn. Bạn phải xin lỗi liên tục, tâm trạng khá ức chế.",
        statsImpact: { stress: 8, happiness: -6, energy: -5 }
      }
    ]
  },
  club: {
    criticalSuccess: {
      title: "🌟 Tỏa sáng rực rỡ",
      text: "Tham gia biểu diễn sự kiện của CLB cực kỳ thành công, trang cá nhân tăng tương tác vù vù.",
      statsImpact: { happiness: 20, stress: -12, energy: -3 },
      audioEffect: "positive"
    },
    criticalDisaster: {
      title: "🤕 Trẹo chân lúc tập luyện",
      text: "Tập nhảy quá hăng hái dẫn đến bị trật khớp chân nhẹ. Vừa đau nhức vừa phải tốn tiền mua thuốc bôi.",
      statsImpact: { energy: -15, money: -5, stress: 10, happiness: -8 },
      audioEffect: "negative"
    },
    normalDays: [
      {
        title: "🎤 Họp đội nhóm vui vẻ",
        text: "Cùng bàn kế hoạch chạy sự kiện mới và trò chuyện rôm rả, xua tan áp lực bài vở.",
        statsImpact: {}
      },
      {
        title: "📣 Chạy sự kiện vất vả",
        text: "Phải hỗ trợ dọn đồ và treo băng rôn khắp sân trường. Cơ thể khá mỏi nhưng vui vì tinh thần chung.",
        statsImpact: { energy: -8, happiness: 6, stress: 2 }
      },
      {
        title: "🍕 Ăn vặt sau buổi tập",
        text: "Cả nhóm rủ nhau đi trà chanh vỉa hè ăn bánh tráng. Tiêu chút tiền nhưng bù lại rất vui vẻ.",
        statsImpact: { money: -3, happiness: 10, stress: -6 }
      }
    ]
  },
  rest: {
    criticalSuccess: {
      title: "🛌 Giấc ngủ sâu 10 tiếng",
      text: "Ngủ một giấc sảng khoái không mộng mị. Tỉnh dậy thấy cơ thể tràn trề sinh lực, pin sạc đầy 100%.",
      statsImpact: { energy: 30, stress: -15, happiness: 8 },
      audioEffect: "positive"
    },
    criticalDisaster: {
      title: "😱 Ác mộng điểm liệt F",
      text: "Mơ thấy làm bài thi lạc đề, nhận điểm kém rớt môn thảm hại. Bạn giật mình tỉnh giấc, tim đập thình thịch.",
      statsImpact: { stress: 12, energy: 5, happiness: -6 },
      audioEffect: "negative"
    },
    normalDays: [
      {
        title: "😴 Nghỉ ngơi dưỡng sức",
        text: "Đặt điện thoại xuống, trùm chăn ngủ một giấc dài giúp phục hồi thể lực hiệu quả.",
        statsImpact: {}
      },
      {
        title: "📺 Cày phim thâu đêm",
        text: "Lỡ tay click xem bộ phim truyền hình yêu thích rồi cày một mạch đến sáng. Đuối sức nhưng sướng mắt.",
        statsImpact: { energy: -5, happiness: 8, stress: -3 }
      },
      {
        title: "🍃 Nằm ườn lười biếng",
        text: "Nằm thong thả ngắm mây qua ô cửa, gác lại mọi băn khoăn thi cử, tâm trí thư thái.",
        statsImpact: { stress: -8, energy: 10 }
      }
    ]
  },
  party: {
    criticalSuccess: {
      title: "🍲 Được bao ăn lẩu nướng",
      text: "Bạn bè trúng giải bao trọn gói bữa ăn thịnh soạn. Bạn ăn uống no nê thỏa thích mà ví vẫn nguyên vẹn.",
      statsImpact: { happiness: 20, energy: 10, money: 0, stress: -10 },
      audioEffect: "positive"
    },
    criticalDisaster: {
      title: "🚨 Gặp chốt phạt giao thông",
      text: "Vui vẻ uống chút bia rồi tự lái xe về, không may gặp chốt kiểm tra. Bị phạt nặng và giữ xe, buồn thiu.",
      statsImpact: { money: -25, stress: 20, energy: -10, happiness: -15 },
      audioEffect: "negative"
    },
    normalDays: [
      {
        title: "🍻 Hẹn hò chém gió",
        text: "Ngồi ăn vặt vỉa hè trò chuyện say sưa với đám chiến hữu, tiếng cười nói rộn rã cả góc đường.",
        statsImpact: {}
      },
      {
        title: "🥤 Cà phê check-in",
        text: "Rủ crush ra quán cà phê view đẹp chụp ảnh. Nước ngon cảnh đẹp nhưng ví sụt một chút.",
        statsImpact: { money: -5, happiness: 10, stress: -6 }
      },
      {
        title: "🎤 Hát karaoke khản cổ",
        text: "Cả hội quẩy tưng bừng gào thét giải tỏa năng lượng tiêu cực, tuy mệt nhưng sướng vô cùng.",
        statsImpact: { energy: -8, money: -4, happiness: 12, stress: -10 }
      }
    ]
  }
};
