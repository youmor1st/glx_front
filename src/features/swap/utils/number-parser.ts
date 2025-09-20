
// Основные утилиты для обработки числовых данных в swap компонентах

// Парсер числового ввода с поддержкой запятых
export const parseNumber = (v?: string): number => {
  if (!v) return 0;
  const normalized = v.replace(/,/g, ".").replace(/[^0-9.]/g, "");
  const parts = normalized.split(".");
  const result = parts.length <= 1 ? normalized : parts[0] + "." + parts.slice(1).join("");
  const num = Number(result);
  return Number.isFinite(num) ? num : 0;
};

// Нормализация пользовательского ввода
export const normalizeInput = (raw: string): string => {
  let s = raw.replace(/,/g, ".").replace(/[^0-9.]/g, "");

  // Оставляем только первую точку
  const firstDotIndex = s.indexOf(".");
  if (firstDotIndex !== -1) {
    const before = s.slice(0, firstDotIndex);
    const after = s.slice(firstDotIndex + 1).replace(/\./g, "").slice(0, 6);
    s = before + "." + after;
  }

  // Убираем лишние нули: "0001" => "1", но сохраняем "0.x"
  if (s.length > 1 && s[0] === "0" && s[1] !== ".") {
    s = s.replace(/^0+/, "") || "0";
  }

  return s;
};

// Валидация длины числа (макс 8 цифр до точки, 6 после)
export const validateNumberLength = (s: string): boolean => {
  const [intPart = "", decPart = ""] = s.split(".");
  return intPart.length <= 8 && decPart.length <= 6;
};

// Валидация минимального значения
export const validateMinValue = (s: string): boolean => {
  if (!s || s === ".") return true;
  const num = Number(s);
  if (Number.isNaN(num) || num <= 0) return true;
  // Минимально допустимое значение: 0.000001
  return num >= 0.000001;
};
