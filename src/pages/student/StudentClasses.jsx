import Navbar from '../../components/Navbar';
import DataTable from '../../components/DataTable';
import { mockClasses } from '../../data/mockData';

const columns = [
  { key: 'code', label: 'Code', render: (val) => <span className="font-mono text-xs bg-surface-100 dark:bg-surface-800 px-2 py-1 rounded">{val}</span> },
  { key: 'name', label: 'Subject', render: (val) => <span className="font-medium text-surface-900 dark:text-white">{val}</span> },
  { key: 'faculty', label: 'Faculty' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'room', label: 'Room' },
];

export default function StudentClasses() {
  return (
    <div>
      <Navbar title="My Classes" />
      <div className="p-6">
        <DataTable
          title="Enrolled Classes"
          columns={columns}
          data={mockClasses}
        />
      </div>
    </div>
  );
}
