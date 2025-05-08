import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format CPF: 000.000.000-00
export function formatCPF(value: string): string {
  if (!value) return "";
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  if (digits.length > 11) {
    return digits.substring(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  
  if (digits.length > 9) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
  }
  
  if (digits.length > 6) {
    return digits.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
  }
  
  if (digits.length > 3) {
    return digits.replace(/(\d{3})(\d{1,3})/, "$1.$2");
  }
  
  return digits;
}

// Format phone: (00) 00000-0000
export function formatPhone(value: string): string {
  if (!value) return "";
  
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  if (digits.length > 10) {
    return digits.substring(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
  
  if (digits.length > 6) {
    return digits.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
  }
  
  if (digits.length > 2) {
    return digits.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }
  
  return digits.length > 0 ? `(${digits}` : digits;
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format status badge styles
export function getStatusBadgeStyle(status: string): string {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
    case 'started':
    case 'phone_added':
    case 'account_added':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Format status labels
export function formatStatus(status: string): string {
  switch (status) {
    case 'completed':
      return 'Completo';
    case 'failed':
      return 'Falha';
    case 'pending':
      return 'Pendente';
    case 'started':
      return 'Iniciado';
    case 'phone_added':
      return 'Telefone Adicionado';
    case 'account_added':
      return 'Conta Adicionada';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

// Format numbers with thousands separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pt-BR').format(num);
}
