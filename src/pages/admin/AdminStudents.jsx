import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Eye, User, Mail, Phone, MapPin, Calendar, GraduationCap, Hash, Shield, BookOpen, Users } from 'lucide-react';
import Navbar from '../../components/Navbar';
import DataTable from '../../components/DataTable';
import { mockStudents } from '../../data/mockData';

const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics'];
const statuses = ['Active', 'Warning', 'Suspended', 'Inactive'];
const inputClass = 'w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white';
const labelClass = 'block text-xs font-medium text-surface-500 mb-1';

const emptyStudent = {
  id: '', name: '', email: '', phone: '', dob: '', department: 'Computer Science',
  year: 1, semester: 1, rollNo: '', guardianName: '', guardianPhone: '',
  address: '', enrollmentDate: '', attendance: 0, status: 'Active',
};

/* ─── View Details Panel ─── */
function ViewPanel({ student, onClose }) {
  if (!student) return null;
  const fields = [
    { icon: Hash, label: 'Student ID', value: student.id },
    { icon: User, label: 'Full Name', value: student.name },
    { icon: Mail, label: 'Email', value: student.email },
    { icon: Phone, label: 'Phone', value: student.phone || '—' },
    { icon: Calendar, label: 'Date of Birth', value: student.dob || '—' },
    { icon: BookOpen, label: 'Department', value: student.department },
    { icon: GraduationCap, label: 'Year / Semester', value: `Year ${student.year} • Sem ${student.semester || '—'}` },
    { icon: Hash, label: 'Roll Number', value: student.rollNo || '—' },
    { icon: Users, label: 'Guardian', value: student.guardianName ? `${student.guardianName} (${student.guardianPhone || '—'})` : '—' },
    { icon: MapPin, label: 'Address', value: student.address || '—' },
    { icon: Calendar, label: 'Enrolled', value: student.enrollmentDate || '—' },
    { icon: Shield, label: 'Status', value: student.status || 'Active' },
  ];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-2xl w-full max-w-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-5 relative">
            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="text-white">
                <h3 className="text-lg font-bold">{student.name}</h3>
                <p className="text-primary-200 text-sm">{student.id} • {student.department} • Year {student.year}</p>
              </div>
            </div>
          </div>
          {/* Attendance */}
          <div className="px-5 pt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-surface-400">Overall Attendance</span>
              <span className={`text-sm font-bold ${student.attendance >= 85 ? 'text-success-500' : student.attendance >= 75 ? 'text-warning-500' : 'text-danger-500'}`}>{student.attendance}%</span>
            </div>
            <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${student.attendance}%` }} transition={{ duration: 0.6 }}
                className={`h-full rounded-full ${student.attendance >= 85 ? 'bg-success-500' : student.attendance >= 75 ? 'bg-warning-400' : 'bg-danger-500'}`} />
            </div>
          </div>
          {/* Fields */}
          <div className="p-5 grid sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
            {fields.map(({ icon: Icon, label, value }, i) => (
              <motion.div key={label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-50 dark:bg-surface-800/50">
                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0"><Icon className="w-3.5 h-3.5 text-primary-500" /></div>
                <div className="min-w-0"><p className="text-[10px] uppercase tracking-wider text-surface-400">{label}</p><p className="text-sm font-medium text-surface-900 dark:text-white truncate">{value}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Add / Edit Modal ─── */
function StudentModal({ open, onClose, onSave, initial, isEdit }) {
  const [form, setForm] = useState(initial || emptyStudent);
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-2xl w-full max-w-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">{isEdit ? 'Edit Student — All Details' : 'Add New Student'}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"><X className="w-5 h-5 text-surface-400" /></button>
          </div>

          <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Personal Information */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Personal Information</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Student ID</label><input value={form.id} onChange={e => set('id', e.target.value)} required className={inputClass} /></div>
              <div><label className={labelClass}>Full Name</label><input value={form.name} onChange={e => set('name', e.target.value)} required className={inputClass} /></div>
              <div><label className={labelClass}>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="555-0101" className={inputClass} /></div>
              <div><label className={labelClass}>Date of Birth</label><input type="date" value={form.dob || ''} onChange={e => set('dob', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Address</label><input value={form.address || ''} onChange={e => set('address', e.target.value)} className={inputClass} /></div>
            </div>

            {/* Academic Information */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider pt-2">Academic Information</p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Department</label>
                <select value={form.department} onChange={e => set('department', e.target.value)} className={inputClass}>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <select value={form.year} onChange={e => set('year', Number(e.target.value))} className={inputClass}>
                  {[1,2,3,4].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Semester</label>
                <select value={form.semester || 1} onChange={e => set('semester', Number(e.target.value))} className={inputClass}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Roll Number</label><input value={form.rollNo || ''} onChange={e => set('rollNo', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Enrollment Date</label><input type="date" value={form.enrollmentDate || ''} onChange={e => set('enrollmentDate', e.target.value)} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status || 'Active'} onChange={e => set('status', e.target.value)} className={inputClass}>
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Attendance */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider pt-2">Attendance</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Attendance %</label><input type="number" min={0} max={100} value={form.attendance} onChange={e => set('attendance', Number(e.target.value))} className={inputClass} /></div>
            </div>

            {/* Guardian Information */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider pt-2">Guardian / Parent</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Guardian Name</label><input value={form.guardianName || ''} onChange={e => set('guardianName', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Guardian Phone</label><input value={form.guardianPhone || ''} onChange={e => set('guardianPhone', e.target.value)} className={inputClass} /></div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-surface-200 dark:border-surface-800">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-sm font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors">{isEdit ? 'Save All Changes' : 'Add Student'}</button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Delete Confirm ─── */
function DeleteConfirm({ open, onClose, onConfirm, name }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
          className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-2xl w-full max-w-sm p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-danger-500/10 flex items-center justify-center"><Trash2 className="w-6 h-6 text-danger-500" /></div>
          <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Delete Student</h3>
          <p className="text-sm text-surface-500 mb-6">Are you sure you want to delete <span className="font-medium text-surface-700 dark:text-surface-300">{name}</span>? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-sm font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-2.5 bg-danger-500 hover:bg-danger-500/90 text-white text-sm font-medium rounded-xl transition-colors">Delete</button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Main Page ─── */
export default function AdminStudents() {
  const [students, setStudents] = useState([...mockStudents]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
  const handleEdit = (row) => { setEditTarget(row); setModalOpen(true); };
  const handleSave = (form) => {
    if (editTarget) {
      // Use original ID for lookup in case ID was changed
      setStudents(prev => prev.map(s => s.id === editTarget.id ? { ...form } : s));
    } else {
      setStudents(prev => [...prev, form]);
    }
    setModalOpen(false);
    setEditTarget(null);
  };
  const handleDelete = () => {
    setStudents(prev => prev.filter(s => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (val) => <span className="font-medium text-surface-900 dark:text-white">{val}</span> },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Dept', render: (val) => (
      <span className="px-2.5 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">{val}</span>
    )},
    { key: 'year', label: 'Year' },
    { key: 'status', label: 'Status', render: (val) => {
      const color = val === 'Active' ? 'success' : val === 'Warning' ? 'warning' : 'danger';
      return <span className={`px-2 py-1 bg-${color}-500/10 text-${color}-500 rounded-lg text-xs font-medium`}>{val || 'Active'}</span>;
    }},
    { key: 'attendance', label: 'Attendance', render: (val) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${val >= 85 ? 'bg-success-500' : val >= 75 ? 'bg-warning-400' : 'bg-danger-500'}`} style={{ width: `${val}%` }} />
        </div>
        <span className={`text-xs font-medium ${val >= 85 ? 'text-success-500' : val >= 75 ? 'text-warning-500' : 'text-danger-500'}`}>{val}%</span>
      </div>
    )},
    { key: '_actions', label: 'Actions', render: (_, row) => (
      <div className="flex items-center gap-1">
        <button onClick={() => setViewTarget(row)} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-400 hover:text-primary-500 transition-colors" title="View Details">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => handleEdit(row)} className="p-1.5 rounded-lg hover:bg-primary-500/10 text-surface-400 hover:text-primary-500 transition-colors" title="Edit All Details">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => setDeleteTarget(row)} className="p-1.5 rounded-lg hover:bg-danger-500/10 text-surface-400 hover:text-danger-500 transition-colors" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <Navbar title="Student Management" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">All Students</h2>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
        <DataTable title="Student Records" columns={columns} data={students} onExport={(type) => alert(`Exporting as ${type.toUpperCase()}...`)} />
      </div>

      <StudentModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} onSave={handleSave} initial={editTarget || emptyStudent} isEdit={!!editTarget} />
      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name} />
      <ViewPanel student={viewTarget} onClose={() => setViewTarget(null)} />
    </div>
  );
}
