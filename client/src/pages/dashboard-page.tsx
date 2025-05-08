import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { ActivityCard } from "@/components/dashboard/activity-card";
import { formatNumber } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["/api/admin/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="flex h-screen">
      <Sidebar active="dashboard" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-600">Olá, Admin</span>
              <div className="w-10 h-10 rounded-full bg-[#33820D] text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Skeleton className="h-80 w-full rounded-xl" />
                <Skeleton className="h-80 w-full rounded-xl" />
              </div>
            </>
          ) : error ? (
            <div className="bg-red-100 text-red-800 p-4 rounded-xl">
              Erro ao carregar estatísticas. Por favor, tente novamente.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Submissions Card */}
                <StatCard 
                  title="Total de Submissões"
                  value={formatNumber(stats.totalSubmissions)}
                  icon="users"
                  color="green"
                  trend={{ direction: "up", value: "12%" }}
                />
                
                {/* Points Card */}
                <StatCard 
                  title="Pontos Resgatados"
                  value={formatNumber(stats.totalPoints)}
                  icon="award"
                  color="orange"
                  trend={{ direction: "up", value: "8%" }}
                />
                
                {/* Conversion Rate Card */}
                <StatCard 
                  title="Taxa de Conversão"
                  value={stats.totalSubmissions ? `${Math.round((stats.completedSubmissions / stats.totalSubmissions) * 100)}%` : "0%"}
                  icon="chart-line"
                  color="blue"
                  trend={{ direction: "up", value: "3%" }}
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart Section */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-semibold mb-4">Tendência de Resgates</h3>
                  <div className="h-64">
                    {stats.monthlyData ? (
                      <TrendChart data={stats.monthlyData} />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Sem dados disponíveis</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-xl font-semibold mb-4">Atividades Recentes</h3>
                  <div className="space-y-4">
                    {stats.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                      stats.recentSubmissions.map((submission: any, index: number) => (
                        <ActivityCard 
                          key={index}
                          type={submission.status === "completed" ? "success" : submission.status === "failed" ? "error" : "info"}
                          title={submission.status === "completed" ? "Novo resgate completado" : 
                                submission.status === "failed" ? "Submissão falhou" : "Nova submissão recebida"}
                          description={`${submission.cpf} - ${submission.status === "completed" ? 
                                       "Resgatou " + formatNumber(submission.points) + " pontos" : 
                                       "Processo em andamento"}`}
                          time={new Date(submission.createdAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
