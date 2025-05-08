import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCPF } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface CPFFormProps {
  onSubmit: (cpf: string) => void;
  isLoading: boolean;
}

export default function CPFForm({ onSubmit, isLoading }: CPFFormProps) {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCPF(e.target.value);
    setCpf(value);

    // Clear error message when user types
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CPF - simple format validation
    if (!cpf || cpf.length < 14) {
      setError("Por favor, insira um CPF válido");
      return;
    }

    // Submit valid CPF
    onSubmit(cpf);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative mb-4">
        <label htmlFor="cpf" className="flex items-center text-left text-gray-700 mb-2">
          <i className="fas fa-user mr-2"></i>
          <span>CPF:</span>
        </label>
        <input
          type="text"
          id="cpf"
          name="cpf"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 rounded-full border-2 ${
            error ? "border-red-500" : "border-[#33820D]"
          } focus:outline-none focus:border-[#276c0f]`}
          required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
      <Button
        type="submit"
        className="w-full py-6 bg-[#33820D] hover:bg-[#276c0f] text-white rounded-full font-medium"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validando...
          </>
        ) : (
          "Validar"
        )}
      </Button>
    </form>
  );
}
