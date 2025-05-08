import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SicrediLogo } from "@/components/ui/sicredi-logo";

// Import assets
import sicrediHeroImg from '../assets/sicredi-hero.png';

const loginSchema = z.object({
  username: z.string().min(3, "Nome de usuário precisa ter pelo menos 3 caracteres"),
  password: z.string().min(4, "Senha precisa ter pelo menos 4 caracteres"),
});

const registerSchema = loginSchema.extend({
  confirmPassword: z.string().min(4, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [location, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/");
    }
  }, [user, navigate]);

  // Login form
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  // Handle register submission
  const onRegisterSubmit = (data: RegisterForm) => {
    const { username, password } = data;
    registerMutation.mutate({ username, password, isAdmin: false });
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column - Forms */}
      <div className="flex items-center justify-center w-full lg:w-1/2 p-4 lg:p-12 bg-white">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <SicrediLogo className="h-16" />
            </div>
            <CardTitle className="text-2xl font-bold">Área Administrativa</CardTitle>
            <CardDescription>
              Faça login ou crie uma conta para acessar o painel administrativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Registro</TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nome de Usuário</Label>
                      <Input 
                        id="username" 
                        type="text" 
                        placeholder="admin" 
                        {...loginForm.register("username")} 
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-red-500 text-sm">{loginForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        {...loginForm.register("password")} 
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-red-500 text-sm">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#33820D] hover:bg-[#276c0f]"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Entrando..." : "Entrar"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Nome de Usuário</Label>
                      <Input 
                        id="reg-username" 
                        type="text" 
                        placeholder="seu_usuario" 
                        {...registerForm.register("username")} 
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Senha</Label>
                      <Input 
                        id="reg-password" 
                        type="password" 
                        placeholder="••••••••" 
                        {...registerForm.register("password")} 
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Senha</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        {...registerForm.register("confirmPassword")} 
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{registerForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-[#33820D] hover:bg-[#276c0f]"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Registrando..." : "Registrar"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-500 w-full">
              Voltar para a <a href="/" className="text-[#33820D] hover:underline">página principal</a>
            </p>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right Column - Hero Image and Info */}
      <div className="hidden lg:block lg:w-1/2" 
        style={{
          background: `url(${sicrediHeroImg}) no-repeat center center`,
          backgroundSize: 'cover',
          backgroundColor: '#33820D'
        }}>
        <div className="h-full flex flex-col items-center justify-center p-12 text-white" 
          style={{ 
            background: 'linear-gradient(to right, rgba(51, 130, 13, 0.9), rgba(51, 130, 13, 0.85))'
          }}>
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-4">Painel Administrativo Sicredi</h1>
            <p className="text-lg mb-8">
              Gerencie as submissões de usuários, visualize estatísticas e configure o sistema através deste painel intuitivo.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Gerencie todas as submissões de formulários</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Visualize estatísticas em tempo real</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Configurações personalizáveis do sistema</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
