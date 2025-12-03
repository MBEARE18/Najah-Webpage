// API Configuration
const API_BASE_URL = (() => {
    const port = window.location.port ? `:${window.location.port}` : '';
    return `${window.location.protocol}//${window.location.hostname}${port}/api`;
})();

// State Management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    if (authToken) {
        loadDashboard();
        loadInitialData();
    }
});

// Authentication
async function checkAuth() {
    if (!authToken) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const data = await response.json();
        currentUser = data.data;
        
        if (currentUser.role !== 'admin') {
            alert('Access denied. Admin only.');
            logout();
            return;
        }

        updateAdminInfo();
    } catch (error) {
        console.error('Auth error:', error);
        logout();
    }
}

function updateAdminInfo() {
    if (currentUser) {
        document.getElementById('admin-name').textContent = currentUser.name;
        const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
        document.getElementById('admin-initials').textContent = initials || 'A';
    }
}

function logout() {
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
}

// Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');

    // Update active nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active-nav', 'bg-white', 'bg-opacity-20');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active-nav', 'bg-white', 'bg-opacity-20');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'students': 'Students',
        'teachers': 'Teachers',
        'courses': 'Courses',
        'enrollments': 'Enrollments',
        'live-classes': 'Live Classes'
    };
    document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';

    // Load section data
    switch(sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'students':
            loadStudents();
            break;
        case 'teachers':
            loadTeachers();
            break;
        case 'courses':
            loadCourses();
            break;
        case 'enrollments':
            loadEnrollments();
            break;
        case 'live-classes':
            loadLiveClasses();
            break;
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('-translate-x-full');
}

// Dashboard
async function loadDashboard() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error('Failed to load dashboard');

        const result = await response.json();
        const stats = result.data;

        // Update stats
        document.getElementById('stat-students-total').textContent = stats.students.total;
        document.getElementById('stat-courses-total').textContent = stats.courses.total;
        document.getElementById('stat-enrollments-active').textContent = stats.enrollments.active;
        document.getElementById('stat-revenue').textContent = `₹${stats.revenue.total.toLocaleString()}`;

        // Recent enrollments
        const enrollmentsDiv = document.getElementById('recent-enrollments');
        enrollmentsDiv.innerHTML = stats.recentEnrollments.length > 0
            ? stats.recentEnrollments.map(e => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-semibold">${e.student.name}</p>
                        <p class="text-sm text-gray-600">${e.course.name} - ${e.course.class}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs ${getStatusColor(e.status)}">${e.status}</span>
                </div>
            `).join('')
            : '<p class="text-gray-500">No recent enrollments</p>';

        // Recent students
        const studentsDiv = document.getElementById('recent-students');
        studentsDiv.innerHTML = stats.recentStudents.length > 0
            ? stats.recentStudents.map(s => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-semibold">${s.name}</p>
                        <p class="text-sm text-gray-600">${s.email}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">${s.class || 'N/A'}</span>
                </div>
            `).join('')
            : '<p class="text-gray-500">No recent students</p>';

        hideLoading();
    } catch (error) {
        console.error('Dashboard error:', error);
        hideLoading();
        alert('Failed to load dashboard data');
    }
}

// Students
async function loadStudents() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/students`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error('Failed to load students');

        const result = await response.json();
        const tbody = document.getElementById('students-table-body');
        
        tbody.innerHTML = result.data.map(student => `
            <tr>
                <td class="px-4 py-3 whitespace-nowrap">${student.name}</td>
                <td class="px-4 py-3 whitespace-nowrap">${student.email}</td>
                <td class="px-4 py-3 whitespace-nowrap">${student.phone || 'N/A'}</td>
                <td class="px-4 py-3 whitespace-nowrap">${student.class || 'N/A'}</td>
                <td class="px-4 py-3 whitespace-nowrap">${student.board || 'N/A'}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${student.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <button onclick="viewStudent('${student._id}')" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="toggleStudentStatus('${student._id}', ${student.isActive})" class="text-yellow-600 hover:text-yellow-800">
                        <i class="fas fa-${student.isActive ? 'ban' : 'check'}"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        hideLoading();
    } catch (error) {
        console.error('Students error:', error);
        hideLoading();
        alert('Failed to load students');
    }
}

function refreshStudents() {
    loadStudents();
}

async function toggleStudentStatus(id, currentStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isActive: !currentStatus })
        });

        if (response.ok) {
            loadStudents();
        }
    } catch (error) {
        console.error('Error updating student:', error);
    }
}

function viewStudent(id) {
    alert(`View student details for ID: ${id}`);
}

// Teachers
async function loadTeachers() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/admin/teachers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) throw new Error('Failed to load teachers');

        const result = await response.json();
        const tbody = document.getElementById('teachers-table-body');
        
        tbody.innerHTML = result.data.map(teacher => `
            <tr>
                <td class="px-4 py-3 whitespace-nowrap">${teacher.name}</td>
                <td class="px-4 py-3 whitespace-nowrap">${teacher.email}</td>
                <td class="px-4 py-3 whitespace-nowrap">${teacher.phone || 'N/A'}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs ${teacher.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${teacher.isActive ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <button onclick="editTeacher('${teacher._id}')" class="text-blue-600 hover:text-blue-800 mr-2">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        hideLoading();
    } catch (error) {
        console.error('Teachers error:', error);
        hideLoading();
        alert('Failed to load teachers');
    }
}

function showAddTeacherModal() {
    const name = prompt('Enter teacher name:');
    const email = prompt('Enter teacher email:');
    const password = prompt('Enter teacher password:');
    const phone = prompt('Enter teacher phone (optional):');

    if (name && email && password) {
        createTeacher({ name, email, password, phone });
    }
}

async function createTeacher(data) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/teachers`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            loadTeachers();
            alert('Teacher created successfully');
        } else {
            const error = await response.json();
            alert(error.message || 'Failed to create teacher');
        }
    } catch (error) {
        console.error('Error creating teacher:', error);
        alert('Failed to create teacher');
    }
}

function editTeacher(id) {
    alert(`Edit teacher: ${id}`);
}

// Courses
async function loadCourses() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/courses`);

        if (!response.ok) throw new Error('Failed to load courses');

        const result = await response.json();
        const grid = document.getElementById('courses-grid');
        
        grid.innerHTML = result.data.map(course => `
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h3 class="text-xl font-bold mb-2">${course.name}</h3>
                <p class="text-gray-600 mb-2">${course.board} - Class ${course.class}</p>
                <p class="text-sm text-gray-500 mb-4">${course.subjects.length} subjects</p>
                <div class="flex space-x-2">
                    <button onclick="viewCourse('${course._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        View
                    </button>
                    <button onclick="editCourse('${course._id}')" class="flex-1 bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                        Edit
                    </button>
                </div>
            </div>
        `).join('');

        hideLoading();
    } catch (error) {
        console.error('Courses error:', error);
        hideLoading();
        alert('Failed to load courses');
    }
}

function showAddCourseModal() {
    alert('Add course feature - implement modal form');
}

function viewCourse(id) {
    alert(`View course: ${id}`);
}

function editCourse(id) {
    alert(`Edit course: ${id}`);
}

// Enrollments
async function loadEnrollments() {
    try {
        showLoading();
        
        // Fetch both regular enrollments and marketing enrollments
        const [enrollmentsResponse, marketingResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/enrollments`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }),
            fetch(`${API_BASE_URL}/admin/marketing-enrollments`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
            })
        ]);

        if (!enrollmentsResponse.ok) throw new Error('Failed to load enrollments');
        if (!marketingResponse.ok) throw new Error('Failed to load marketing enrollments');

        const enrollmentsResult = await enrollmentsResponse.json();
        const marketingResult = await marketingResponse.json();
        
        const tbody = document.getElementById('enrollments-table-body');
        
        // Combine regular enrollments
        let html = enrollmentsResult.data.map(enrollment => `
            <tr>
                <td class="px-4 py-3 whitespace-nowrap">${enrollment.student?.name || 'N/A'}</td>
                <td class="px-4 py-3 whitespace-nowrap">${enrollment.course?.name || 'N/A'} - ${enrollment.course?.class || 'N/A'}</td>
                <td class="px-4 py-3">${Array.isArray(enrollment.subjects) ? enrollment.subjects.join(', ') : 'N/A'}</td>
                <td class="px-4 py-3 whitespace-nowrap">₹${enrollment.amount || 0}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs ${getStatusColor(enrollment.status || 'pending')}">${enrollment.status || 'pending'}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs ${getPaymentStatusColor(enrollment.paymentStatus || 'pending')}">${enrollment.paymentStatus || 'pending'}</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <button onclick="viewEnrollment('${enrollment._id}')" class="text-blue-600 hover:text-blue-800">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Add marketing enrollments (from frontend form)
        html += marketingResult.data.map(enrollment => `
            <tr class="bg-yellow-50">
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center">
                        <span class="font-semibold">${enrollment.studentName}</span>
                        <span class="ml-2 px-2 py-1 rounded text-xs bg-yellow-200 text-yellow-800">New</span>
                    </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">Marketing - Class ${enrollment.class}</td>
                <td class="px-4 py-3">${enrollment.subjects.map(s => s.subject).join(', ')}</td>
                <td class="px-4 py-3 whitespace-nowrap">₹${enrollment.totalAmount || 0}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex flex-col space-y-1">
                        <button onclick="viewMarketingEnrollment('${enrollment._id}')" class="text-blue-600 hover:text-blue-800" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <span class="text-xs text-gray-500">${enrollment.email}</span>
                        <span class="text-xs text-gray-500">${enrollment.phone}</span>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html || '<tr><td colspan="7" class="px-4 py-3 text-center text-gray-500">No enrollments found</td></tr>';

        hideLoading();
    } catch (error) {
        console.error('Enrollments error:', error);
        hideLoading();
        alert('Failed to load enrollments');
    }
}

function refreshEnrollments() {
    loadEnrollments();
}

function viewEnrollment(id) {
    alert(`View enrollment: ${id}`);
}

function viewMarketingEnrollment(id) {
    // Fetch and display marketing enrollment details
    fetch(`${API_BASE_URL}/admin/marketing-enrollments`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(res => res.json())
    .then(result => {
        const enrollment = result.data.find(e => e._id === id);
        if (enrollment) {
            const details = `
Student Name: ${enrollment.studentName}
Email: ${enrollment.email}
Phone: ${enrollment.phone}
Class: ${enrollment.class}
Board: ${enrollment.board}
School: ${enrollment.schoolName || 'N/A'}
Subjects: ${enrollment.subjects.map(s => `${s.subject} (₹${s.price})`).join(', ')}
Total Amount: ₹${enrollment.totalAmount}
Submitted: ${new Date(enrollment.createdAt).toLocaleString()}
            `;
            alert(details);
        }
    })
    .catch(error => {
        console.error('Error fetching enrollment details:', error);
        alert('Failed to load enrollment details');
    });
}

// Live Classes
async function loadLiveClasses() {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/live-classes`);

        if (!response.ok) throw new Error('Failed to load live classes');

        const result = await response.json();
        const grid = document.getElementById('live-classes-grid');
        
        grid.innerHTML = result.data.map(liveClass => `
            <div class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition">
                <h3 class="text-xl font-bold mb-2">${liveClass.title}</h3>
                <p class="text-gray-600 mb-2">${liveClass.subject}</p>
                <p class="text-sm text-gray-500 mb-2">${new Date(liveClass.scheduledDate).toLocaleString()}</p>
                <p class="text-sm mb-4">
                    <span class="px-3 py-1 rounded-full text-xs ${getStatusColor(liveClass.status)}">${liveClass.status}</span>
                </p>
                <div class="flex space-x-2">
                    <button onclick="viewLiveClass('${liveClass._id}')" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        View
                    </button>
                </div>
            </div>
        `).join('');

        hideLoading();
    } catch (error) {
        console.error('Live classes error:', error);
        hideLoading();
        alert('Failed to load live classes');
    }
}

function showAddLiveClassModal() {
    alert('Add live class feature - implement modal form');
}

function viewLiveClass(id) {
    alert(`View live class: ${id}`);
}

// Utility Functions
function getStatusColor(status) {
    const colors = {
        'active': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-blue-100 text-blue-800',
        'cancelled': 'bg-red-100 text-red-800',
        'scheduled': 'bg-purple-100 text-purple-800',
        'live': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function getPaymentStatusColor(status) {
    const colors = {
        'paid': 'bg-green-100 text-green-800',
        'pending': 'bg-yellow-100 text-yellow-800',
        'failed': 'bg-red-100 text-red-800',
        'refunded': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function showLoading() {
    document.getElementById('loading-overlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.add('hidden');
}

function loadInitialData() {
    // Pre-load dashboard data
    if (document.getElementById('dashboard-section').classList.contains('hidden') === false) {
        loadDashboard();
    }
}

