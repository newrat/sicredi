import { cn } from "@/lib/utils";

interface ActivityCardProps {
  type: "success" | "info" | "error";
  title: string;
  description: string;
  time: string;
}

export function ActivityCard({ type, title, description, time }: ActivityCardProps) {
  const typeStyles = {
    success: {
      bgColor: "bg-[#33820D]",
      lightBg: "bg-green-100",
      icon: "fas fa-user-check",
    },
    info: {
      bgColor: "bg-blue-500",
      lightBg: "bg-blue-100",
      icon: "fas fa-user-plus",
    },
    error: {
      bgColor: "bg-[#FF6B00]",
      lightBg: "bg-orange-100",
      icon: "fas fa-exclamation-triangle",
    },
  };

  const { bgColor, icon } = typeStyles[type];

  return (
    <div className="flex items-start">
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white mr-3", bgColor)}>
        <i className={icon}></i>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}
