// Функция форматирования суммы токенов
export function formatTokenAmount(amount: number): string {
  // Проверяем на валидное число
  if (!Number.isFinite(amount) || isNaN(amount)) {
    return "0";
  }
  
  if (amount === 0) return "0";
  
  if (amount < 0.000001) {
    return amount.toExponential(2);
  }
  
  if (amount < 1) {
    const formatted = amount.toFixed(6);
    return formatted.replace(/\.?0+$/, '');
  }
  
  if (amount < 1000) {
    const formatted = amount.toFixed(4);
    return formatted.replace(/\.?0+$/, '');
  }
  
  return amount.toFixed(2);
}

// Функция форматирования USD с сокращениями
export function formatUSDCompact(amount: number): string {
  // Проверяем на валидное число
  if (!Number.isFinite(amount) || isNaN(amount)) {
    return "$0";
  }
  
  if (amount < 1) {
    return `$${amount.toFixed(4)}`;
  }
  
  if (amount < 1000) {
    return `$${amount.toFixed(2)}`;
  }
  
  if (amount < 1000000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  
  return `$${(amount / 1000000).toFixed(1)}M`;
}

// Функция форматирования USD
export function formatUSD(amount: number): string {
  // Проверяем на валидное число
  if (!Number.isFinite(amount) || isNaN(amount)) {
    return "$0";
  }
  
  if (amount < 1) {
    return `$${amount.toFixed(4)}`;
  }
  
  const parts = amount.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${parts.join('.')}`;
}
