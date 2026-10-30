import Navbar from '../../components/Navbar';
import DataTable from '../../components/DataTable';
import { mockClasses } from '../../data/mockData';

const columns = [
  { key: 'code', label: 'Code', render: (val) => <span className="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">{val}</span> },
  { key: 'name', label: 'Subject', render: (val) => <span className="font-medium text-surface-900 dark:text-white">{val}</span> },
  { key: 'faculty', label: 'Faculty' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'room', label: 'Room' },
  { key: 'students', label: 'Students' },
  { key: 'department', label: 'Dept', render: (val) => (
    <span className="px-2.5 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-medium">{val}</span>
  )},
];

export default function AdminClasses() {
  return (
    <div>
      <Navbar title="Class Management" />
      <div className="p-6">
        <DataTable
          title="All Classes"
          columns={columns}
          data={mockClasses}
          onExport={(type) => alert(`Exporting as ${type.toUpperCase()}...`)}
        />
      </div>
    </div>
  );
}
