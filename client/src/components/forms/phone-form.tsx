import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatPhone } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PhoneFormProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
}

export default function PhoneForm({ onSubmit, isLoading }: PhoneFormProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatPhone(e.target.value);
    setPhone(value);

    // Clear error when typing
    if (error) setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation - check for correct format
    if (!phone || phone.length < 14) {
      setError("Por favor, insira um telefone válido");
      return;
    }

    onSubmit(phone);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative mb-4">
        <label htmlFor="telefone" className="flex items-center text-left text-gray-700 mb-2">
          <i className="fas fa-phone-alt mr-2"></i>
          <span>Telefone:</span>
        </label>
        <input
          type="text"
          id="telefone"
          name="telefone"
          placeholder="(XX) XXXXX-XXXX"
          value={phone}
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
          </>
        ) : (
          "Continuar"
        )}
      </Button>
    </form>
  );
}
