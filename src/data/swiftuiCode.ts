export const SWIFTUI_GAME_CODE = `import SwiftUI

// MARK: - Core Types & Models
struct PlayerStats {
    var gpa: Double = 8.0          // 0.0 to 10.0 (where 10.0 corresponds to 4.0 GPA)
    var stress: Double = 30.0     // 0 to 100 (căng thẳng)
    var energy: Double = 90.0     // 0 to 100 (năng lượng)
    var money: Double = 60.0      // 0 to 100 (tiền tệ)
    var happiness: Double = 75.0  // 0 to 100 (hạnh phúc)
    
    var formattedGPA: String {
        let actualGpa = (gpa * 4.0) / 10.0
        return String(format: "%.2f/4.0", actualGpa)
    }
}

struct OptionOutcome {
    let gpa: Double
    let stress: Double
    let energy: Double
    let money: Double
    let happiness: Double
    let textFeedback: String
}

struct ChoiceOption: Identifiable {
    let id = UUID()
    let text: String
    let outcome: OptionOutcome
}

struct GameEvent: Identifiable {
    let id: String
    let title: String
    let category: String // study, social, health, money, campus, exam
    let description: String
    let options: [ChoiceOption]
}

struct DailyActivity: Identifiable {
    let id: String
    let name: String
    let description: String
    let icon: String // SF Symbol Name
    let gpaChange: Double
    let stressChange: Double
    let energyChange: Double
    let moneyChange: Double
    let happinessChange: Double
    let gradientColors: [Color]
}

enum GamePhase {
    case start
    case intro
    case gameplay
    case event
    case summary
    case gameover
}

struct GameHistoryEntry: Identifiable {
    let id = UUID()
    let day: Int
    let activityName: String
    let eventTitle: String?
    let statsImpact: [String: Double]
}

// MARK: - Dummy Data for SwiftUI Game
struct GameData {
    static let activities: [DailyActivity] = [
        DailyActivity(id: "lecture", name: "Lên lớp Giảng đường", description: "Nghe thầy cô giảng bài, tránh bị cấm thi.", icon: "cap.graduation", gpaChange: 0.6, stressChange: 8, energyChange: -12, moneyChange: 0, happinessChange: -2, gradientColors: [.blue, .indigo]),
        DailyActivity(id: "library", name: "Tự học ở Thư viện", description: "Chui vô góc máy lạnh yên tĩnh cày bài tập lớn.", icon: "book.closed", gpaChange: 1.0, stressChange: 12, energyChange: -15, moneyChange: 0, happinessChange: -5, gradientColors: [.teal, .green]),
        DailyActivity(id: "parttime", name: "Làm thêm bán thời gian", description: "Làm barista hoặc shipper kiếm thêm thu nhập.", icon: "dollarsign.circle", gpaChange: -0.3, stressChange: 15, energyChange: -20, moneyChange: 20, happinessChange: -6, gradientColors: [.orange, .yellow]),
        DailyActivity(id: "club", name: "Sinh hoạt Câu lạc bộ", description: "Tập văn nghệ chạy truyền thông thăng hoa.", icon: "person.3", gpaChange: 0, stressChange: -10, energyChange: -15, moneyChange: -5, happinessChange: 18, gradientColors: [.pink, .red]),
        DailyActivity(id: "rest", name: "Ngủ nướng hồi sức", description: "Đắp chăn ấm áp ngủ một mạch tới chiều.", icon: "moon.stars", gpaChange: 0, stressChange: -18, energyChange: 30, moneyChange: 0, happinessChange: 10, gradientColors: [.purple, .indigo]),
        DailyActivity(id: "party", name: "Đi đu đưa, nhậu nhẹt", description: "Rủ đám bạn lẩu nướng thâu đêm vui vẻ.", icon: "wineglass", gpaChange: -0.4, stressChange: -22, energyChange: -10, moneyChange: -10, happinessChange: 22, gradientColors: [.cyan, .blue])
    ]
    
    static let events: [GameEvent] = [
        GameEvent(id: "e1", title: "Hệ thống đăng ký tín chỉ sập", category: "campus", description: "Đúng 8 giờ sáng ngày đăng ký tín chỉ lực học kỳ, web báo lỗi 502 Bad Gateway quay vòng vô tận. Bạn sẽ làm gì?", options: [
            ChoiceOption(text: "Ấn F5 điên cuồng liên tục 2 tiếng", outcome: OptionOutcome(gpa: 0.8, stress: 20, energy: -15, money: 0, happiness: -5, textFeedback: "Bạn may mắn giành được suất học thầy cô hiền, nhưng mỏi nhừ tay và tăng xông xém chút đập chuột!")),
            ChoiceOption(text: "Nằm ngủ tiếp, khuya dậy đăng ký sau", outcome: OptionOutcome(gpa: -0.8, stress: -10, energy: 15, money: 0, happiness: 5, textFeedback: "Ngủ sướng thân nhưng khi tỉnh dậy bạn bị dồn vào lớp thầy cô siêu hắc búa, tỷ lệ tạch môn cao!")),
            ChoiceOption(text: "Kéo đồng bọn ra net cỏ tốc độ cao", outcome: OptionOutcome(gpa: 0.5, stress: 5, energy: -5, money: -5, happiness: 12, textFeedback: "Vừa đăng ký bài bản xong vừa làm vài trận game, mất tý tiền net cơ mà quá xá đã!"))
        ]),
        GameEvent(id: "e2", title: "Bài tập lớn - Deadline dồn dập", category: "study", description: "Tuần sau có 3 bài tập lớn phải nộp song song, sự stress bắt đầu lên đỉnh điểm.", options: [
            ChoiceOption(text: "Cày ngày đêm, dùng cà phê thay nước", outcome: OptionOutcome(gpa: 1.5, stress: 25, energy: -25, money: -3, happiness: -10, textFeedback: "Gương mặt hốc hác cơ mà điểm số hoàn hảo tuyệt đối!")),
            ChoiceOption(text: "Tham khảo mạng rồi xào nấu sơ", outcome: OptionOutcome(gpa: 0.5, stress: 5, energy: 5, money: 0, happiness: 5, textFeedback: "Bị phát hiện trùng lặp 30% nội dung, ăn điểm 5 vớt vát cơ mà nhàn nhã.")),
            ChoiceOption(text: "Gào thét xin khất deadline sang tuần sau", outcome: OptionOutcome(gpa: -0.3, stress: -15, energy: 10, money: 0, happiness: 10, textFeedback: "Thầy từ chối khất, nhưng được đám bạn thương đem cơm hộp cứu trợ."))
        ])
    ]
}

// MARK: - Subviews: Circular Ring
struct StatRingView: View {
    let title: String
    let value: Double
    let maxVal: Double = 100.0
    let color: Color
    let iconName: String
    let subText: String?
    var isUrgent: Bool = false
    
    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                if isUrgent {
                    Circle()
                        .stroke(color.opacity(0.3), lineWidth: 4)
                        .scaleEffect(1.1)
                        .animation(Animation.easeInOut(duration: 0.8).repeatForever(autoreverses: true), value: isUrgent)
                }
                
                Circle()
                    .stroke(Color.gray.opacity(0.15), lineWidth: 3.5)
                
                Circle()
                    .trim(from: 0.0, to: CGFloat(min(value / maxVal, 1.0)))
                    .stroke(color, style: StrokeStyle(lineWidth: 3.5, lineCap: .round))
                    .rotationEffect(Angle(degrees: -90))
                    .animation(.easeOut(duration: 0.6), value: value)
                
                Image(systemName: iconName)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(isUrgent ? .red : .white)
            }
            .frame(width: 44, height: 44)
            
            Text(title)
                .font(.system(size: 9, weight: .bold))
                .foregroundColor(.gray)
            
            Text(subText ?? String(format: "%.0f%%", value))
                .font(.system(size: 10, weight: .heavy))
                .foregroundColor(isUrgent ? .red : .white)
        }
    }
}

// MARK: - Main SwiftUI Gameplay View
struct ContentView: View {
    // Game States
    @State private var phase: GamePhase = .start
    @State private var playerName: String = "Nguyễn Văn Đạt"
    @State private var major: String = "IT"
    @State private var currentDay = 1
    @State private var stats = PlayerStats()
    @State private var selectedActivity: DailyActivity? = nil
    @State private var activeEvent: GameEvent? = nil
    @State private var choiceFeedback: String? = nil
    @State private var deathCause: String = ""
    @State private var history: [GameHistoryEntry] = []
    
    let totalDays = 20
    
    var body: some View {
        ZStack {
            // Sophisticated Dark OLED Background
            Color(hex: "0a0a0c")
                .ignoresSafeArea()
            
            VStack {
                switch phase {
                case .start:
                    startScreen
                case .intro:
                    introScreen
                case .gameplay:
                    gameplayScreen
                case .event:
                    eventScreen
                case .summary:
                    summaryScreen
                case .gameover:
                    gameoverScreen
                }
            }
            .padding()
        }
    }
    
    // MARK: - Screen Views
    private var startScreen: some View {
        VStack(spacing: 24) {
            Spacer()
            
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(LinearGradient(colors: [.indigo, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(width: 100, height: 100)
                        .shadow(color: .indigo.opacity(0.3), radius: 10)
                    
                    Image(systemName: "cap.graduation")
                        .font(.system(size: 44))
                        .foregroundColor(.white)
                }
                
                Text("FRESHMAN")
                    .font(.system(size: 38, weight: .black, design: .rounded))
                    .foregroundColor(.blue)
                
                Text("SURVIVAL GAME")
                    .font(.system(size: 22, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
            
            Text("Hãy nhập cuộc chơi sinh tồn học kỳ đầu tiên đầy sóng gió giảng đường. Bạn có bảo toàn được GPA rực rỡ và túi tiền nguyên vẹn?")
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Spacer()
            
            Button {
                phase = .intro
            } label: {
                Text("BẮT ĐẦU NHẬP HỌC")
                    .font(.headline)
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(16)
                    .padding(.horizontal)
            }
        }
    }
    
    private var introScreen: some View {
        VStack(alignment: .leading, spacing: 20) {
            Text("HỒ SƠ TÂN SỰ")
                .font(.caption)
                .fontWeight(.bold)
                .foregroundColor(.indigo)
            
            Text("Thiết Lập Sinh Viên")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(.white)
            
            VStack(alignment: .leading, spacing: 8) {
                Text("Họ và Tên:")
                    .font(.caption)
                    .foregroundColor(.gray)
                
                TextField("Ví dụ: Nguyễn Văn Đạt", text: $playerName)
                    .padding()
                    .background(Color(hex: "121214"))
                    .cornerRadius(12)
                    .foregroundColor(.white)
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.2), lineWidth: 1))
            }
            
            Text("Lựa chọn Chuyên ngành:")
                .font(.caption)
                .foregroundColor(.gray)
            
            VStack(spacing: 12) {
                majorButton(title: "Công Nghệ Thông Tin", icon: "cpu", code: "IT", desc: "GPA xuất sắc, Stress cao, Cạn pin nhanh")
                majorButton(title: "Quản Trị Kinh Doanh", icon: "briefcase", code: "BIZ", desc: "Tài chính dư dả, Điểm vừa tầm")
                majorButton(title: "Ngôn Ngữ Anh", icon: "globe", code: "LANG", desc: "Hạnh phúc ngập tràn, Ít áp lực")
            }
            
            Spacer()
            
            Button {
                if !playerName.isEmpty {
                    setupInitialStats()
                    phase = .gameplay
                }
            } label: {
                Text("BƯỚC VÀO GIẢNG ĐƯỜNG")
                    .font(.headline)
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(16)
            }
        }
    }
    
    private var gameplayScreen: some View {
        VStack(spacing: 16) {
            // Top HUD
            HStack {
                VStack(alignment: .leading) {
                    Text(playerName)
                        .font(.headline)
                        .foregroundColor(.white)
                    Text(major == "IT" ? "Công Nghệ Thông Tin" : (major == "BIZ" ? "Quản Trị Kinh Doanh" : "Ngôn Ngữ Anh"))
                        .font(.caption2)
                        .foregroundColor(.indigo)
                }
                Spacer()
                VStack(alignment: .trailing) {
                    Text("TIẾN ĐỘ")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(.gray)
                    Text("Ngày \\(currentDay)/\\(totalDays)")
                        .font(.subheadline)
                        .fontWeight(.semibold)
                        .foregroundColor(.blue)
                }
            }
            .padding()
            .background(Color(hex: "121214"))
            .cornerRadius(16)
            
            // HUD STAT RINGS
            HStack(spacing: 8) {
                StatRingView(title: "GPA", value: stats.gpa * 10, color: .orange, iconName: "cap.graduation", subText: stats.formattedGPA, isUrgent: stats.gpa < 4.0)
                Spacer()
                StatRingView(title: "STRESS", value: stats.stress, color: .green, iconName: "bolt.fill", subText: nil, isUrgent: stats.stress > 80.0)
                Spacer()
                StatRingView(title: "PIN", value: stats.energy, color: .blue, iconName: "battery.100", subText: nil, isUrgent: stats.energy < 25.0)
                Spacer()
                StatRingView(title: "TIỀN", value: stats.money, color: .purple, iconName: "dollarsign.circle", subText: nil, isUrgent: stats.money < 20.0)
                Spacer()
                StatRingView(title: "HẠNH PHÚC", value: stats.happiness, color: .yellow, iconName: "smiley", subText: nil, isUrgent: stats.happiness < 25.0)
            }
            .padding()
            .background(Color(hex: "121214"))
            .cornerRadius(20)
            
            HStack {
                Text("Lựa chọn sinh hoạt hôm nay:")
                    .font(.caption)
                    .bold()
                    .foregroundColor(.gray)
                Spacer()
            }
            .padding(.top, 8)
            
            // Activities lists
            ScrollView(.vertical, showsIndicators: false) {
                VStack(spacing: 10) {
                    ForEach(GameData.activities) { act in
                        Button {
                            perform(activity: act)
                        } label: {
                            HStack {
                                ZStack {
                                    RoundedRectangle(cornerRadius: 12)
                                        .fill(LinearGradient(colors: act.gradientColors, startPoint: .topLeading, endPoint: .bottomTrailing))
                                        .frame(width: 40, height: 40)
                                    Image(systemName: act.icon)
                                        .foregroundColor(.white)
                                }
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(act.name)
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(.white)
                                    Text(act.description)
                                        .font(.system(size: 10))
                                        .foregroundColor(.gray)
                                        .lineLimit(1)
                                }
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            .padding(12)
                            .background(Color(hex: "121214"))
                            .cornerRadius(16)
                        }
                    }
                }
            }
        }
    }
    
    private var eventScreen: some View {
        VStack(spacing: 20) {
            Spacer()
            
            Text("⚠️ BIẾN CỐ BẤT NGỜ")
                .font(.caption2)
                .bold()
                .foregroundColor(.orange)
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(Color.orange.opacity(0.1))
                .cornerRadius(8)
            
            if let event = activeEvent {
                Text(event.title)
                    .font(.title3)
                    .bold()
                    .foregroundColor(.white)
                    .multilineTextAlignment(.center)
                
                Text(event.description)
                    .font(.subheadline)
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.center)
                    .padding()
                    .background(Color(hex: "121214"))
                    .cornerRadius(16)
                
                Spacer()
                
                if let feedback = choiceFeedback {
                    VStack(spacing: 12) {
                        Text("Kết quả chuyến đi:")
                            .font(.caption)
                            .bold()
                            .foregroundColor(.green)
                        Text(feedback)
                            .font(.body)
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                        
                        Button {
                            confirmEventOutcome()
                        } label: {
                            Text("TIẾP TỤC ĐẠI HỌC")
                                .bold()
                                .foregroundColor(.black)
                                .frame(maxWidth: .infinity)
                                .padding()
                                .background(Color.white)
                                .cornerRadius(12)
                        }
                    }
                    .padding()
                    .background(Color(hex: "1a1a1f"))
                    .cornerRadius(20)
                } else {
                    VStack(spacing: 10) {
                        ForEach(event.options) { option in
                            Button {
                                handleChoice(option: option)
                            } label: {
                                Text(option.text)
                                    .font(.subheadline)
                                    .bold()
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .padding()
                                    .background(Color(hex: "121214"))
                                    .cornerRadius(12)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.15), lineWidth: 1))
                            }
                        }
                    }
                }
            }
        }
    }
    
    private var summaryScreen: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "crown")
                .font(.system(size: 60))
                .foregroundColor(.yellow)
            
            Text("TỐT NGHIỆP HỌC KỲ!")
                .font(.title2)
                .bold()
                .foregroundColor(.yellow)
            
            Text("Chúc mừng sinh viên \\(playerName) đã sống sót trọn vẹn 20 ngày qua sóng gió của học kỳ thứ 1.")
                .font(.subheadline)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
            
            VStack(spacing: 12) {
                HStack {
                    Text("GPA chung cuộc:")
                    Spacer()
                    Text(stats.formattedGPA)
                        .bold()
                        .foregroundColor(.orange)
                }
                Divider().background(Color.gray.opacity(0.2))
                HStack {
                    Text("Stress:")
                    Spacer()
                    Text(String(format: "%.0f%%", stats.stress))
                }
                HStack {
                    Text("Tài chính còn lại:")
                    Spacer()
                    Text(String(format: "%.0f%%", stats.money))
                }
            }
            .padding()
            .background(Color(hex: "121214"))
            .cornerRadius(16)
            
            Spacer()
            
            Button {
                resetGame()
            } label: {
                Text("CHƠI CA MỚI")
                    .bold()
                    .foregroundColor(.black)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(12)
            }
        }
    }
    
    private var gameoverScreen: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 60))
                .foregroundColor(.red)
            
            Text("BỊ ĐÌNH CHỈ HỌC TẬP")
                .font(.title2)
                .bold()
                .foregroundColor(.red)
            
            Text(deathCause)
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding()
                .background(Color(hex: "121214"))
                .cornerRadius(16)
            
            Spacer()
            
            Button {
                resetGame()
            } label: {
                Text("CHUYỂN TRƯỜNG / CHƠI LẠI")
                    .bold()
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.red)
                    .cornerRadius(12)
            }
        }
    }
    
    // MARK: - Helper Methods & Buttons
    private func majorButton(title: String, icon: String, code: String, desc: String) -> some View {
        Button {
            major = code
        } label: {
            HStack {
                Image(systemName: icon)
                    .font(.headline)
                    .foregroundColor(major == code ? .indigo : .gray)
                    .frame(width: 32)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline)
                        .bold()
                        .foregroundColor(.white)
                    Text(desc)
                        .font(.caption2)
                        .foregroundColor(.gray)
                }
                Spacer()
                if major == code {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(.indigo)
                }
            }
            .padding()
            .background(Color(hex: "121214"))
            .cornerRadius(12)
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(major == code ? Color.indigo : Color.clear, lineWidth: 1.5))
        }
    }
    
    private func setupInitialStats() {
        if major == "IT" {
            stats = PlayerStats(gpa: 8.5, stress: 45, energy: 80, money: 50, happiness: 70)
        } else if major == "BIZ" {
            stats = PlayerStats(gpa: 7.5, stress: 30, energy: 90, money: 85, happiness: 75)
        } else {
            stats = PlayerStats(gpa: 8.0, stress: 25, energy: 95, money: 55, happiness: 90)
        }
    }
    
    private func perform(activity: DailyActivity) {
        selectedActivity = activity
        
        // Random check for event
        if currentDay == 1 {
            activeEvent = GameData.events.first(where: { $0.id == "e1" })
            phase = .event
        } else if Double.random(in: 0...1) < 0.6 {
            activeEvent = GameData.events.shuffled().first
            phase = .event
        } else {
            // Straight update
            stats.gpa = max(0, min(10, stats.gpa + (activity.gpaChange)))
            stats.stress = max(0, min(100, stats.stress + (activity.stressChange)))
            stats.energy = max(0, min(100, stats.energy + (activity.energyChange)))
            stats.money = max(0, min(100, stats.money + (activity.moneyChange)))
            stats.happiness = max(0, min(100, stats.happiness + (activity.happinessChange)))
            
            checkGameRules()
        }
    }
    
    private func handleChoice(option: ChoiceOption) {
        choiceFeedback = option.outcome.textFeedback
        
        // Update stats
        stats.gpa = max(0, min(10, stats.gpa + (option.outcome.gpa)))
        stats.stress = max(0, min(100, stats.stress + option.outcome.stress))
        stats.energy = max(0, min(100, stats.energy + option.outcome.energy))
        stats.money = max(0, min(100, stats.money + option.outcome.money))
        stats.happiness = max(0, min(100, stats.happiness + option.outcome.happiness))
    }
    
    private func confirmEventOutcome() {
        choiceFeedback = nil
        activeEvent = nil
        selectedActivity = nil
        
        checkGameRules()
    }
    
    private func checkGameRules() {
        if stats.energy <= 0 {
            deathCause = "Lao lực cạn kiệt năng lượng! Bạn đã bất tỉnh nhân sự ngay tại sảnh khu tự học đại học."
            phase = .gameover
        } else if stats.stress >= 100 {
            deathCause = "Stress vượt quá giới hạn 100%, bạn bị trầm cảm áp lực đè nặng nề!"
            phase = .gameover
        } else if stats.money <= 0 {
            deathCause = "Tài sản trắng tay! Không đủ trang trải học trực tiếp."
            phase = .gameover
        } else if stats.gpa <= 0 {
            deathCause = "Học lực GPA trở về phế tích, bị Phòng đào tạo buộc thôi học ngay lập tức!"
            phase = .gameover
        } else {
            if currentDay >= totalDays {
                phase = .summary
            } else {
                currentDay += 1
                phase = .gameplay
            }
        }
    }
    
    private func resetGame() {
        currentDay = 1
        stats = PlayerStats()
        selectedActivity = nil
        activeEvent = nil
        choiceFeedback = nil
        phase = .start
    }
}

// MARK: - Color Hex Initializer
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8 * 17), (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 1)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
`;
