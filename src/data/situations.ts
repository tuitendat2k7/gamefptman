/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEvent, DailyActivity } from "../types";

export const DAILY_ACTIVITIES: DailyActivity[] = [
  {
    id: "lecture",
    name: "Lên lớp Giảng đường",
    description: "Học tập trung trên lớp chính khóa để nắm kiến thức môn học.",
    icon: "GraduationCap",
    baseCost: { gpa: 6, stress: 8, energy: -12, money: 0, happiness: -2 },
    colorClass: "from-blue-500 to-indigo-600",
  },
  {
    id: "library",
    name: "Tự học ở Thư viện",
    description: "Tập trung giải quyết bài tập lớn và cày tài liệu thi cử.",
    icon: "BookOpen",
    baseCost: { gpa: 10, stress: 12, energy: -15, money: 0, happiness: -5 },
    colorClass: "from-teal-500 to-emerald-600",
  },
  {
    id: "parttime",
    name: "Làm thêm bán thời gian",
    description: "Đi làm ca bưng bê, gia sư hoặc shipper kiếm thêm tiền.",
    icon: "Coins",
    baseCost: { gpa: -3, stress: 15, energy: -20, money: 20, happiness: -6 },
    colorClass: "from-orange-500 to-amber-600",
  },
  {
    id: "club",
    name: "Sinh hoạt Câu lạc bộ",
    description: "Tham gia các hoạt động đội nhóm ngoại khóa, giao lưu.",
    icon: "Users",
    baseCost: { gpa: 0, stress: -10, energy: -15, money: -5, happiness: 18 },
    colorClass: "from-pink-500 to-rose-600",
  },
  {
    id: "rest",
    name: "Ngủ nướng hồi sức",
    description: "Nằm ườn ngủ bù dưỡng sức, giúp phục hồi năng lượng.",
    icon: "Moon",
    baseCost: { gpa: 0, stress: -18, energy: 30, money: 0, happiness: 10 },
    colorClass: "from-purple-500 to-violet-600",
  },
  {
    id: "party",
    name: "Đi đu chơi, tụ tập",
    description: "Hẹn hò, uống trà sữa, đi nhậu cùng bạn bè xả hơi.",
    icon: "CupSoda",
    baseCost: { gpa: -4, stress: -22, energy: -10, money: -10, happiness: 22 },
    colorClass: "from-cyan-500 to-blue-500",
  },
];

export const GAME_EVENTS: GameEvent[] = [
  {
    id: "e1",
    title: "Sập web đăng ký tín chỉ",
    category: "campus",
    description: "Trang web quản lý đào tạo lỗi 502 liên tục đúng giờ G đăng ký tín chỉ. Bạn làm thế nào?",
    options: [
      {
        id: "e1_o1",
        text: "Ấn F5 điên cuồng 2 tiếng",
        outcome: {
          gpa: 8,
          stress: 20,
          energy: -15,
          money: 0,
          happiness: -5,
          textFeedback: "May mắn giành được lịch học đẹp nhưng mỏi nhừ tay và stress cực kỳ."
        }
      },
      {
        id: "e1_o2",
        text: "Nằm ngủ tiếp, tối đăng ký sau",
        outcome: {
          gpa: -8,
          stress: -10,
          energy: 15,
          money: 0,
          happiness: 5,
          textFeedback: "Ngủ sướng thân nhưng khi thức dậy chỉ còn lớp thầy cô hắc búa, dễ tạch môn."
        }
      },
      {
        id: "e1_o3",
        text: "Ra quán net cỏ tốc độ cao",
        outcome: {
          gpa: 5,
          stress: 5,
          energy: -5,
          money: -5,
          happiness: 12,
          textFeedback: "Đăng ký nhanh gọn và tranh thủ làm vài ván game cực vui cùng đồng bọn."
        }
      }
    ]
  },
  {
    id: "e2",
    title: "Deadline dồn dập",
    category: "study",
    description: "Có 3 bài tập lớn phải nộp song song tuần sau, trong khi bạn mới chỉ viết xong mở bài.",
    options: [
      {
        id: "e2_o1",
        text: "Cày đêm liên tục với cafe",
        outcome: {
          gpa: 15,
          stress: 25,
          energy: -25,
          money: -3,
          happiness: -10,
          textFeedback: "Hơi suy nhược thể xác cơ mà đổi lại điểm số của bạn đạt tối đa 10/10."
        }
      },
      {
        id: "e2_o2",
        text: "Xào nấu tài liệu trên mạng",
        outcome: {
          gpa: 5,
          stress: 5,
          energy: 5,
          money: 0,
          happiness: 5,
          textFeedback: "Bị trừ chút điểm trùng lặp nhưng đổi lại nhàn hạ trút bỏ gánh nặng."
        }
      },
      {
        id: "e2_o3",
        text: "Xin thầy khất thêm hạn nộp",
        outcome: {
          gpa: -3,
          stress: -15,
          energy: 10,
          money: 0,
          happiness: 10,
          textFeedback: "Thầy từ chối khất, bù lại đám bạn đem cơm đến an ủi nên vơi bớt stress."
        }
      }
    ]
  },
  {
    id: "e3",
    title: "Đồng bọn 'gánh tạ' nhóm",
    category: "social",
    description: "Nhóm thuyết trình 5 người thì 3 người biến mất, 1 người chỉ thả 👍 trên tin nhắn nhóm.",
    options: [
      {
        id: "e3_o1",
        text: "Tự gánh hết 100% đồ án",
        outcome: {
          gpa: 14,
          stress: 25,
          energy: -20,
          money: 0,
          happiness: -15,
          textFeedback: "Bài thuyết trình tuyệt vời, nhóm điểm cao nhưng bạn vô cùng mỏi mệt."
        }
      },
      {
        id: "e3_o2",
        text: "Mách thầy xin gạch tên họ",
        outcome: {
          gpa: 6,
          stress: 15,
          energy: -5,
          money: 0,
          happiness: 8,
          textFeedback: "Được khen ngợi bản lĩnh, cả nhóm kia tạch môn, nhưng có chút drama bàn tán."
        }
      },
      {
        id: "e3_o3",
        text: "Cũng bơ luôn, làm sơ sài",
        outcome: {
          gpa: -12,
          stress: -15,
          energy: 12,
          money: 0,
          happiness: 10,
          textFeedback: "Nhận điểm kém nhưng chẳng ai giận ai vì ai cũng... lười như nhau."
        }
      }
    ]
  },
  {
    id: "e4",
    title: "Cháy túi giữa tháng",
    category: "money",
    description: "Tài khoản ngân hàng còn đúng 150k trong khi còn hẳn 2 tuần nữa mới đến ngày gửi tiền tiếp tế.",
    options: [
      {
        id: "e4_o1",
        text: "Ăn mì gói qua ngày",
        outcome: {
          gpa: -2,
          stress: 15,
          energy: -22,
          money: 10,
          happiness: -12,
          textFeedback: "Người uể oải rã rời do thiếu chất nhưng ví tiền vẫn giữ được qua kỳ hạn."
        }
      },
      {
        id: "e4_o2",
        text: "Xin ăn ké bạn cùng phòng",
        outcome: {
          gpa: 0,
          stress: 5,
          energy: 10,
          money: 5,
          happiness: 5,
          textFeedback: "Được bạn bao nuôi cơm canh đầm ấm, đổi lại bạn nhận rửa bát dọn dẹp 1 tuần."
        }
      },
      {
        id: "e4_o3",
        text: "Cầm tạm đồ dùng lấy tiền",
        outcome: {
          gpa: 0,
          stress: 20,
          energy: 5,
          money: 25,
          happiness: -10,
          textFeedback: "Cầm tạm chiếc loa Bluetooth lấy tiền tiêu, ví đầy lại nhưng lòng xót xa."
        }
      }
    ]
  },
  {
    id: "e5",
    title: "Kiểm tra bất chợt",
    category: "exam",
    description: "Thầy bước vào với nụ cười bí hiểm: 'Các em cất sách vở, làm bài kiểm tra 15 phút đầu giờ.'",
    options: [
      {
        id: "e5_o1",
        text: "Làm bằng thực lực bản thân",
        outcome: {
          gpa: 6,
          stress: 12,
          energy: -8,
          money: 0,
          happiness: 5,
          textFeedback: "Nhớ mang máng, làm được một nửa nhưng cực kỳ tự hào vì tinh thần trung thực."
        }
      },
      {
        id: "e5_o2",
        text: "Dùng phao tài liệu gầm bàn",
        outcome: {
          gpa: 12,
          stress: 28,
          energy: -12,
          money: 0,
          happiness: -2,
          textFeedback: "Tim đập thon thót muốn nhảy ra ngoài, may mắn lách được mắt thầy cô hắc búa."
        }
      },
      {
        id: "e5_o3",
        text: "Giả vờ đau bụng chạy ra ngoài",
        outcome: {
          gpa: -5,
          stress: -5,
          energy: 5,
          money: 0,
          happiness: 5,
          textFeedback: "Trốn được bài hôm nay nhưng tuần sau phải lên làm đề dự phòng khó gấp đôi."
        }
      }
    ]
  },
  {
    id: "e6",
    title: "Cơ thể bị cúm ốm sốt",
    category: "health",
    description: "Thức khuya ôn bài cộng thời tiết ẩm ương khiến bạn thức dậy nóng ran, đau đầu mỏi mệt.",
    options: [
      {
        id: "e6_o1",
        text: "Uống thuốc rồi nằm lướt máy",
        outcome: {
          gpa: -4,
          stress: 10,
          energy: 12,
          money: -3,
          happiness: 2,
          textFeedback: "Cơn sốt giảm bớt nhưng bỏ lỡ bài học khiến kiến thức bị hụt một ít."
        }
      },
      {
        id: "e6_o2",
        text: "Gượng dậy lết xác đi học",
        outcome: {
          gpa: 5,
          stress: 22,
          energy: -28,
          money: 0,
          happiness: -15,
          textFeedback: "Cố học hết buổi, đầu óc quay cuồng khiến bạn trông uể oải thảm hại."
        }
      },
      {
        id: "e6_o3",
        text: "Cầu cứu bạn mua cháo hộ",
        outcome: {
          gpa: -2,
          stress: -10,
          energy: 20,
          money: -2,
          happiness: 18,
          textFeedback: "Được tẩm bổ tô cháo hành ấm áp, tình bạn thăng hoa nồng ấm trân quý."
        }
      }
    ]
  },
  {
    id: "e7",
    title: "Hội trại SV náo nhiệt",
    category: "campus",
    description: "Trường mở hội trại quy mô toàn khóa, tiếng loa đài náo nhiệt thôi thúc bạn gác bài vở đi chơi.",
    options: [
      {
        id: "e7_o1",
        text: "Quẩy hết mình cùng cả lớp",
        outcome: {
          gpa: -3,
          stress: -20,
          energy: -15,
          money: -5,
          happiness: 25,
          textFeedback: "Vui quên lối về! Có thêm cả tá ảnh dìm và làm quen được bao nhiêu bạn mới."
        }
      },
      {
        id: "e7_o2",
        text: "Chụp ảnh dạo hỗ trợ lớp",
        outcome: {
          gpa: 0,
          stress: -10,
          energy: -8,
          money: 5,
          happiness: 12,
          textFeedback: "Được cả lớp khen ngợi, lại còn nhận được chút tiền công nước nôi chụp ảnh."
        }
      },
      {
        id: "e7_o3",
        text: "Ở nhà trùm chăn học bài",
        outcome: {
          gpa: 10,
          stress: 5,
          energy: 10,
          money: 0,
          happiness: -5,
          textFeedback: "Trí tuệ thăng hoa nhưng nhìn story mọi người đi chơi lòng dấy lên nỗi sợ bỏ lỡ."
        }
      }
    ]
  },
  {
    id: "e8",
    title: "Mất laptop trước giờ báo cáo",
    category: "study",
    description: "Để laptop ngoài bàn ăn khu tự học rồi đi lấy nước, quay lại thì máy đã không cánh mà bay.",
    options: [
      {
        id: "e8_o1",
        text: "Nhờ bảo vệ check camera",
        outcome: {
          gpa: 0,
          stress: 25,
          energy: -15,
          money: 0,
          happiness: -8,
          textFeedback: "Xác định được kẻ gian nhưng cần thời gian xử lý, bạn mất một ngày lo lắng."
        }
      },
      {
        id: "e8_o2",
        text: "Mượn máy làm lại xuyên đêm",
        outcome: {
          gpa: 8,
          stress: 30,
          energy: -25,
          money: 0,
          happiness: -12,
          textFeedback: "Cày cuốc khôi phục file từ Driver, mệt bã người nhưng giữ được điểm báo cáo."
        }
      },
      {
        id: "e8_o3",
        text: "Đăng tin tìm kiếm Confession",
        outcome: {
          gpa: -5,
          stress: 15,
          energy: 5,
          money: -4,
          happiness: 5,
          textFeedback: "Nhận được nhiều lượt tương tác chia buồn nhưng laptop thì không bao giờ về."
        }
      }
    ]
  },
  {
    id: "e9",
    title: "Buổi hẹn hò đầu tiên",
    category: "social",
    description: "Bạn được một người bạn siêu dễ thương ngỏ ý rủ đi uống trà sữa dạo phố tối nay.",
    options: [
      {
        id: "e9_o1",
        text: "Sắm sửa đồ đẹp, đi ăn sang",
        outcome: {
          gpa: -4,
          stress: -15,
          energy: -12,
          money: -22,
          happiness: 28,
          textFeedback: "Buổi hẹn cực kỳ lãng mạn, vui vẻ nhưng ví tiền sụt giảm thê thảm."
        }
      },
      {
        id: "e9_o2",
        text: "Đi ăn vỉa hè, chia đôi tiền",
        outcome: {
          gpa: -2,
          stress: -10,
          energy: -5,
          money: -5,
          happiness: 15,
          textFeedback: "Tuy thiếu chút mộng mơ nhưng đối phương đánh giá cao sự thực tế của bạn."
        }
      },
      {
        id: "e9_o3",
        text: "Từ chối để ở nhà học bài",
        outcome: {
          gpa: 12,
          stress: 10,
          energy: 8,
          money: 0,
          happiness: -15,
          textFeedback: "Bảo vệ điểm thi vững chắc nhưng nhìn người ta có đôi có cặp lòng buồn thiu."
        }
      }
    ]
  },
  {
    id: "e10",
    title: "Trễ giờ đóng cửa phòng thi",
    category: "exam",
    description: "Trời mưa ngập đường khiến xe buýt trễ, bạn chạy tới phòng thi thì thầy đã khóa cửa.",
    options: [
      {
        id: "e10_o1",
        text: "Năn nỉ xin thầy tha thứ",
        outcome: {
          gpa: 4,
          stress: 30,
          energy: -15,
          money: 0,
          happiness: -10,
          textFeedback: "Thầy mắng xối xả nhưng nể tình cho vào thi đề phụ. Stress cực độ."
        }
      },
      {
        id: "e10_o2",
        text: "Đóng tiền học lại kỳ sau",
        outcome: {
          gpa: -16,
          stress: -10,
          energy: 10,
          money: -20,
          happiness: -8,
          textFeedback: "Cay đắng vì mất oan khoản tiền học phí, đổi lại có một ngày ngủ thảnh thơi."
        }
      },
      {
        id: "e10_o3",
        text: "Lên xin hoãn thi chính đáng",
        outcome: {
          gpa: -2,
          stress: 15,
          energy: -8,
          money: -3,
          happiness: 2,
          textFeedback: "Làm đơn hoãn thi thành công để thi đợt phụ, tốn công đi xin chữ ký."
        }
      }
    ]
  },
  {
    id: "e11",
    title: "Tiệc sinh nhật sếp làm thêm",
    category: "money",
    description: "Tiệm part-time tổ chức sinh nhật cho anh quản lý, đồng nghiệp rủ quyên góp sắm quà xịn.",
    options: [
      {
        id: "e11_o1",
        text: "Góp luôn 200k dù ví xẹp",
        outcome: {
          gpa: 0,
          stress: 5,
          energy: -10,
          money: -12,
          happiness: 12,
          textFeedback: "Được sếp chú ý và hứa ưu ái xếp cho ca làm nhàn nhã hơn."
        }
      },
      {
        id: "e11_o2",
        text: "Nói khéo em nghèo, chúc miệng",
        outcome: {
          gpa: 0,
          stress: 10,
          energy: 5,
          money: 0,
          happiness: -2,
          textFeedback: "Giữ được tiền nhưng bị đồng nghiệp xì xào là keo kiệt."
        }
      },
      {
        id: "e11_o3",
        text: "Làm một tấm thiệp viết tay",
        outcome: {
          gpa: 0,
          stress: -2,
          energy: -5,
          money: -2,
          happiness: 15,
          textFeedback: "Sếp rất cảm động vì món quà tinh thần ý nghĩa, khen ngợi bạn khéo tay."
        }
      }
    ]
  },
  {
    id: "e12",
    title: "Drama cùng phòng trọ",
    category: "social",
    description: "Bạn chung phòng lười rửa bát, rác đầy không đổ lại hay dắt người yêu về tâm sự ồn ào.",
    options: [
      {
        id: "e12_o1",
        text: "Họp phòng làm rõ sòng phẳng",
        outcome: {
          gpa: 0,
          stress: 18,
          energy: -8,
          money: 0,
          happiness: 5,
          textFeedback: "Cãi vã một trận nảy lửa nhưng phòng trọ sạch sẽ hẳn, bớt lộn xộn."
        }
      },
      {
        id: "e12_o2",
        text: "Dọn hộ rồi bóc phốt ẩn danh",
        outcome: {
          gpa: -2,
          stress: 10,
          energy: -12,
          money: 0,
          happiness: 8,
          textFeedback: "Hả hê vì cộng đồng mạng bênh vực, nhưng cơ thể bạn dọn dẹp mệt nhoài."
        }
      },
      {
        id: "e12_o3",
        text: "Dọn hành lý chuyển phòng mới",
        outcome: {
          gpa: -3,
          stress: 15,
          energy: -22,
          money: -15,
          happiness: 15,
          textFeedback: "Giải thoát tinh thần! Dù tốn mớ tiền cọc và tốn sức khuân vác hành lý."
        }
      }
    ]
  },
  {
    id: "e13",
    title: "Mời gia nhập Đội nòng cốt",
    category: "campus",
    description: "Trưởng khoa đề xuất đặc cách bạn tham gia Đội Truyền thông nòng cốt, cơ hội vàng nâng CV.",
    options: [
      {
        id: "e13_o1",
        text: "Đồng ý, cống hiến hết mình",
        outcome: {
          gpa: 5,
          stress: 15,
          energy: -18,
          money: -2,
          happiness: 15,
          textFeedback: "Vụt sáng thành gương mặt truyền thông năng nổ, được nhiều thầy cô nhớ mặt."
        }
      },
      {
        id: "e13_o2",
        text: "Từ chối để tập trung GPA",
        outcome: {
          gpa: 14,
          stress: -10,
          energy: 10,
          money: 0,
          happiness: -5,
          textFeedback: "Thầy tiếc nuối nhưng bạn có thêm nhiều thời gian cày cuốc đống giáo trình thi."
        }
      },
      {
        id: "e13_o3",
        text: "Nhận lời nhưng làm việc nhẹ",
        outcome: {
          gpa: 2,
          stress: 2,
          energy: -5,
          money: 0,
          happiness: 5,
          textFeedback: "Lướt sóng an toàn, vừa có danh tiếng vừa không lo quá tải bài vở."
        }
      }
    ]
  },
  {
    id: "e14",
    title: "Học phí đầu tư ảo Crypto",
    category: "money",
    description: "Nghe lời giới thiệu một đồng coin lạ x100 tài khoản, bạn nảy ý định lấy 3 triệu tiền học phí chơi thử.",
    options: [
      {
        id: "e14_o1",
        text: "Tất tay luôn mong đổi đời",
        outcome: {
          gpa: -4,
          stress: 30,
          energy: -5,
          money: -30,
          happiness: -25,
          textFeedback: "Coin chia 10 tài khoản sau 2 ngày, thẫn thờ mất ngủ vì lỡ mất tiền học phí."
        }
      },
      {
        id: "e14_o2",
        text: "Trải nghiệm 200k biết mùi",
        outcome: {
          gpa: 0,
          stress: 5,
          energy: 0,
          money: -2,
          happiness: 2,
          textFeedback: "Mất bát phở ngon nhưng nhận được bài học thực tế đắt giá về tiền nong."
        }
      },
      {
        id: "e14_o3",
        text: "Gửi tiết kiệm ngân hàng",
        outcome: {
          gpa: 0,
          stress: -5,
          energy: 5,
          money: 5,
          happiness: 5,
          textFeedback: "Chậm mà chắc! Có thêm chút tiền lãi nhỏ, ngủ ngon giấc không phải lo nghĩ."
        }
      }
    ]
  },
  {
    id: "e15",
    title: "Bạn thân gian lận thi cử",
    category: "study",
    description: "Trong giờ thi cuối kỳ, bạn thấy đứa bạn thân quay cóp tài liệu giấu trong tay áo.",
    options: [
      {
        id: "e15_o1",
        text: "Lờ đi lo làm bài mình",
        outcome: {
          gpa: 4,
          stress: 5,
          energy: -5,
          money: 0,
          happiness: 2,
          textFeedback: "Nó qua môn cười hớn hở cảm ơn bạn vì đã che chắn giúp."
        }
      },
      {
        id: "e15_o2",
        text: "Báo cáo thầm lặng với thầy",
        outcome: {
          gpa: 0,
          stress: 15,
          energy: -5,
          money: 0,
          happiness: -15,
          textFeedback: "Nó bị lập biên bản kỷ luật. Công bằng được giữ nhưng lòng bạn trĩu nặng."
        }
      },
      {
        id: "e15_o3",
        text: "Nhắc nhở nó cất nhanh đi",
        outcome: {
          gpa: 2,
          stress: 12,
          energy: -5,
          money: 0,
          happiness: 12,
          textFeedback: "Nó giật mình cất kịp thời, thầm cảm ơn vì pha cứu nguy xuất sắc."
        }
      }
    ]
  }
];
