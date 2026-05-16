type Status = 'Open' | 'In Progress' | 'Closed';

const styles: Record<Status, string> = {
  Open:        'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  'In Progress':'bg-amber-50  text-amber-700  ring-1 ring-amber-200',
  Closed:      'bg-slate-100  text-slate-500  ring-1 ring-slate-200',
};

export default function StatusBadge({ status }: { status: string }) {
  const cls = styles[status as Status] ?? styles.Closed;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
