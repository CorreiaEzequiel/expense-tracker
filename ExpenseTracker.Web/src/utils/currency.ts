/**
 * Formata um valor numérico para o padrão de moeda brasileira (Real)
 * Usa Intl.NumberFormat nativo do JavaScript para garantir formatação correta
 * Exemplo: 1234.56 -> R$ 1.234,56 (separador de milhar: ponto, decimal: vírgula)
 * 
 * IMPORTANTE: Esta formatação é apenas para exibição (display-only).
 * Os valores enviados para o backend continuam como números.
 * 
 * @param value - Valor numérico a ser formatado
 * @returns String formatada no padrão BRL
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return 'R$ 0,00'
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
