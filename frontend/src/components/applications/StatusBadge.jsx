const config = {
  applied: { label: 'Applied', cls: 'bg-blue-100 text-blue-700' },
  under_review: { label: 'Under Review', cls: 'bg-yellow-100 text-yellow-700' },
  interview_scheduled: { label: 'Interview Scheduled', cls: 'bg-purple-100 text-purple-700' },
  selected: { label: 'Selected', cls: 'bg-green-100 text-green-700' },
  rejected: { label: 'Rejected', cls: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }) {
  const { label, cls } = config[status] || { label: status, cls: 'bg-gray-100 text-gray-600' };
  return <span className={`badge ${cls}`}>{label}</span>;
}
