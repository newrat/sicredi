import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCPF, formatPhone, formatDate, getStatusBadgeStyle, formatStatus } from "@/lib/utils";
import { Loader2, Search, Filter, Eye, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function SubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch submissions
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["/api/admin/submissions"],
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/submissions/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Submissão excluída",
        description: "A submissão foi excluída com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/submissions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setDeleteConfirmOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a submissão.",
        variant: "destructive",
      });
    },
  });

  // Handle view details
  const handleViewDetails = (submission: any) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };

  // Handle delete
  const handleDelete = (submission: any) => {
    setSelectedSubmission(submission);
    setDeleteConfirmOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedSubmission) {
      deleteMutation.mutate(selectedSubmission.id);
    }
  };

  // Filter submissions based on search query
  const filteredSubmissions = submissions?.filter((submission: any) => {
    const query = searchQuery.toLowerCase();
    return (
      submission.cpf?.toLowerCase().includes(query) ||
      submission.phone?.toLowerCase().includes(query) ||
      submission.cooperativa?.toLowerCase().includes(query) ||
      submission.account?.toLowerCase().includes(query) ||
      formatStatus(submission.status).toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex h-screen">
      <Sidebar active="submissions" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Submissões</h1>
            <div className="flex">
              <div className="relative mr-4">
                <Input 
                  type="text" 
                  placeholder="Buscar por CPF, telefone..."
                  className="pl-10 pr-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Search className="h-4 w-4" />
                </div>
              </div>
              <Button className="bg-[#33820D] hover:bg-[#276c0f]">
                <Filter className="h-4 w-4 mr-1" /> Filtrar
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#33820D]" />
                <span className="ml-2">Carregando submissões...</span>
              </div>
            ) : (
              <DataTable 
                data={filteredSubmissions || []}
                columns={[
                  { header: "ID", accessor: "id", cell: (row) => `#${row.id}` },
                  { 
                    header: "CPF", 
                    accessor: "cpf", 
                    cell: (row) => formatCPF(row.cpf) 
                  },
                  { 
                    header: "Telefone", 
                    accessor: "phone", 
                    cell: (row) => row.phone ? formatPhone(row.phone) : "-" 
                  },
                  { 
                    header: "Cooperativa", 
                    accessor: "cooperativa", 
                    cell: (row) => row.cooperativa || "-" 
                  },
                  { 
                    header: "Conta", 
                    accessor: "account", 
                    cell: (row) => row.account || "-" 
                  },
                  { 
                    header: "Status", 
                    accessor: "status",
                    cell: (row) => (
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyle(row.status)}`}>
                        {formatStatus(row.status)}
                      </span>
                    )
                  },
                  { 
                    header: "Data", 
                    accessor: "createdAt", 
                    cell: (row) => formatDate(row.createdAt) 
                  },
                  { 
                    header: "Ações", 
                    accessor: "actions",
                    cell: (row) => (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleViewDetails(row)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(row)} 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  }
                ]}
                paginationProps={{
                  itemsPerPage: 10,
                  totalLabel: (from, to, total) => `Mostrando ${from}-${to} de ${total} registros`
                }}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Details Dialog */}
      {selectedSubmission && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Submissão #{selectedSubmission.id}</DialogTitle>
              <DialogDescription>
                Informações completas sobre esta submissão
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">CPF</h4>
                  <p>{formatCPF(selectedSubmission.cpf)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeStyle(selectedSubmission.status)}`}>
                    {formatStatus(selectedSubmission.status)}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Telefone</h4>
                  <p>{selectedSubmission.phone ? formatPhone(selectedSubmission.phone) : "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data de Criação</h4>
                  <p>{formatDate(selectedSubmission.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Cooperativa</h4>
                  <p>{selectedSubmission.cooperativa || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Conta</h4>
                  <p>{selectedSubmission.account || "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pontos</h4>
                  <p>{selectedSubmission.points ? selectedSubmission.points.toLocaleString() : "-"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Senha Fornecida</h4>
                  <p>{selectedSubmission.password ? selectedSubmission.password : "Não"}</p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDetailsOpen(false)}
              >
                Fechar
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  setDetailsOpen(false);
                  setDeleteConfirmOpen(true);
                }}
              >
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta submissão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteMutation.isPending ? 
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 
                null
              }
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
