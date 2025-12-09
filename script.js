// ============================================
// SKILLUP CENTER - Main JavaScript
// ============================================

// ========== Configuration ==========
const CONFIG = {
    // Google Apps Script API Endpoint
    // Thay YOUR_SCRIPT_ID bằng ID của Google Apps Script sau khi deploy
    API_BASE_URL: 'https://script.google.com/macros/s/AKfycbxmH0_T2B1aOJBpqPa3EL_WgaC2murCMzVm6aJN86iBH6d7Pv1rGPyN1cq0Woy19bM/exec',
    
    // Admin credentials (demo only - trong production nên dùng backend authentication)
    ADMIN_USERNAME: 'admin',
    ADMIN_PASSWORD: 'adminskillupVN@123',
    
    // Pagination
    BLOG_PER_PAGE: 6,
    
    // Animation delays
    HERO_SLIDE_DELAY: 5000,
    STATS_ANIMATION_DURATION: 2000
};

// ========== Global State ==========
let appState = {
    isAdmin: false,
    currentHeroSlide: 0,
    currentBlogPage: 1,
    currentGalleryImage: 0,
    data: {
        courses: [],
        teachers: [],
        blog: [],
        gallery: [],
        registrations: []
    }
};

// ========== Mock Data (Fallback if Google Sheets not connected) ==========
const MOCK_DATA = {
    courses: [
        {
            id: 1,
            name: 'Tiếng Anh Thiếu Nhi',
            category: 'Ngoại ngữ',
            ageGroup: '3-6',
            description: 'Khóa học tiếng Anh cho trẻ mầm non với phương pháp Cambridge, tập trung phát triển kỹ năng nghe - nói qua các hoạt động vui chơi, ca nhạc.',
            price: '2.500.000đ/tháng',
            duration: '2 buổi/tuần',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            featured: true,
            fullDescription: 'Khóa học Tiếng Anh Thiếu Nhi được thiết kế đặc biệt cho trẻ từ 3-6 tuổi, áp dụng phương pháp Cambridge kết hợp với TPR (Total Physical Response). Trẻ học qua các hoạt động vui chơi, ca nhạc, kể chuyện, giúp phát triển tự nhiên kỹ năng nghe - nói.'
        },
        {
            id: 2,
            name: 'STEM Sáng Tạo',
            category: 'STEM',
            ageGroup: '7-10',
            description: 'Khóa học STEM tích hợp khoa học, công nghệ, kỹ thuật và toán học qua các dự án thực hành thú vị.',
            price: '3.000.000đ/tháng',
            duration: '2 buổi/tuần',
            image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
            featured: true,
            fullDescription: 'STEM Sáng Tạo giúp trẻ phát triển tư duy logic, kỹ năng giải quyết vấn đề qua các dự án như: lập trình Scratch, xây dựng robot đơn giản, thí nghiệm khoa học...'
        },
        {
            id: 3,
            name: 'Kỹ Năng Sống',
            category: 'Kỹ năng sống',
            ageGroup: '7-10',
            description: 'Phát triển kỹ năng giao tiếp, làm việc nhóm, tư duy phản biện và quản lý cảm xúc cho trẻ.',
            price: '2.000.000đ/tháng',
            duration: '1 buổi/tuần',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
            featured: false,
            fullDescription: 'Khóa học Kỹ Năng Sống tập trung vào 4 trụ cột: Giao tiếp hiệu quả, Tư duy phản biện, Quản lý cảm xúc, Làm việc nhóm. Trẻ học qua các tình huống thực tế, trò chơi nhập vai.'
        },
        {
            id: 4,
            name: 'Toán Tư Duy',
            category: 'STEM',
            ageGroup: '3-6',
            description: 'Khóa học Toán theo phương pháp Singapore, phát triển tư duy logic và khả năng giải quyết vấn đề.',
            price: '2.200.000đ/tháng',
            duration: '2 buổi/tuần',
            image: 'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=600',
            featured: true,
            fullDescription: 'Toán Tư Duy áp dụng phương pháp Singapore nổi tiếng, giúp trẻ hiểu bản chất của toán học thay vì học thuộc lòng. Sử dụng đồ dùng trực quan, trò chơi logic.'
        },
        {
            id: 5,
            name: 'Lập Trình Thiếu Nhi',
            category: 'STEM',
            ageGroup: '11-15',
            description: 'Học lập trình Python, thiết kế game, phát triển ứng dụng web cơ bản cho trẻ THCS.',
            price: '3.500.000đ/tháng',
            duration: '2 buổi/tuần',
            image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600',
            featured: true,
            fullDescription: 'Khóa học Lập Trình Thiếu Nhi dành cho học sinh THCS, bắt đầu với Python cơ bản, thiết kế game với Pygame, sau đó tiến tới HTML/CSS và JavaScript để tạo website đơn giản.'
        },
        {
            id: 6,
            name: 'Nghệ Thuật Sáng Tạo',
            category: 'Kỹ năng sống',
            ageGroup: '3-6',
            description: 'Vẽ, nặn đất sét, thủ công giúp phát triển khả năng sáng tạo và vận động tinh của trẻ.',
            price: '1.800.000đ/tháng',
            duration: '2 buổi/tuần',
            image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
            featured: false,
            fullDescription: 'Nghệ Thuật Sáng Tạo giúp trẻ khám phá màu sắc, hình khối, chất liệu qua các hoạt động như vẽ tranh, nặn đất sét, làm đồ thủ công từ vật liệu tái chế.'
        }
    ],
    teachers: [
        {
            id: 1,
            name: 'Nguyễn Thu Hằng',
            title: 'Giáo viên Tiếng Anh',
            bio: 'Thạc sĩ Ngôn ngữ Anh, 10 năm kinh nghiệm giảng dạy tiếng Anh cho trẻ em. Chứng chỉ TESOL, Cambridge TKT.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
            specialties: ['Cambridge English', 'Phonics', 'Storytelling']
        },
        {
            id: 2,
            name: 'Trần Minh Tuấn',
            title: 'Chuyên gia STEM',
            bio: 'Kỹ sư Điện tử, đam mê giáo dục STEM. 8 năm kinh nghiệm đào tạo lập trình và Robotics cho thiếu nhi.',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            specialties: ['Python', 'Arduino', 'Scratch']
        },
        {
            id: 3,
            name: 'Lê Thị Mai',
            title: 'Giáo viên Kỹ Năng Sống',
            bio: 'Cử nhân Tâm lý học Giáo dục, chuyên gia về phát triển kỹ năng mềm và quản lý cảm xúc cho trẻ.',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
            specialties: ['Giao tiếp', 'Cảm xúc', 'Tự tin']
        },
        {
            id: 4,
            name: 'Phạm Văn Đức',
            title: 'Giáo viên Toán',
            bio: 'Thạc sĩ Toán học, áp dụng phương pháp Singapore và Montessori trong giảng dạy toán cho trẻ nhỏ.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            specialties: ['Singapore Math', 'Logic', 'Problem Solving']
        }
    ],
    blog: [
        {
            id: 1,
            title: '5 Cách Khơi Dậy Đam Mê Học Tập Cho Trẻ',
            excerpt: 'Làm thế nào để trẻ yêu thích việc học? Cùng khám phá 5 phương pháp hiệu quả được nhiều bậc phụ huynh áp dụng thành công.',
            content: 'Nội dung chi tiết về cách khơi dậy đam mê học tập cho trẻ...',
            image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
            author: 'Nguyễn Thu Hằng',
            date: '15/11/2024',
            category: 'Phương pháp giáo dục'
        },
        {
            id: 2,
            title: 'STEM - Xu Hướng Giáo Dục Thế Kỷ 21',
            excerpt: 'Tại sao STEM lại quan trọng với sự phát triển của trẻ em? Cùng tìm hiểu về phương pháp giáo dục đang được toàn cầu quan tâm.',
            content: 'Nội dung chi tiết về STEM...',
            image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
            author: 'Trần Minh Tuấn',
            date: '10/11/2024',
            category: 'STEM'
        },
        {
            id: 3,
            title: 'Kỹ Năng Sống - Hành Trang Cho Tương Lai',
            excerpt: 'Những kỹ năng sống nào cần thiết cho trẻ em? Làm thế nào để rèn luyện hiệu quả từ nhỏ?',
            content: 'Nội dung chi tiết về kỹ năng sống...',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
            author: 'Lê Thị Mai',
            date: '05/11/2024',
            category: 'Kỹ năng sống'
        }
    ],
    gallery: [
        {
            id: 1,
            url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
            caption: 'Lớp học Tiếng Anh'
        },
        {
            id: 2,
            url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800',
            caption: 'Hoạt động STEM'
        },
        {
            id: 3,
            url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
            caption: 'Trò chơi nhóm'
        },
        {
            id: 4,
            url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800',
            caption: 'Hoạt động ngoài trời'
        },
        {
            id: 5,
            url: 'https://images.unsplash.com/photo-1596496050755-c923e73e42e1?w=800',
            caption: 'Lớp học Toán'
        },
        {
            id: 6,
            url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
            caption: 'Nghệ thuật sáng tạo'
        }
    ]
};

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

async function initApp() {
    // Show loading overlay
    showLoading(true);
    
    // Initialize navigation
    initNavigation();
    
    // Initialize hero slider
    initHeroSlider();
    
    // Load data from Google Sheets or use mock data
    await loadData();
    
    // Render all sections
    renderCourses();
    renderTeachers();
    renderBlog();
    renderGallery();
    
    // Initialize stats animation
    initStatsAnimation();
    
    // Initialize course filters
    initCourseFilters();
    
    // Initialize contact form
    initContactForm();
    
    // Initialize modals
    initModals();
    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize admin panel
    initAdminPanel();
    
    // Hide loading overlay
    setTimeout(() => showLoading(false), 500);
}

// ========== Loading Management ==========
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

// ========== Data Loading ==========
async function loadData() {
    try {
        // Try to load from Google Sheets API
        const response = await fetch(`${CONFIG.API_BASE_URL}?action=getAll`);
        if (response.ok) {
            const data = await response.json();
            appState.data = data;
            console.log('Data loaded from Google Sheets');
        } else {
            throw new Error('Failed to load from API');
        }
    } catch (error) {
        console.warn('Using mock data as fallback:', error);
        appState.data = MOCK_DATA;
    }
}

async function refreshData() {
    showLoading(true);
    await loadData();
    renderCourses();
    renderTeachers();
    renderBlog();
    renderGallery();
    showLoading(false);
    alert('Dữ liệu đã được làm mới!');
}

// ========== Navigation ==========
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href').startsWith('#')) {
                navMenu.classList.remove('active');
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });
}

// ========== Hero Slider ==========
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.querySelector('.hero-dots');
    
    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('hero-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Navigation buttons
    document.querySelector('.hero-prev').addEventListener('click', () => {
        goToSlide(appState.currentHeroSlide - 1);
    });
    
    document.querySelector('.hero-next').addEventListener('click', () => {
        goToSlide(appState.currentHeroSlide + 1);
    });
    
    // Auto slide
    setInterval(() => {
        goToSlide(appState.currentHeroSlide + 1);
    }, CONFIG.HERO_SLIDE_DELAY);
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    // Wrap around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    appState.currentHeroSlide = index;
}

// ========== Stats Animation ==========
function initStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.dataset.target);
                    animateNumber(stat, 0, target, CONFIG.STATS_ANIMATION_DURATION);
                });
            }
        });
    });
    
    observer.observe(document.querySelector('.stats'));
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========== Courses Section ==========
function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    const courses = appState.data.courses || [];
    
    if (courses.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có khóa học nào</p>';
        return;
    }
    
    grid.innerHTML = courses.map(course => `
        <div class="course-card" data-age="${course.ageGroup}" data-category="${course.category.toLowerCase()}" onclick="showCourseDetail(${course.id})">
            <div class="course-image">
                <img src="${course.image}" alt="${course.name}" loading="lazy">
                ${course.featured ? '<div class="course-badge">Nổi bật</div>' : ''}
            </div>
            <div class="course-content">
                <div class="course-category">${course.category}</div>
                <h3 class="course-title">${course.name}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <div>
                        <div class="course-age">
                            <i class="fas fa-child"></i>
                            <span>${course.ageGroup} tuổi</span>
                        </div>
                        <div class="course-duration">
                            <i class="fas fa-clock"></i>
                            <span>${course.duration}</span>
                        </div>
                    </div>
                    <div class="course-price">${course.price}</div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Populate course dropdown in contact form
    const courseSelect = document.getElementById('interestedCourse');
    courseSelect.innerHTML = '<option value="">-- Chọn khóa học --</option>' +
        courses.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
}

function initCourseFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Filter courses
            courseCards.forEach(card => {
                const age = card.dataset.age;
                const category = card.dataset.category;
                
                if (filter === 'all') {
                    card.style.display = 'block';
                } else if (filter.includes('-')) {
                    // Age filter
                    card.style.display = age === filter ? 'block' : 'none';
                } else {
                    // Category filter
                    card.style.display = category.includes(filter) ? 'block' : 'none';
                }
            });
        });
    });
}

function showCourseDetail(courseId) {
    const course = appState.data.courses.find(c => c.id === courseId);
    if (!course) return;
    
    const modal = document.getElementById('courseModal');
    const content = document.getElementById('courseModalContent');
    
    content.innerHTML = `
        <div class="course-detail">
            <img src="${course.image}" alt="${course.name}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;">
            <div class="course-category" style="margin-bottom: 0.5rem;">${course.category}</div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">${course.name}</h2>
            <div style="display: flex; gap: 2rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
                <div><i class="fas fa-child"></i> <strong>Độ tuổi:</strong> ${course.ageGroup} tuổi</div>
                <div><i class="fas fa-clock"></i> <strong>Thời lượng:</strong> ${course.duration}</div>
                <div><i class="fas fa-tag"></i> <strong>Học phí:</strong> ${course.price}</div>
            </div>
            <div style="line-height: 1.8; color: #6b7280; margin-bottom: 2rem;">
                ${course.fullDescription || course.description}
            </div>
            <a href="#contact" class="btn btn-primary btn-large" onclick="closeModal('courseModal')">
                <i class="fas fa-paper-plane"></i> Đăng ký ngay
            </a>
        </div>
    `;
    
    modal.classList.add('show');
}

// ========== Teachers Section ==========
function renderTeachers() {
    const grid = document.getElementById('teachersGrid');
    const teachers = appState.data.teachers || [];
    
    if (teachers.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có thông tin giáo viên</p>';
        return;
    }
    
    grid.innerHTML = teachers.map(teacher => `
        <div class="teacher-card">
            <div class="teacher-image">
                <img src="${teacher.image}" alt="${teacher.name}" loading="lazy">
            </div>
            <div class="teacher-info">
                <h3 class="teacher-name">${teacher.name}</h3>
                <div class="teacher-title">${teacher.title}</div>
                <p class="teacher-bio">${teacher.bio}</p>
                <div class="teacher-specialties">
                    ${teacher.specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// ========== Blog Section ==========
function renderBlog() {
    const grid = document.getElementById('blogGrid');
    const blog = appState.data.blog || [];
    
    if (blog.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có bài viết nào</p>';
        return;
    }
    
    // Pagination
    const startIndex = (appState.currentBlogPage - 1) * CONFIG.BLOG_PER_PAGE;
    const endIndex = startIndex + CONFIG.BLOG_PER_PAGE;
    const paginatedBlog = blog.slice(startIndex, endIndex);
    
    grid.innerHTML = paginatedBlog.map(post => `
        <div class="blog-card" onclick="showBlogDetail(${post.id})">
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${post.date}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-read-more">
                    Đọc thêm <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        </div>
    `).join('');
    
    renderBlogPagination(blog.length);
    initBlogSearch();
}

function renderBlogPagination(totalPosts) {
    const pagination = document.getElementById('blogPagination');
    const totalPages = Math.ceil(totalPosts / CONFIG.BLOG_PER_PAGE);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    if (appState.currentBlogPage > 1) {
        html += `<button class="page-btn" onclick="changeBlogPage(${appState.currentBlogPage - 1})">
            <i class="fas fa-chevron-left"></i>
        </button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === appState.currentBlogPage ? 'active' : ''}" 
                        onclick="changeBlogPage(${i})">${i}</button>`;
    }
    
    // Next button
    if (appState.currentBlogPage < totalPages) {
        html += `<button class="page-btn" onclick="changeBlogPage(${appState.currentBlogPage + 1})">
            <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    pagination.innerHTML = html;
}

function changeBlogPage(page) {
    appState.currentBlogPage = page;
    renderBlog();
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth' });
}

function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    const searchBtn = searchInput.nextElementSibling;
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll('.blog-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            
            if (title.includes(query) || excerpt.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

function showBlogDetail(postId) {
    const post = appState.data.blog.find(p => p.id === postId);
    if (!post) return;
    
    const modal = document.getElementById('blogModal');
    const content = document.getElementById('blogModalContent');
    
    content.innerHTML = `
        <div class="blog-detail">
            <img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem;">
            <div class="blog-meta" style="margin-bottom: 1rem;">
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span><i class="fas fa-calendar"></i> ${post.date}</span>
                <span><i class="fas fa-tag"></i> ${post.category}</span>
            </div>
            <h2 style="font-size: 2rem; margin-bottom: 1rem;">${post.title}</h2>
            <div style="line-height: 1.8; color: #6b7280;">
                ${post.content}
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// ========== Gallery Section ==========
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    const gallery = appState.data.gallery || [];
    
    if (gallery.length === 0) {
        grid.innerHTML = '<p class="loading-placeholder">Không có hình ảnh nào</p>';
        return;
    }
    
    grid.innerHTML = gallery.map((item, index) => `
        <div class="gallery-item" onclick="openLightbox(${index})">
            <img src="${item.url}" alt="${item.caption || 'Gallery image'}" loading="lazy">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        </div>
    `).join('');
}

function openLightbox(index) {
    const lightbox = document.getElementById('galleryLightbox');
    const img = document.getElementById('lightboxImg');
    const caption = lightbox.querySelector('.lightbox-caption');
    const gallery = appState.data.gallery;
    
    appState.currentGalleryImage = index;
    img.src = gallery[index].url;
    caption.textContent = gallery[index].caption || '';
    lightbox.classList.add('show');
}

function closeLightbox() {
    document.getElementById('galleryLightbox').classList.remove('show');
}

function navigateLightbox(direction) {
    const gallery = appState.data.gallery;
    let newIndex = appState.currentGalleryImage + direction;
    
    if (newIndex < 0) newIndex = gallery.length - 1;
    if (newIndex >= gallery.length) newIndex = 0;
    
    openLightbox(newIndex);
}

// ========== Contact Form ==========
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    const errorMsg = document.getElementById('formError');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            parentName: document.getElementById('parentName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            childAge: document.getElementById('childAge').value,
            interestedCourse: document.getElementById('interestedCourse').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('vi-VN')
        };
        
        try {
            // Submit to Google Sheets
            const response = await fetch(CONFIG.API_BASE_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addRegistration',
                    data: formData
                })
            });
            
            // Show success message
            form.style.display = 'none';
            successMsg.style.display = 'block';
            
            // Reset form after 3 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMsg.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            errorMsg.style.display = 'block';
            setTimeout(() => {
                errorMsg.style.display = 'none';
            }, 5000);
        }
    });
}

// ========== Modals ==========
function initModals() {
    // Login modal
    const loginModal = document.getElementById('loginModal');
    const btnLogin = document.getElementById('btnLogin');
    const closeLogin = document.getElementById('closeLogin');
    
    btnLogin.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('show');
    });
    
    closeLogin.addEventListener('click', () => {
        loginModal.classList.remove('show');
    });
    
    // Login form
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
            appState.isAdmin = true;
            loginModal.classList.remove('show');
            document.getElementById('adminPanel').style.display = 'block';
            alert('Đăng nhập thành công!');
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    });
    
    // Course modal
    document.getElementById('closeCourseModal').addEventListener('click', () => {
        closeModal('courseModal');
    });
    
    // Blog modal
    document.getElementById('closeBlogModal').addEventListener('click', () => {
        closeModal('blogModal');
    });
    
    // Lightbox
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    document.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
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
    document.getElementById('btnLogout').addEventListener('click', () => {
        appState.isAdmin = false;
        document.getElementById('adminPanel').style.display = 'none';
        alert('Đã đăng xuất!');
    });
}

// ========== Back to Top ==========
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== Utility Functions ==========
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// ========== Export Functions to Global Scope ==========
window.showCourseDetail = showCourseDetail;
window.showBlogDetail = showBlogDetail;
window.changeBlogPage = changeBlogPage;
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
window.closeModal = closeModal;
window.refreshData = refreshData;
