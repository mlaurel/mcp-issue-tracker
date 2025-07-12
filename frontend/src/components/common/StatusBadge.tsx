import { Badge } from "@/components/ui/badge";
import type { Issue } from "@/types";

interface StatusBadgeProps {
  status: Issue["status"];
  className?: string;
}

const statusConfig = {
  open: {
    variant: "default" as const,
    label: "Open",
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  in_progress: {
    variant: "secondary" as const,
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  resolved: {
    variant: "outline" as const,
    label: "Resolved",
    className: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  },
  closed: {
    variant: "secondary" as const,
    label: "Closed",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${className || ""}`}
    >
      {config.label}
    </Badge>
  );
}
