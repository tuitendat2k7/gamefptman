import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import path from 'path';
import bcrypt from 'bcryptjs';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Khởi tạo Connection Pool tới MySQL
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'game_user',
    password: 'GameFPT@2026',
    database: 'gamefptman',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// KÍCH HOẠT CÁC API ROUTES CHO DATABASE
// ==========================================

// 1. API Đăng Ký Tài Khoản
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, fullName, studentId, avatar } = req.body;
        
        // Kiểm tra xem Username hoặc Mã SV đã tồn tại chưa
        const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ? OR student_id = ?', [username, studentId]);
        if (rows.length > 0) {
            return res.status(400).json({ error: 'Tên đăng nhập hoặc Mã sinh viên đã tồn tại!' });
        }

        // Mã hóa mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Lưu vào DB
        await pool.query(
            'INSERT INTO users (username, password, full_name, student_id, avatar) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, fullName, studentId, avatar]
        );
        
        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi server khi đăng ký!' });
    }
});

// 2. API Đăng Nhập
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(400).json({ error: 'Sai tên đăng nhập hoặc mật khẩu!' });
        
        const user = rows[0];
        
        // So sánh mật khẩu mã hóa
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Sai tên đăng nhập hoặc mật khẩu!' });
        
        // Trả về thông tin an toàn (không kèm password)
        res.json({
            username: user.username,
            fullName: user.full_name,
            studentId: user.student_id,
            avatar: user.avatar
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi server khi đăng nhập!' });
    }
});

// 3. API Lưu Điểm Tổng Kết (End Semester)
app.post('/api/submit-score', async (req, res) => {
    try {
        const { studentId, fullName, avatar, score } = req.body;
        await pool.query(
            'INSERT INTO leaderboard (student_id, full_name, avatar, score) VALUES (?, ?, ?, ?)',
            [studentId, fullName, avatar, score]
        );
        res.status(201).json({ message: 'Lưu điểm thành công!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi server khi lưu điểm!' });
    }
});

// 4. API Lấy Danh Sách Bảng Xếp Hạng (Top 10)
app.get('/api/leaderboard', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi server khi tải BXH!' });
    }
});

// ==========================================
// PHỤC VỤ STATIC FILES TỪ BẢN BUILD CỦA REACT
// ==========================================
// Khi esbuild đóng gói server.ts thành dist/server.cjs, __dirname chính là thư mục dist
app.use(express.static(__dirname));

// Đảm bảo React Router hoạt động khi refresh trang
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Backend Server đang chạy tại port ${PORT} và kết nối Database thành công!`);
});