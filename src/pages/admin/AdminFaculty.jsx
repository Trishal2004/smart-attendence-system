import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Eye, User, Mail, Phone, Calendar, BookOpen, Hash, Shield, Award, Briefcase, Clock } from 'lucide-react';
import Navbar from '../../components/Navbar';
import DataTable from '../../components/DataTable';
import { mockFaculty } from '../../data/mockData';

const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics'];
const designations = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Visiting Faculty'];
const statuses = ['Active', 'On Leave', 'Retired', 'Suspended'];
const inputClass = 'w-full px-3 py-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-surface-900 dark:text-white';
const labelClass = 'block text-xs font-medium text-surface-500 mb-1';

const emptyFaculty = {
  id: '', name: '', email: '', phone: '', dob: '', department: 'Computer Science',
  designation: 'Assistant Professor', qualification: '', experience: 0,
  subjects: [], classesThisWeek: 0, joinDate: '', status: 'Active',
};

/* ─── View Details Panel ─── */
function ViewPanel({ faculty, onClose }) {
  if (!faculty) return null;
  const fields = [
    { icon: Hash, label: 'Faculty ID', value: faculty.id },
    { icon: User, label: 'Full Name', value: faculty.name },
    { icon: Mail, label: 'Email', value: faculty.email },
    { icon: Phone, label: 'Phone', value: faculty.phone || '—' },
    { icon: Calendar, label: 'Date of Birth', value: faculty.dob || '—' },
    { icon: BookOpen, label: 'Department', value: faculty.department },
    { icon: Award, label: 'Designation', value: faculty.designation || '—' },
    { icon: Award, label: 'Qualification', value: faculty.qualification || '—' },
    { icon: Briefcase, label: 'Experience', value: faculty.experience ? `${faculty.experience} years` : '—' },
    { icon: BookOpen, label: 'Subjects', value: (faculty.subjects || []).join(', ') || '—' },
    { icon: Clock, label: 'Classes / Week', value: faculty.classesThisWeek },
    { icon: Calendar, label: 'Joined', value: faculty.joinDate || '—' },
    { icon: Shield, label: 'Status', value: faculty.status || 'Active' },
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
                {faculty.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-white">
                <h3 className="text-lg font-bold">{faculty.name}</h3>
                <p className="text-primary-200 text-sm">{faculty.id} • {faculty.designation || faculty.department}</p>
              </div>
            </div>
          </div>
          {/* Subject chips */}
          {faculty.subjects?.length > 0 && (
            <div className="px-5 pt-4 flex flex-wrap gap-1.5">
              {faculty.subjects.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">{s}</span>
              ))}
            </div>
          )}
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
function FacultyModal({ open, onClose, onSave, initial, isEdit }) {
  const [form, setForm] = useState({ ...initial, subjectsText: (initial.subjects || []).join(', ') });
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
            <h3 className="text-base font-semibold text-surface-900 dark:text-white">{isEdit ? 'Edit Faculty — All Details' : 'Add New Faculty'}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"><X className="w-5 h-5 text-surface-400" /></button>
          </div>

          <form onSubmit={e => { e.preventDefault(); onSave({ ...form, subjects: form.subjectsText.split(',').map(s => s.trim()).filter(Boolean) }); }} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Personal Information */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider">Personal Information</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Faculty ID</label><input value={form.id} onChange={e => set('id', e.target.value)} required className={inputClass} /></div>
              <div><label className={labelClass}>Full Name</label><input value={form.name} onChange={e => set('name', e.target.value)} required className={inputClass} /></div>
              <div><label className={labelClass}>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input value={form.phone || ''} onChange={e => set('phone', e.target.value)} placeholder="555-1001" className={inputClass} /></div>
              <div><label className={labelClass}>Date of Birth</label><input type="date" value={form.dob || ''} onChange={e => set('dob', e.target.value)} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status || 'Active'} onChange={e => set('status', e.target.value)} className={inputClass}>
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Professional Information */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider pt-2">Professional Information</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Department</label>
                <select value={form.department} onChange={e => set('department', e.target.value)} className={inputClass}>
                  {departments.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Designation</label>
                <select value={form.designation || 'Assistant Professor'} onChange={e => set('designation', e.target.value)} className={inputClass}>
                  {designations.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Qualification</label><input value={form.qualification || ''} onChange={e => set('qualification', e.target.value)} placeholder="Ph.D. in ..." className={inputClass} /></div>
              <div><label className={labelClass}>Experience (years)</label><input type="number" min={0} max={50} value={form.experience || 0} onChange={e => set('experience', Number(e.target.value))} className={inputClass} /></div>
              <div><label className={labelClass}>Join Date</label><input type="date" value={form.joinDate || ''} onChange={e => set('joinDate', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Classes / Week</label><input type="number" min={0} max={30} value={form.classesThisWeek} onChange={e => set('classesThisWeek', Number(e.target.value))} className={inputClass} /></div>
            </div>

            {/* Subjects */}
            <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider pt-2">Teaching</p>
            <div>
              <label className={labelClass}>Subjects <span className="text-surface-400">(comma separated)</span></label>
              <input value={form.subjectsText} onChange={e => set('subjectsText', e.target.value)} placeholder="e.g. Data Structures, Algorithms" className={inputClass} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3 border-t border-surface-200 dark:border-surface-800">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 text-sm font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">Cancel</button>
              <button type="submit" className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors">{isEdit ? 'Save All Changes' : 'Add Faculty'}</button>
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
          <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Delete Faculty</h3>
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
export default function AdminFaculty() {
  const [faculty, setFaculty] = useState([...mockFaculty]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);

  const handleAdd = () => { setEditTarget(null); setModalOpen(true); };
  const handleEdit = (row) => { setEditTarget(row); setModalOpen(true); };
  const handleSave = (form) => {
    const { subjectsText, ...data } = form;
    if (editTarget) {
      // Use original ID for lookup in case ID was changed
      setFaculty(prev => prev.map(f => f.id === editTarget.id ? { ...data } : f));
    } else {
      setFaculty(prev => [...prev, data]);
    }
    setModalOpen(false);
    setEditTarget(null);
  };
  const handleDelete = () => {
    setFaculty(prev => prev.filter(f => f.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', render: (val) => <span className="font-medium text-surface-900 dark:text-white">{val}</span> },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Dept', render: (val) => (
      <span className="px-2.5 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">{val}</span>
    )},
    { key: 'designation', label: 'Designation', render: (val) => (
      <span className="text-xs text-surface-600 dark:text-surface-400">{val || '—'}</span>
    )},
    { key: 'subjects', label: 'Subjects', render: (val) => (
      <div className="flex flex-wrap gap-1">
        {(val || []).map((s, i) => (
          <span key={i} className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 rounded-md text-xs">{s}</span>
        ))}
      </div>
    )},
    { key: 'status', label: 'Status', render: (val) => {
      const color = val === 'Active' ? 'success' : val === 'On Leave' ? 'warning' : 'danger';
      return <span className={`px-2 py-1 bg-${color}-500/10 text-${color}-500 rounded-lg text-xs font-medium`}>{val || 'Active'}</span>;
    }},
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
      <Navbar title="Faculty Management" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">All Faculty Members</h2>
          <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Add Faculty
          </button>
        </div>
        <DataTable title="Faculty Records" columns={columns} data={faculty} onExport={(type) => alert(`Exporting as ${type.toUpperCase()}...`)} />
      </div>

      <FacultyModal open={modalOpen} onClose={() => { setModalOpen(false); setEditTarget(null); }} onSave={handleSave} initial={editTarget || emptyFaculty} isEdit={!!editTarget} />
      <DeleteConfirm open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} name={deleteTarget?.name} />
      <ViewPanel faculty={viewTarget} onClose={() => setViewTarget(null)} />
    </div>
  );
}
