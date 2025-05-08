import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Cog, FileSpreadsheet, File } from "lucide-react";

export default function SettingsPage() {
  const [retentionPeriod, setRetentionPeriod] = useState("90");
  const [notifications, setNotifications] = useState({
    email: true,
    system: true,
    mobile: false
  });

  // Handle save settings
  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso."
    });
  };

  // Handle export data
  const handleExportData = (format: string) => {
    toast({
      title: "Exportação iniciada",
      description: `Os dados estão sendo exportados no formato ${format.toUpperCase()}.`
    });
  };

  return (
    <div className="flex h-screen">
      <Sidebar active="settings" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Configurações</h1>
          
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Notification Settings */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Notificações</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={notifications.email} 
                          onCheckedChange={(checked) => setNotifications({...notifications, email: checked as boolean})}
                          className="text-[#33820D] border-gray-300"
                        />
                        <span>Notificações por email</span>
                      </Label>
                      <Button variant="ghost" size="icon">
                        <Cog className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={notifications.system} 
                          onCheckedChange={(checked) => setNotifications({...notifications, system: checked as boolean})}
                          className="text-[#33820D] border-gray-300"
                        />
                        <span>Alertas do sistema</span>
                      </Label>
                      <Button variant="ghost" size="icon">
                        <Cog className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox 
                          checked={notifications.mobile} 
                          onCheckedChange={(checked) => setNotifications({...notifications, mobile: checked as boolean})}
                          className="text-[#33820D] border-gray-300"
                        />
                        <span>Notificações móveis</span>
                      </Label>
                      <Button variant="ghost" size="icon">
                        <Cog className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Data Management */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Gerenciamento de Dados</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-gray-600 mb-2">Período de retenção de dados</Label>
                      <Select
                        value={retentionPeriod}
                        onValueChange={setRetentionPeriod}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o período" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 dias</SelectItem>
                          <SelectItem value="60">60 dias</SelectItem>
                          <SelectItem value="90">90 dias</SelectItem>
                          <SelectItem value="180">6 meses</SelectItem>
                          <SelectItem value="365">1 ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="block text-gray-600 mb-2">Exportar dados</Label>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                          onClick={() => handleExportData('csv')}
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" /> CSV
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                          onClick={() => handleExportData('excel')}
                        >
                          <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-gray-300 text-gray-700"
                          onClick={() => handleExportData('pdf')}
                        >
                          <File className="h-4 w-4 mr-2" /> PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* User Management */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Gerenciamento de Usuários</h3>
                  <Button className="bg-[#33820D] hover:bg-[#276c0f]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Adicionar Usuário
                  </Button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 px-6 py-4 flex justify-end">
              <Button variant="outline" className="mr-2">
                Cancelar
              </Button>
              <Button 
                className="bg-[#33820D] hover:bg-[#276c0f]"
                onClick={handleSaveSettings}
              >
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
