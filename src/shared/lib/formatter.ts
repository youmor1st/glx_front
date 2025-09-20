export function formatThousands(value: number): string {
  if (value === 0) return "0";
  if (!value) return "";
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K";

  return value.toFixed(2);
}

export function formatTwoDecimals(value: number): string {
  if (value === 0) return "0";
  if (!value) return "";

  return value.toFixed(2);
}

export function formatAddress(address: string): string {
  if (!address) return "";

  if (address.length <= 10) return address;
  else if (address.length < 16) {
    return `${address.substring(0, 4)}...${address.substring(
      address.length - 4
    )}`;
  } else {
    return `${address.substring(0, 8)}...${address.substring(
      address.length - 8
    )}`;
  }
}
