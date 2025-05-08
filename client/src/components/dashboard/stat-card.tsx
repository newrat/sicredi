import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: "green" | "orange" | "blue";
  trend?: {
    direction: "up" | "down";
    value: string;
  };
}

export function StatCard({ title, value, icon, color, trend }: StatCardProps) {
  const colorMap = {
    green: {
      border: "border-[#33820D]",
      bg: "bg-[#33820D]",
      bgOpacity: "bg-opacity-10",
      text: "text-[#33820D]",
    },
    orange: {
      border: "border-[#FF6B00]",
      bg: "bg-[#FF6B00]",
      bgOpacity: "bg-opacity-10",
      text: "text-[#FF6B00]",
    },
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500",
      bgOpacity: "bg-opacity-10",
      text: "text-blue-500",
    },
  };

  const { border, bg, bgOpacity, text } = colorMap[color];

  return (
    <div className={cn("bg-white rounded-xl shadow p-6 border-l-4", border)}>
      <div className="flex justify-between items-center">
        <h3 className="text-gray-600">{title}</h3>
        <span className={cn("p-2 rounded-full", bg, bgOpacity, text)}>
          <i className={`fas fa-${icon}`}></i>
        </span>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {trend && (
        <p className="text-gray-500 text-sm mt-2">
          <span className={text}>
            <i className={`fas fa-arrow-${trend.direction}`}></i> {trend.value}
          </span>{" "}
          desde o mês passado
        </p>
      )}
    </div>
  );
}
