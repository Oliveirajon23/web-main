export const SUBJECT_OPTIONS = [
  { value: "Artes", label: "Artes" },
  { value: "Biologia", label: "Biologia" },
  { value: "Ciências", label: "Ciências" },
  { value: "Educação física", label: "Educação física" },
  { value: "Física", label: "Física" },
  { value: "Geografia", label: "Geografia" },
  { value: "História", label: "História" },
  { value: "Matemática", label: "Matemática" },
  { value: "Português", label: "Português" },
  { value: "Química", label: "Química" },
]

export const WEEK_DAY_OPTIONS = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
]

export function formatWhatsappMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)

  if (digits.length === 0) return ""
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}