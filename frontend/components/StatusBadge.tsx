type Status = 'Open' | 'In Progress' | 'Closed';

const colours: Record<Status, string> = {
  Open: 'bg-green-100 text-green-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Closed: 'bg-gray-100 text-gray-500',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = colours[status as Status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      {status}
    </span>
  );
}
