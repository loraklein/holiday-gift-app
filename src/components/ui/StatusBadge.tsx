interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const statusStyles = {
    idea: 'bg-gray-100 text-gray-800',
    purchased: 'bg-green-100 text-green-800',
    given: 'bg-blue-100 text-blue-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span 
      className={`font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.idea} ${sizeStyles[size]}`}
    >
      {status}
    </span>
  );
}