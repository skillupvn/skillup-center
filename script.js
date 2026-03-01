// ============================================
// SKILLUP CENTER - Main JavaScript
// VERSION 2.0 - CẢI TIẾN KẾT NỐI GOOGLE SHEETS
// ============================================

// ========== Configuration ==========
const CONFIG = {
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbxmH0_T2B1aOJBpqPa3EL_WgaC2murCMzVm6aJN86iBH6d7Pv1rGPyN1cq0Woy19bM/exec',
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD: 'skillupVN@123',
    BLOG_PER_PAGE: 6,
    HERO_SLIDE_DELAY: 5000,
    STATS_ANIMATION_DURATION: 2000
};

// ========== Global State ==========
let appState = {
    isAdmin: false,
    currentHeroSlide: 0,
    currentBlogPage: 1,
    currentGalleryImage: 0,
    dataSource: 'loading',
    data: {
        courses: [],
        teachers: [],
        blog: [],
        gallery: [],
        registrations: []
    }
};

// ========== Mock Data (Fallback) ==========
const MOCK_DATA = {
    courses: [
        {
            id: 1,
            name: 'Cờ Vua Thiếu Nhi',
            category: 'Năng khiếu',
            ageGroup: '3-6',
            description: 'Rèn luyện tư duy chiến lược, tính kiên nhẫn và khả năng tập trung vượt trội cho trẻ từ 3-6 tuổi thông qua bộ môn "Thể thao trí tuệ" hàng đầu thế giới.',
            price: '1.200.000đ/tháng',
            duration: '2 buổi/tuần – 60 phút/buổi',
            image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600',
            featured: true,
            fullDescription: '🏆 Cờ Vua Thiếu Nhi – "Phòng tập gym cho não bộ" của con bạn! Nghiên cứu từ Đại học Harvard chỉ ra: trẻ chơi cờ vua có chỉ số IQ cao hơn 15-20% và khả năng giải toán tốt hơn 35% so với bạn đồng trang lứa. Tại SKILLUP CENTER, con được học từ những huấn luyện viên giàu kinh nghiệm với phương pháp "Học mà chơi – Chơi mà học". Lớp học tối đa 8 bé/lớp để đảm bảo chất lượng.'
        },
        {
            id: 2,
            name: 'Mỹ Thuật Sáng Tạo',
            category: 'Năng khiếu',
            ageGroup: '3-6',
            description: 'Khơi dậy tiềm năng nghệ thuật và phát triển trí tưởng tượng phong phú cho trẻ qua hội họa, thủ công và điêu khắc sáng tạo.',
            price: '1.000.000đ/tháng',
            duration: '2 buổi/tuần – 75 phút/buổi',
            image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
            featured: true,
            fullDescription: '🎨 Mỹ Thuật Sáng Tạo – Nơi mỗi nét vẽ là một câu chuyện! Chương trình bao gồm: Vẽ màu nước & sáp dầu, Nặn đất sét Nhật Bản, Cắt dán collage sáng tạo. Mỗi buổi học là một "cuộc phiêu lưu nghệ thuật" với chủ đề mới lạ. Triển lãm tranh cuối khóa để ba mẹ tự hào!'
        },
        {
            id: 3,
            name: 'Toán Tư Duy Soroban',
            category: 'Tư duy',
            ageGroup: '3-6',
            description: 'Phương pháp tính nhẩm siêu tốc Soroban (bàn tính Nhật Bản) – giúp trẻ tính nhanh hơn máy tính và phát triển cả hai bán cầu não.',
            price: '1.500.000đ/tháng',
            duration: '2 buổi/tuần – 60 phút/buổi',
            image: 'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=600',
            featured: true,
            fullDescription: '🧮 Toán Tư Duy Soroban – Biến con thành "máy tính sống"! Soroban là phương pháp giáo dục toán học nổi tiếng từ Nhật Bản, được UNESCO công nhận. Lộ trình 4 cấp độ từ làm quen bàn tính đến thi đấu cấp quốc gia. Sau 6 tháng, 90% học viên SKILLUP tính nhẩm nhanh gấp 3 lần bạn cùng lớp!'
        },
        {
            id: 4,
            name: 'Tiền Tiểu Học',
            category: 'Tư duy',
            ageGroup: '3-6',
            description: 'Chương trình chuẩn bị toàn diện cho trẻ 5-6 tuổi trước khi vào lớp 1: Đọc thông – Viết thạo – Tính nhanh – Tự tin hòa nhập.',
            price: '1.500.000đ/tháng',
            duration: '3 buổi/tuần – 90 phút/buổi',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            featured: true,
            fullDescription: '📚 Tiền Tiểu Học – "Bệ phóng vàng" cho ngày đầu tiên đi học! Chương trình TOÀN DIỆN: Làm quen chữ cái & ghép vần, Tập viết đúng nét, Toán cơ bản trong phạm vi 20, Kỹ năng hòa nhập, Tiếng Anh nền tảng. Sau khóa học, 98% phụ huynh phản hồi con TỰ TIN và HỨNG THÚ đi học!'
        },
        {
            id: 5,
            name: 'Rèn Chữ Đẹp',
            category: 'Kỹ năng',
            ageGroup: '7-10',
            description: 'Luyện viết chữ đẹp chuẩn quy cách Bộ GD&ĐT, rèn tính kiên nhẫn và cẩn thận – nền tảng giúp con học tốt mọi môn.',
            price: '800.000đ/tháng',
            duration: '2 buổi/tuần – 60 phút/buổi',
            image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=600',
            featured: false,
            fullDescription: '✍️ Rèn Chữ Đẹp – "Nét chữ nết người"! Nghiên cứu cho thấy trẻ viết chữ đẹp có kết quả học tập cao hơn 25%. Chương trình 4 giai đoạn: Sửa tư thế, Luyện nét cơ bản, Viết chữ hoa thường liền nét, Viết đoạn văn đều đẹp. Sĩ số lớp chỉ 6-8 bé.'
        },
        {
            id: 6,
            name: 'Dance Kids',
            category: 'Năng khiếu',
            ageGroup: '3-6',
            description: 'Nhảy múa sáng tạo cho trẻ – Phát triển thể chất, nhịp điệu và sự tự tin trên sân khấu qua các điệu nhảy hiện đại, K-Pop và nhảy dân gian.',
            price: '1.200.000đ/tháng',
            duration: '2 buổi/tuần – 60 phút/buổi',
            image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600',
            featured: true,
            fullDescription: '💃 Dance Kids – Nhảy là vui, vui là tự tin! Chương trình đa dạng: Kids Dance, K-Pop Dance, Hip Hop Junior, Nhảy dân gian Việt Nam. Mỗi khóa kết thúc bằng buổi biểu diễn sân khấu – cơ hội để con tỏa sáng!'
        },
        {
            id: 7,
            name: 'Tiếng Anh Giao Tiếp Trẻ Em',
            category: 'Ngôn ngữ',
            ageGroup: '3-6',
            description: 'Tiếng Anh giao tiếp cho trẻ 3-6 tuổi theo phương pháp Cambridge – Phản xạ tự nhiên như tiếng mẹ đẻ, không học vẹt, không áp lực.',
            price: '2.000.000đ/tháng',
            duration: '3 buổi/tuần – 60 phút/buổi',
            image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600',
            featured: true,
            fullDescription: '🌍 Tiếng Anh Giao Tiếp – Cho con "đôi cánh" bay ra thế giới! Phương pháp Cambridge YLE + Phonics + TPR, trẻ phản xạ tiếng Anh tự nhiên. Giáo viên có chứng chỉ TESOL quốc tế. Lộ trình: Starter → Mover → Flyer, thi lấy chứng chỉ Cambridge quốc tế.'
        },
        {
            id: 8,
            name: 'Cờ Vua Nâng Cao',
            category: 'Năng khiếu',
            ageGroup: '7-10',
            description: 'Lớp Cờ vua nâng cao dành cho trẻ 7-10 tuổi đã biết chơi cơ bản – Chiến thuật chuyên sâu, thi đấu giải cấp quận/thành phố.',
            price: '1.500.000đ/tháng',
            duration: '2 buổi/tuần – 90 phút/buổi',
            image: 'https://images.unsplash.com/photo-1560174038-da43ac74f01b?w=600',
            featured: false,
            fullDescription: '🏅 Cờ Vua Nâng Cao – Từ yêu thích đến chinh phục! Chương trình theo chuẩn Liên đoàn Cờ vua Việt Nam: Khai cuộc kinh điển, Chiến thuật trung cuộc, Tàn cuộc cơ bản, Phân tích ván đấu, Luyện thi giải cấp quận và thành phố.'
        },
        {
            id: 9,
            name: 'Tiếng Anh Giao Tiếp Tiểu Học',
            category: 'Ngôn ngữ',
            ageGroup: '7-10',
            description: 'Tiếng Anh giao tiếp nâng cao cho học sinh tiểu học – Tự tin nghe nói, đọc hiểu và viết câu hoàn chỉnh.',
            price: '2.500.000đ/tháng',
            duration: '3 buổi/tuần – 75 phút/buổi',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            featured: false,
            fullDescription: '📖 Tiếng Anh Giao Tiếp Tiểu Học – Nói tiếng Anh như ngôn ngữ thứ hai! Reading Club, Debate Mini, Project Work, Grammar in Context, Exam Preparation Cambridge A2 Flyers / KET. Ba mẹ nhận báo cáo tiến độ hàng tháng.'
        },
        {
            id: 10,
            name: 'Mỹ Thuật & Sáng Tạo Nâng Cao',
            category: 'Năng khiếu',
            ageGroup: '7-10',
            description: 'Hội họa chuyên sâu cho trẻ tiểu học – Vẽ chì, vẽ màu nước, vẽ acrylic và thiết kế sáng tạo.',
            price: '1.200.000đ/tháng',
            duration: '2 buổi/tuần – 90 phút/buổi',
            image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?w=600',
            featured: false,
            fullDescription: '🖼️ Mỹ Thuật & Sáng Tạo Nâng Cao – Từ đam mê thành tài năng! Vẽ chì, Màu nước, Acrylic, Thiết kế đồ họa cơ bản. Mỗi học viên được xây dựng Portfolio cá nhân. Cơ hội tham gia triển lãm tranh thiếu nhi.'
        }
    ],
    teachers: [
        {
            id: 1,
            name: 'Thầy Trần Minh Đức',
            title: 'Huấn luyện viên Cờ Vua',
            bio: 'Kiện tướng Cờ vua quốc gia, 12 năm kinh nghiệm đào tạo cờ vua thiếu nhi. Nhiều học viên đạt giải Nhất cờ vua TP.HCM.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            specialties: ['Cờ vua', 'Tư duy chiến lược', 'Thi đấu giải']
        },
        {
            id: 2,
            name: 'Cô Nguyễn Thu Hằng',
            title: 'Giáo viên Mỹ Thuật',
            bio: 'Cử nhân Mỹ thuật - ĐH Mỹ thuật TP.HCM, 8 năm giảng dạy hội họa cho trẻ em. Từng triển lãm tranh cá nhân và đạt nhiều giải thưởng.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            specialties: ['Hội họa', 'Sáng tạo', 'Thủ công mỹ nghệ']
        },
        {
            id: 3,
            name: 'Cô Lê Thị Mai Anh',
            title: 'Giáo viên Soroban & Toán Tư Duy',
            bio: 'Chứng chỉ giảng dạy Soroban cấp quốc tế từ Nhật Bản, 10 năm kinh nghiệm. Đào tạo 500+ học viên, nhiều em đạt giải toán cấp thành phố.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            specialties: ['Soroban', 'Toán tư duy', 'Toán Singapore']
        },
        {
            id: 4,
            name: 'Cô Phạm Thanh Tú',
            title: 'Giáo viên Tiếng Anh',
            bio: 'Thạc sĩ Ngôn ngữ Anh, chứng chỉ TESOL & Cambridge TKT. 9 năm giảng dạy tiếng Anh trẻ em theo phương pháp Cambridge.',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            specialties: ['Cambridge English', 'Phonics', 'TESOL']
        },
        {
            id: 5,
            name: 'Cô Hoàng Yến Nhi',
            title: 'Giáo viên Dance',
            bio: 'Biên đạo múa chuyên nghiệp, tốt nghiệp ĐH Sân khấu Điện ảnh. 7 năm đào tạo nhảy múa cho thiếu nhi.',
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
            specialties: ['K-Pop', 'Hip Hop', 'Nhảy sáng tạo', 'Biên đạo']
        },
        {
            id: 6,
            name: 'Cô Trần Thị Ngọc Lan',
            title: 'Giáo viên Tiền Tiểu Học & Rèn Chữ Đẹp',
            bio: 'Cử nhân Sư phạm Tiểu học, 15 năm kinh nghiệm. Chuyên gia về luyện chữ đẹp và chuẩn bị kỹ năng vào lớp 1.',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            specialties: ['Tiền tiểu học', 'Rèn chữ đẹp', 'Ghép vần', 'Toán cơ bản']
        }
    ],
    blog: [
        {
            id: 1,
            title: 'Vì Sao Cờ Vua Được Gọi Là "Phòng Tập Gym Cho Não Bộ" Của Trẻ?',
            excerpt: 'Nghiên cứu từ Đại học Harvard chứng minh: trẻ chơi cờ vua thường xuyên có chỉ số IQ cao hơn, khả năng tập trung và giải quyết vấn đề vượt trội.',
            content: '<h3>Cờ vua – Không chỉ là trò chơi</h3><p>Nhiều phụ huynh nghĩ cờ vua chỉ đơn giản là một trò chơi giải trí. Nhưng thực tế, đây là bộ môn "thể thao trí tuệ" có tác động mạnh mẽ đến sự phát triển não bộ của trẻ.</p><h3>5 lợi ích vàng khi cho con học cờ vua</h3><p><strong>1. Tăng chỉ số IQ:</strong> Trẻ chơi cờ vua đều đặn có IQ cao hơn 15-20%.</p><p><strong>2. Rèn tính kiên nhẫn:</strong> Mỗi ván cờ đòi hỏi trẻ phải suy nghĩ, chờ đợi.</p><p><strong>3. Tư duy chiến lược:</strong> Trẻ học cách lập kế hoạch, dự đoán nước đi.</p><p><strong>4. Cải thiện học tập:</strong> Giải toán tốt hơn 35%.</p><p><strong>5. Chấp nhận thất bại:</strong> Thua cờ dạy trẻ rằng thất bại là cơ hội học hỏi.</p><p>Tại <strong>SKILLUP CENTER</strong>, chúng tôi có lớp Cờ Vua Thiếu Nhi cho trẻ từ 3-6 tuổi. Liên hệ ngay để đăng ký buổi học thử MIỄN PHÍ!</p>',
            image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600',
            author: 'Thầy Trần Minh Đức',
            date: '25/02/2026',
            category: 'Phương pháp giáo dục'
        },
        {
            id: 2,
            title: 'Soroban – Bí Quyết Giúp Trẻ Nhật Bản Giỏi Toán Nhất Thế Giới',
            excerpt: 'Tại sao học sinh Nhật Bản luôn đứng đầu thế giới về Toán học? Câu trả lời nằm ở phương pháp Soroban – bàn tính truyền thống được UNESCO công nhận.',
            content: '<h3>Soroban là gì?</h3><p>Soroban là phương pháp tính nhẩm sử dụng bàn tính truyền thống Nhật Bản, có lịch sử hơn 400 năm.</p><p><strong>Kích hoạt đồng thời 2 bán cầu não:</strong> Tay phải điều khiển bởi não trái (logic), hình ảnh bàn tính được xử lý bởi não phải (sáng tạo).</p><p><strong>Tính nhẩm siêu tốc:</strong> Sau 6-12 tháng, trẻ cộng trừ 5-6 số nhanh hơn máy tính.</p><h3>Kết quả tại SKILLUP CENTER</h3><p>90% học viên tính nhẩm nhanh gấp 3 lần bạn cùng lớp. Đăng ký học thử MIỄN PHÍ ngay!</p>',
            image: 'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=600',
            author: 'Cô Lê Thị Mai Anh',
            date: '20/02/2026',
            category: 'Phương pháp giáo dục'
        },
        {
            id: 3,
            title: 'Con Vào Lớp 1: 7 Điều Ba Mẹ NHẤT ĐỊNH Phải Chuẩn Bị',
            excerpt: 'Sắp đến mùa tuyển sinh lớp 1, nhiều phụ huynh lo lắng con chưa sẵn sàng. Đừng đợi đến phút cuối! Hãy cùng tìm hiểu 7 điều quan trọng nhất.',
            content: '<h3>Vì sao chuẩn bị trước khi vào lớp 1 rất quan trọng?</h3><p>Chuyển từ mầm non lên tiểu học là bước ngoặt LỚN NHẤT. Trẻ chưa chuẩn bị dễ bị sốc và mất tự tin.</p><h3>7 điều cần chuẩn bị</h3><p><strong>1.</strong> Biết đọc chữ cái và ghép vần cơ bản</p><p><strong>2.</strong> Cầm bút đúng cách</p><p><strong>3.</strong> Đếm và tính cộng trừ trong phạm vi 10</p><p><strong>4.</strong> Tự giới thiệu bản thân</p><p><strong>5.</strong> Ngồi yên 30-35 phút</p><p><strong>6.</strong> Tự phục vụ bản thân</p><p><strong>7.</strong> Tuân thủ nội quy</p><p>Chương trình Tiền Tiểu Học tại <strong>SKILLUP CENTER</strong> bao gồm tất cả 7 yếu tố trên!</p>',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            author: 'Cô Trần Thị Ngọc Lan',
            date: '15/02/2026',
            category: 'Chia sẻ phụ huynh'
        },
        {
            id: 4,
            title: 'Nhảy Múa – 6 Lợi Ích "Vàng" Cho Sự Phát Triển Của Trẻ',
            excerpt: 'Nhiều ba mẹ cho con học nhảy chỉ vì "cho vui", nhưng khoa học đã chứng minh nhảy múa mang lại những lợi ích ĐÁNG KINH NGẠC.',
            content: '<h3>Nhảy múa – "Siêu thực phẩm" cho não bộ</h3><p>Trẻ nhảy múa thường xuyên có khả năng ghi nhớ tốt hơn 18%, tập trung cao hơn 22%.</p><h3>6 lợi ích vàng</h3><p><strong>1.</strong> Phát triển thể chất toàn diện</p><p><strong>2.</strong> Tự tin trước đám đông</p><p><strong>3.</strong> Kỷ luật và kiên nhẫn</p><p><strong>4.</strong> Làm việc nhóm</p><p><strong>5.</strong> Cảm thụ âm nhạc</p><p><strong>6.</strong> Giải phóng năng lượng tích cực</p><p>Lớp Dance Kids tại SKILLUP CENTER có K-Pop, Hip Hop, nhảy sáng tạo. Đăng ký trải nghiệm ngay!</p>',
            image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=600',
            author: 'Cô Hoàng Yến Nhi',
            date: '10/02/2026',
            category: 'Phát triển trẻ em'
        },
        {
            id: 5,
            title: 'Cho Con Học Vẽ – Đầu Tư Cho "Trí Tuệ Cảm Xúc" Tương Lai',
            excerpt: 'Einstein từng nói: "Trí tưởng tượng quan trọng hơn kiến thức." Mỹ thuật nuôi dưỡng trí tưởng tượng, EQ và khả năng sáng tạo cho trẻ.',
            content: '<h3>Mỹ thuật – Không chỉ là "học vẽ"</h3><p>Trẻ học mỹ thuật có khả năng giải quyết vấn đề sáng tạo cao hơn 40% và EQ vượt trội.</p><p><strong>Tư duy sáng tạo:</strong> Trước tờ giấy trắng, trẻ tự tưởng tượng và quyết định.</p><p><strong>Biểu đạt cảm xúc:</strong> Trẻ "nói" qua màu sắc và hình ảnh.</p><p><strong>Vận động tinh:</strong> Nền tảng cho viết chữ đẹp.</p><p>Tại SKILLUP CENTER, con được TỰ DO SÁNG TẠO, không vẽ theo khuôn mẫu!</p>',
            image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
            author: 'Cô Nguyễn Thu Hằng',
            date: '05/02/2026',
            category: 'Năng khiếu'
        },
        {
            id: 6,
            title: '"Giai Đoạn Vàng" Học Tiếng Anh – Bỏ Lỡ Là Tiếc Cả Đời!',
            excerpt: 'Trẻ từ 3-7 tuổi có khả năng tiếp thu ngôn ngữ thứ hai NHANH GẤP 10 LẦN người lớn. Đây là "cửa sổ vàng" ba mẹ không nên bỏ lỡ!',
            content: '<h3>Não bộ trẻ em – "Siêu máy tính" học ngôn ngữ</h3><p>Não bộ trẻ 3-7 tuổi tiếp thu ngôn ngữ mới ở mức THIÊN TÀI. Sau 7 tuổi, khả năng này giảm dần.</p><h3>Phương pháp đúng là chìa khóa</h3><p><strong>SAI:</strong> Bắt trẻ học thuộc từ vựng, chép bài.</p><p><strong>ĐÚNG:</strong> Tiếp xúc qua bài hát, trò chơi, câu chuyện.</p><p>Tại SKILLUP CENTER – Phương pháp Cambridge YLE + Phonics + TPR. Không học vẹt, không áp lực – chỉ có niềm vui! Đăng ký học thử MIỄN PHÍ!</p>',
            image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600',
            author: 'Cô Phạm Thanh Tú',
            date: '01/02/2026',
            category: 'Tiếng Anh trẻ em'
        }
    ],
    gallery: [
        { id: 1, url: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800', caption: 'Giờ học Cờ vua – Tư duy mỗi nước đi' },
        { id: 2, url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', caption: 'Lớp Mỹ thuật sáng tạo – Thế giới màu sắc' },
        { id: 3, url: 'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=800', caption: 'Toán tư duy Soroban – Tính nhẩm siêu tốc' },
        { id: 4, url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', caption: 'Lớp Tiền tiểu học – Sẵn sàng vào lớp 1' },
        { id: 5, url: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800', caption: 'Dance Kids – Nhảy là vui, vui là tự tin!' },
        { id: 6, url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800', caption: 'Tiếng Anh giao tiếp – Tự tin nói cùng bạn bè' },
        { id: 7, url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', caption: 'Hoạt động ngoại khóa – Học mà chơi' },
        { id: 8, url: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=800', caption: 'Rèn chữ đẹp – Nét chữ nết người' }
    ]
};

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

async function initApp() {
    showLoading(true);
    initNavigation();
    initHeroSlider();
    await loadData();
    renderCourses();
    renderTeachers();
    renderBlog();
    renderGallery();
    initStatsAnimation();
    initCourseFilters();
    initContactForm();
    initModals();
    initBackToTop();
    initAdminPanel();
    setTimeout(function() { showLoading(false); }, 500);
}

// ========== Loading ==========
function showLoading(show) {
    var overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// ========== Data Loading - CẢI TIẾN ==========
async function loadData() {
    try {
        var url = CONFIG.API_BASE_URL + '?action=getAll';
        console.log('🔄 Đang tải dữ liệu từ:', url);
        
        var response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('HTTP Error: ' + response.status);
        }
        
        var data = await response.json();
        console.log('📥 Dữ liệu nhận được từ API:', data);
        
        // KIỂM TRA: Nếu API trả về mảng rỗng cho TẤT CẢ → dùng Mock Data
        var hasData = false;
        if (data.courses && data.courses.length > 0) hasData = true;
        if (data.teachers && data.teachers.length > 0) hasData = true;
        if (data.blog && data.blog.length > 0) hasData = true;
        if (data.gallery && data.gallery.length > 0) hasData = true;
        
        if (hasData) {
            // Có ít nhất 1 sheet có dữ liệu → dùng API data
            // Nhưng nếu sheet nào rỗng thì bổ sung từ Mock
            appState.data.courses = (data.courses && data.courses.length > 0) ? data.courses : MOCK_DATA.courses;
            appState.data.teachers = (data.teachers && data.teachers.length > 0) ? data.teachers : MOCK_DATA.teachers;
            appState.data.blog = (data.blog && data.blog.length > 0) ? data.blog : MOCK_DATA.blog;
            appState.data.gallery = (data.gallery && data.gallery.length > 0) ? data.gallery : MOCK_DATA.gallery;
            appState.dataSource = 'google-sheets';
            console.log('✅ Đã tải dữ liệu từ Google Sheets');
        } else {
            // TẤT CẢ sheet đều rỗng → dùng toàn bộ Mock Data
            console.warn('⚠️ Tất cả sheet rỗng. Kiểm tra lại Google Sheets!');
            console.warn('📋 Chi tiết: courses=' + (data.courses ? data.courses.length : 'null') + 
                         ', teachers=' + (data.teachers ? data.teachers.length : 'null') + 
                         ', blog=' + (data.blog ? data.blog.length : 'null') + 
                         ', gallery=' + (data.gallery ? data.gallery.length : 'null'));
            appState.data = MOCK_DATA;
            appState.dataSource = 'mock-data';
            console.log('📦 Sử dụng dữ liệu mẫu (Mock Data)');
        }
        
    } catch (error) {
        console.error('❌ Lỗi kết nối API:', error);
        appState.data = MOCK_DATA;
        appState.dataSource = 'mock-data';
        console.log('📦 Sử dụng dữ liệu mẫu do lỗi kết nối');
    }
}

async function refreshData() {
    showLoading(true);
    await loadData();
    renderCourses();
    renderTeachers();
    renderBlog();
    renderGallery();
    initCourseFilters();
    showLoading(false);
    
    if (appState.dataSource === 'google-sheets') {
        alert('✅ Dữ liệu đã làm mới từ Google Sheets!');
    } else {
        alert('⚠️ Không thể tải từ Google Sheets. Đang dùng dữ liệu mẫu.\n\nKiểm tra:\n1. Tên sheet phải đúng: Courses, Teachers, Blog, Gallery\n2. Dòng header phải đúng\n3. Apps Script đã Deploy đúng version mới');
    }
}

// ========== Navigation ==========
function initNavigation() {
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                navMenu.classList.remove('active');
                navLinks.forEach(function(l) { l.classList.remove('active'); });
                link.classList.add('active');
            }
        });
    });

    window.addEventListener('scroll', function() {
        var header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ========== Hero Slider ==========
function initHeroSlider() {
    var slides = document.querySelectorAll('.hero-slide');
    var dotsContainer = document.querySelector('.hero-dots');

    slides.forEach(function(_, index) {
        var dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', function() { goToSlide(index); });
        dotsContainer.appendChild(dot);
    });

    document.querySelector('.hero-prev').addEventListener('click', function() {
        goToSlide(appState.currentHeroSlide - 1);
    });
    document.querySelector('.hero-next').addEventListener('click', function() {
        goToSlide(appState.currentHeroSlide + 1);
    });

    setInterval(function() {
        goToSlide(appState.currentHeroSlide + 1);
    }, CONFIG.HERO_SLIDE_DELAY);
}

function goToSlide(index) {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
    });
    appState.currentHeroSlide = index;
}

// ========== Stats Animation ==========
function initStatsAnimation() {
    var statNumbers = document.querySelectorAll('.stat-number');
    var animated = false;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(function(stat) {
                    var target = parseInt(stat.dataset.target);
                    animateNumber(stat, 0, target, CONFIG.STATS_ANIMATION_DURATION);
                });
            }
        });
    });
    observer.observe(document.querySelector('.stats'));
}

function animateNumber(element, start, end, duration) {
    var range = end - start;
    var increment = range / (duration / 16);
    var current = start;
    var timer = setInterval(function() {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========== Courses ==========
function renderCourses() {
    var grid = document.getElementById('coursesGrid');
    var courses = appState.data.courses || [];

    if (courses.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có khóa học nào</p>';
        return;
    }

    grid.innerHTML = courses.map(function(course) {
        var ageGroup = course.ageGroup || course.agegroup || course['Age Group'] || '';
        var categoryRaw = course.category || '';
        var categoryLower = categoryRaw.toString().toLowerCase();
        var isFeatured = (course.featured === true || course.featured === 'TRUE' || course.featured === 'true');
        
        return '<div class="course-card" data-age="' + ageGroup + '" data-category="' + categoryLower + '" onclick="showCourseDetail(' + course.id + ')">' +
            '<div class="course-image">' +
                '<img src="' + (course.image || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600') + '" alt="' + course.name + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600\'">' +
                (isFeatured ? '<div class="course-badge">Nổi bật</div>' : '') +
            '</div>' +
            '<div class="course-content">' +
                '<div class="course-category">' + categoryRaw + '</div>' +
                '<h3 class="course-title">' + course.name + '</h3>' +
                '<p class="course-description">' + (course.description || '') + '</p>' +
                '<div class="course-meta">' +
                    '<div>' +
                        '<div class="course-age"><i class="fas fa-child"></i> <span>' + ageGroup + ' tuổi</span></div>' +
                        '<div class="course-duration"><i class="fas fa-clock"></i> <span>' + (course.duration || '') + '</span></div>' +
                    '</div>' +
                    '<div class="course-price">' + (course.price || 'Liên hệ') + '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');

    // Populate course dropdown
    var courseSelect = document.getElementById('interestedCourse');
    if (courseSelect) {
        courseSelect.innerHTML = '<option value="">-- Chọn khóa học --</option>' +
            courses.map(function(c) {
                return '<option value="' + c.name + '">' + c.name + '</option>';
            }).join('');
    }
}

function initCourseFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(function(btn) {
        // Xóa event cũ bằng cách clone
        var newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Gán event mới
    var newFilterBtns = document.querySelectorAll('.filter-btn');
    newFilterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            newFilterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.dataset.filter;
            var courseCards = document.querySelectorAll('.course-card');
            
            courseCards.forEach(function(card) {
                var age = card.dataset.age || '';
                var category = card.dataset.category || '';

                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (filter.includes('-')) {
                    card.style.display = (age === filter) ? 'block' : 'none';
                } else {
                    card.style.display = category.includes(filter) ? 'block' : 'none';
                }
            });
        });
    });
}

function showCourseDetail(courseId) {
    var course = appState.data.courses.find(function(c) { return c.id == courseId; });
    if (!course) return;

    var modal = document.getElementById('courseModal');
    var content = document.getElementById('courseModalContent');
    var ageGroup = course.ageGroup || course.agegroup || '';
    var fullDesc = course.fullDescription || course.fulldescription || course.description || '';
    
    content.innerHTML = '<div class="course-detail">' +
        '<img src="' + (course.image || '') + '" alt="' + course.name + '" style="width:100%;border-radius:12px;margin-bottom:1.5rem;" onerror="this.style.display=\'none\'">' +
        '<div class="course-category" style="margin-bottom:0.5rem;">' + (course.category || '') + '</div>' +
        '<h2 style="font-size:2rem;margin-bottom:1rem;">' + course.name + '</h2>' +
        '<div style="display:flex;gap:2rem;margin-bottom:1.5rem;flex-wrap:wrap;">' +
            '<div><i class="fas fa-child"></i> <strong>Độ tuổi:</strong> ' + ageGroup + ' tuổi</div>' +
            '<div><i class="fas fa-clock"></i> <strong>Thời lượng:</strong> ' + (course.duration || '') + '</div>' +
            '<div><i class="fas fa-tag"></i> <strong>Học phí:</strong> ' + (course.price || 'Liên hệ') + '</div>' +
        '</div>' +
        '<div style="line-height:1.8;color:#6b7280;margin-bottom:2rem;">' + fullDesc + '</div>' +
        '<a href="#contact" class="btn btn-primary btn-large" onclick="closeModal(\'courseModal\')">' +
            '<i class="fas fa-paper-plane"></i> Đăng ký ngay' +
        '</a>' +
    '</div>';
    
    modal.classList.add('show');
}

// ========== Teachers ==========
function renderTeachers() {
    var grid = document.getElementById('teachersGrid');
    var teachers = appState.data.teachers || [];

    if (teachers.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có thông tin giáo viên</p>';
        return;
    }

    grid.innerHTML = teachers.map(function(teacher) {
        var specialties = teacher.specialties || [];
        if (typeof specialties === 'string') {
            specialties = specialties.split(',').map(function(s) { return s.trim(); });
        }
        if (!Array.isArray(specialties)) {
            specialties = [];
        }
        
        return '<div class="teacher-card">' +
            '<div class="teacher-image">' +
                '<img src="' + (teacher.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400') + '" alt="' + teacher.name + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400\'">' +
            '</div>' +
            '<div class="teacher-info">' +
                '<h3 class="teacher-name">' + teacher.name + '</h3>' +
                '<div class="teacher-title">' + (teacher.title || '') + '</div>' +
                '<p class="teacher-bio">' + (teacher.bio || '') + '</p>' +
                '<div class="teacher-specialties">' +
                    specialties.map(function(s) {
                        return '<span class="specialty-tag">' + s + '</span>';
                    }).join('') +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ========== Blog ==========
function renderBlog() {
    var grid = document.getElementById('blogGrid');
    var blog = appState.data.blog || [];

    if (blog.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có bài viết nào</p>';
        return;
    }

    var startIndex = (appState.currentBlogPage - 1) * CONFIG.BLOG_PER_PAGE;
    var endIndex = startIndex + CONFIG.BLOG_PER_PAGE;
    var paginatedBlog = blog.slice(startIndex, endIndex);

    grid.innerHTML = paginatedBlog.map(function(post) {
        return '<div class="blog-card" onclick="showBlogDetail(' + post.id + ')">' +
            '<div class="blog-image">' +
                '<img src="' + (post.image || '') + '" alt="' + post.title + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600\'">' +
            '</div>' +
            '<div class="blog-content">' +
                '<div class="blog-meta">' +
                    '<span><i class="fas fa-user"></i> ' + (post.author || '') + '</span>' +
                    '<span><i class="fas fa-calendar"></i> ' + (post.date || '') + '</span>' +
                '</div>' +
                '<h3 class="blog-title">' + post.title + '</h3>' +
                '<p class="blog-excerpt">' + (post.excerpt || '') + '</p>' +
                '<div class="blog-read-more">Đọc thêm <i class="fas fa-arrow-right"></i></div>' +
            '</div>' +
        '</div>';
    }).join('');

    renderBlogPagination(blog.length);
    initBlogSearch();
}

function renderBlogPagination(totalPosts) {
    var pagination = document.getElementById('blogPagination');
    var totalPages = Math.ceil(totalPosts / CONFIG.BLOG_PER_PAGE);

    if (totalPages <= 1) { pagination.innerHTML = ''; return; }

    var html = '';
    if (appState.currentBlogPage > 1) {
        html += '<button class="page-btn" onclick="changeBlogPage(' + (appState.currentBlogPage - 1) + ')"><i class="fas fa-chevron-left"></i></button>';
    }
    for (var i = 1; i <= totalPages; i++) {
        html += '<button class="page-btn ' + (i === appState.currentBlogPage ? 'active' : '') + '" onclick="changeBlogPage(' + i + ')">' + i + '</button>';
    }
    if (appState.currentBlogPage < totalPages) {
        html += '<button class="page-btn" onclick="changeBlogPage(' + (appState.currentBlogPage + 1) + ')"><i class="fas fa-chevron-right"></i></button>';
    }
    pagination.innerHTML = html;
}

function changeBlogPage(page) {
    appState.currentBlogPage = page;
    renderBlog();
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
}

function initBlogSearch() {
    var searchInput = document.getElementById('blogSearch');
    var searchBtn = searchInput.nextElementSibling;

    var performSearch = function() {
        var query = searchInput.value.toLowerCase();
        var cards = document.querySelectorAll('.blog-card');
        cards.forEach(function(card) {
            var title = card.querySelector('.blog-title').textContent.toLowerCase();
            var excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            card.style.display = (title.includes(query) || excerpt.includes(query)) ? 'block' : 'none';
        });
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') performSearch();
    });
}

function showBlogDetail(postId) {
    var post = appState.data.blog.find(function(p) { return p.id == postId; });
    if (!post) return;

    var modal = document.getElementById('blogModal');
    var content = document.getElementById('blogModalContent');
    
    content.innerHTML = '<div class="blog-detail">' +
        '<img src="' + (post.image || '') + '" alt="' + post.title + '" style="width:100%;border-radius:12px;margin-bottom:1.5rem;" onerror="this.style.display=\'none\'">' +
        '<div class="blog-meta" style="margin-bottom:1rem;">' +
            '<span><i class="fas fa-user"></i> ' + (post.author || '') + '</span>' +
            '<span><i class="fas fa-calendar"></i> ' + (post.date || '') + '</span>' +
            '<span><i class="fas fa-tag"></i> ' + (post.category || '') + '</span>' +
        '</div>' +
        '<h2 style="font-size:2rem;margin-bottom:1rem;">' + post.title + '</h2>' +
        '<div style="line-height:1.8;color:#6b7280;">' + (post.content || post.excerpt || '') + '</div>' +
    '</div>';
    
    modal.classList.add('show');
}

// ========== Gallery ==========
function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    var gallery = appState.data.gallery || [];

    if (gallery.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có hình ảnh nào</p>';
        return;
    }

    grid.innerHTML = gallery.map(function(item, index) {
        return '<div class="gallery-item" onclick="openLightbox(' + index + ')">' +
            '<img src="' + (item.url || '') + '" alt="' + (item.caption || 'Gallery') + '" loading="lazy" onerror="this.parentElement.style.display=\'none\'">' +
            '<div class="gallery-overlay"><i class="fas fa-search-plus"></i></div>' +
        '</div>';
    }).join('');
}

function openLightbox(index) {
    var lightbox = document.getElementById('galleryLightbox');
    var img = document.getElementById('lightboxImg');
    var caption = lightbox.querySelector('.lightbox-caption');
    var gallery = appState.data.gallery;

    appState.currentGalleryImage = index;
    img.src = gallery[index].url;
    caption.textContent = gallery[index].caption || '';
    lightbox.classList.add('show');
}

function closeLightbox() {
    document.getElementById('galleryLightbox').classList.remove('show');
}

function navigateLightbox(direction) {
    var gallery = appState.data.gallery;
    var newIndex = appState.currentGalleryImage + direction;
    if (newIndex < 0) newIndex = gallery.length - 1;
    if (newIndex >= gallery.length) newIndex = 0;
    openLightbox(newIndex);
}

// ========== Contact Form ==========
function initContactForm() {
    var form = document.getElementById('contactForm');
    var successMsg = document.getElementById('formSuccess');
    var errorMsg = document.getElementById('formError');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        var formData = {
            parentName: document.getElementById('parentName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            childAge: document.getElementById('childAge').value,
            interestedCourse: document.getElementById('interestedCourse').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('vi-VN')
        };

        try {
            await fetch(CONFIG.API_BASE_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'addRegistration', data: formData })
            });

            form.style.display = 'none';
            successMsg.style.display = 'block';

            setTimeout(function() {
                form.reset();
                form.style.display = 'block';
                successMsg.style.display = 'none';
            }, 5000);
        } catch (error) {
            console.error('Form error:', error);
            errorMsg.style.display = 'block';
            setTimeout(function() { errorMsg.style.display = 'none'; }, 5000);
        }
    });
}

// ========== Modals ==========
function initModals() {
    var loginModal = document.getElementById('loginModal');
    var btnLogin = document.getElementById('btnLogin');
    var closeLogin = document.getElementById('closeLogin');

    btnLogin.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.add('show');
    });

    closeLogin.addEventListener('click', function() {
        loginModal.classList.remove('show');
    });

    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;

        if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
            appState.isAdmin = true;
            loginModal.classList.remove('show');
            document.getElementById('adminPanel').style.display = 'block';
            alert('Đăng nhập thành công!');
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    });

    document.getElementById('closeCourseModal').addEventListener('click', function() { closeModal('courseModal'); });
    document.getElementById('closeBlogModal').addEventListener('click', function() { closeModal('blogModal'); });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', function() { navigateLightbox(-1); });
    document.querySelector('.lightbox-next').addEventListener('click', function() { navigateLightbox(1); });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
        if (e.target.classList.contains('lightbox')) {
            closeLightbox();
        }
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ========== Admin Panel ==========
function initAdminPanel() {
    document.getElementById('btnLogout').addEventListener('click', function() {
        appState.isAdmin = false;
        document.getElementById('adminPanel').style.display = 'none';
        alert('Đã đăng xuất!');
    });
}

// ========== Back to Top ==========
function initBackToTop() {
    var btn = document.getElementById('backToTop');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    btn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== Global Scope ==========
window.showCourseDetail = showCourseDetail;
window.showBlogDetail = showBlogDetail;
window.changeBlogPage = changeBlogPage;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
window.closeModal = closeModal;
window.refreshData = refreshData;
