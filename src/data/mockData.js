export const mockStudents = [
  { id: 'STU001', name: 'Alice Johnson', email: 'alice@university.edu', phone: '555-0101', dob: '2004-03-15', department: 'Computer Science', year: 3, semester: 5, rollNo: 'CS2023-001', guardianName: 'Robert Johnson', guardianPhone: '555-0201', address: '123 Elm St, Springfield', enrollmentDate: '2023-08-01', attendance: 92, status: 'Active' },
  { id: 'STU002', name: 'Bob Williams', email: 'bob@university.edu', phone: '555-0102', dob: '2005-07-22', department: 'Computer Science', year: 2, semester: 3, rollNo: 'CS2024-002', guardianName: 'Mary Williams', guardianPhone: '555-0202', address: '456 Oak Ave, Riverside', enrollmentDate: '2024-08-01', attendance: 85, status: 'Active' },
  { id: 'STU003', name: 'Carol Davis', email: 'carol@university.edu', phone: '555-0103', dob: '2003-11-08', department: 'Electronics', year: 4, semester: 7, rollNo: 'EC2022-003', guardianName: 'James Davis', guardianPhone: '555-0203', address: '789 Pine Rd, Lakewood', enrollmentDate: '2022-08-01', attendance: 78, status: 'Active' },
  { id: 'STU004', name: 'David Brown', email: 'david@university.edu', phone: '555-0104', dob: '2006-01-30', department: 'Mechanical', year: 1, semester: 1, rollNo: 'ME2025-004', guardianName: 'Susan Brown', guardianPhone: '555-0204', address: '321 Maple Dr, Hilltown', enrollmentDate: '2025-08-01', attendance: 95, status: 'Active' },
  { id: 'STU005', name: 'Eva Martinez', email: 'eva@university.edu', phone: '555-0105', dob: '2004-05-12', department: 'Computer Science', year: 3, semester: 5, rollNo: 'CS2023-005', guardianName: 'Carlos Martinez', guardianPhone: '555-0205', address: '654 Birch Ln, Westfield', enrollmentDate: '2023-08-01', attendance: 88, status: 'Active' },
  { id: 'STU006', name: 'Frank Lee', email: 'frank@university.edu', phone: '555-0106', dob: '2005-09-03', department: 'Electronics', year: 2, semester: 3, rollNo: 'EC2024-006', guardianName: 'Linda Lee', guardianPhone: '555-0206', address: '987 Cedar St, Eastview', enrollmentDate: '2024-08-01', attendance: 72, status: 'Warning' },
  { id: 'STU007', name: 'Grace Kim', email: 'grace@university.edu', phone: '555-0107', dob: '2006-04-18', department: 'Computer Science', year: 1, semester: 1, rollNo: 'CS2025-007', guardianName: 'Daniel Kim', guardianPhone: '555-0207', address: '147 Walnut Ave, Northville', enrollmentDate: '2025-08-01', attendance: 91, status: 'Active' },
  { id: 'STU008', name: 'Henry Chen', email: 'henry@university.edu', phone: '555-0108', dob: '2004-08-25', department: 'Mechanical', year: 3, semester: 5, rollNo: 'ME2023-008', guardianName: 'Wei Chen', guardianPhone: '555-0208', address: '258 Spruce Blvd, Southgate', enrollmentDate: '2023-08-01', attendance: 67, status: 'Warning' },
  { id: 'STU009', name: 'Irene Patel', email: 'irene@university.edu', phone: '555-0109', dob: '2003-12-01', department: 'Computer Science', year: 4, semester: 7, rollNo: 'CS2022-009', guardianName: 'Raj Patel', guardianPhone: '555-0209', address: '369 Ash Ct, Midtown', enrollmentDate: '2022-08-01', attendance: 98, status: 'Active' },
  { id: 'STU010', name: 'Jake Thompson', email: 'jake@university.edu', phone: '555-0110', dob: '2005-06-14', department: 'Electronics', year: 2, semester: 3, rollNo: 'EC2024-010', guardianName: 'Karen Thompson', guardianPhone: '555-0210', address: '741 Poplar Way, Greendale', enrollmentDate: '2024-08-01', attendance: 82, status: 'Active' },
];

export const mockFaculty = [
  { id: 'FAC001', name: 'Dr. Sarah Mitchell', email: 'sarah.m@university.edu', phone: '555-1001', dob: '1980-06-15', department: 'Computer Science', designation: 'Associate Professor', qualification: 'Ph.D. in Computer Science', experience: 12, subjects: ['Data Structures', 'Algorithms'], classesThisWeek: 12, joinDate: '2014-07-01', status: 'Active' },
  { id: 'FAC002', name: 'Prof. James Anderson', email: 'james.a@university.edu', phone: '555-1002', dob: '1975-03-22', department: 'Electronics', designation: 'Professor', qualification: 'Ph.D. in Electronics Engineering', experience: 20, subjects: ['Digital Circuits', 'VLSI'], classesThisWeek: 10, joinDate: '2006-01-15', status: 'Active' },
  { id: 'FAC003', name: 'Dr. Maria Garcia', email: 'maria.g@university.edu', phone: '555-1003', dob: '1985-11-08', department: 'Computer Science', designation: 'Assistant Professor', qualification: 'Ph.D. in Artificial Intelligence', experience: 8, subjects: ['Machine Learning', 'AI'], classesThisWeek: 8, joinDate: '2018-08-01', status: 'Active' },
  { id: 'FAC004', name: 'Prof. Robert Taylor', email: 'robert.t@university.edu', phone: '555-1004', dob: '1970-09-30', department: 'Mechanical', designation: 'Professor', qualification: 'Ph.D. in Mechanical Engineering', experience: 25, subjects: ['Thermodynamics', 'Fluid Mechanics'], classesThisWeek: 14, joinDate: '2001-06-01', status: 'Active' },
];

export const mockClasses = [
  { id: 'CLS001', name: 'Data Structures', code: 'CS201', faculty: 'Dr. Sarah Mitchell', schedule: 'Mon, Wed, Fri 9:00 AM', room: 'LH-301', students: 45, department: 'Computer Science' },
  { id: 'CLS002', name: 'Algorithms', code: 'CS301', faculty: 'Dr. Sarah Mitchell', schedule: 'Tue, Thu 11:00 AM', room: 'LH-205', students: 38, department: 'Computer Science' },
  { id: 'CLS003', name: 'Machine Learning', code: 'CS401', faculty: 'Dr. Maria Garcia', schedule: 'Mon, Wed 2:00 PM', room: 'LH-102', students: 52, department: 'Computer Science' },
  { id: 'CLS004', name: 'Digital Circuits', code: 'EC201', faculty: 'Prof. James Anderson', schedule: 'Tue, Thu, Sat 10:00 AM', room: 'LH-401', students: 40, department: 'Electronics' },
  { id: 'CLS005', name: 'Thermodynamics', code: 'ME301', faculty: 'Prof. Robert Taylor', schedule: 'Mon, Wed, Fri 3:00 PM', room: 'LH-108', students: 35, department: 'Mechanical' },
];

export const mockAttendanceHistory = [
  { date: '2026-02-16', subject: 'Data Structures', status: 'present', method: 'QR + Face + Wi-Fi' },
  { date: '2026-02-17', subject: 'Algorithms', status: 'present', method: 'QR + Face + Wi-Fi' },
  { date: '2026-02-18', subject: 'Machine Learning', status: 'absent', method: '-' },
  { date: '2026-02-19', subject: 'Data Structures', status: 'present', method: 'QR + Face + Wi-Fi' },
  { date: '2026-02-20', subject: 'Algorithms', status: 'present', method: 'QR + Face + Wi-Fi' },
  { date: '2026-02-21', subject: 'Machine Learning', status: 'present', method: 'QR + Face + Wi-Fi' },
  { date: '2026-02-22', subject: 'Data Structures', status: 'late', method: 'QR + Face + Wi-Fi' },
  { date: '2026-02-23', subject: 'Algorithms', status: 'present', method: 'QR + Face + Wi-Fi' },
];

export const mockDailyAttendance = [
  { day: 'Mon', present: 185, absent: 15, late: 8 },
  { day: 'Tue', present: 178, absent: 22, late: 12 },
  { day: 'Wed', present: 192, absent: 8, late: 5 },
  { day: 'Thu', present: 170, absent: 30, late: 15 },
  { day: 'Fri', present: 165, absent: 35, late: 10 },
  { day: 'Sat', present: 80, absent: 10, late: 3 },
];

export const mockSubjectAttendance = [
  { name: 'Data Structures', value: 92, fill: '#6366f1' },
  { name: 'Algorithms', value: 85, fill: '#818cf8' },
  { name: 'Machine Learning', value: 78, fill: '#a5b4fc' },
  { name: 'Digital Circuits', value: 88, fill: '#c7d2fe' },
  { name: 'Thermodynamics', value: 91, fill: '#4f46e5' },
];

export const mockHeatmapData = [
  { hour: '8AM', Mon: 45, Tue: 38, Wed: 50, Thu: 35, Fri: 42, Sat: 20 },
  { hour: '9AM', Mon: 85, Tue: 72, Wed: 88, Thu: 68, Fri: 75, Sat: 30 },
  { hour: '10AM', Mon: 92, Tue: 88, Wed: 95, Thu: 82, Fri: 90, Sat: 45 },
  { hour: '11AM', Mon: 78, Tue: 95, Wed: 80, Thu: 90, Fri: 72, Sat: 35 },
  { hour: '12PM', Mon: 30, Tue: 28, Wed: 32, Thu: 25, Fri: 30, Sat: 10 },
  { hour: '1PM', Mon: 25, Tue: 22, Wed: 28, Thu: 20, Fri: 25, Sat: 8 },
  { hour: '2PM', Mon: 88, Tue: 75, Wed: 90, Thu: 70, Fri: 82, Sat: 40 },
  { hour: '3PM', Mon: 82, Tue: 68, Wed: 85, Thu: 65, Fri: 78, Sat: 35 },
  { hour: '4PM', Mon: 65, Tue: 55, Wed: 70, Thu: 50, Fri: 60, Sat: 25 },
  { hour: '5PM', Mon: 40, Tue: 35, Wed: 45, Thu: 30, Fri: 38, Sat: 15 },
];

export const mockSystemHealth = {
  qrService: { status: 'operational', uptime: '99.9%', latency: '12ms' },
  faceRecognition: { status: 'operational', uptime: '99.7%', latency: '45ms' },
  wifiFingerprint: { status: 'degraded', uptime: '98.2%', latency: '120ms' },
  database: { status: 'operational', uptime: '99.99%', latency: '5ms' },
  apiGateway: { status: 'operational', uptime: '99.95%', latency: '8ms' },
};

export const mockNotifications = [
  { id: 1, message: 'New attendance session started for CS201', time: '2 min ago', type: 'info' },
  { id: 2, message: 'Wi-Fi fingerprint service experiencing high latency', time: '15 min ago', type: 'warning' },
  { id: 3, message: 'Monthly attendance report generated', time: '1 hour ago', type: 'success' },
  { id: 4, message: 'Face recognition model updated successfully', time: '3 hours ago', type: 'success' },
];
