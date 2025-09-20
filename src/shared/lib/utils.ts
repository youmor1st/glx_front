import { eth, sol } from "@ensdomains/address-encoder/coins";
import { QueryClient } from "@tanstack/react-query";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateAddress = (address: string) => {
  if (!address) return "";

  return address.length > 10
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : address;
};

export function animateHeight(
  target: number,
  setHeight: (h: number) => void,
  current: number
) {
  const step = () => {
    const next = current + (target - current);

    setHeight(next);
    requestAnimationFrame(step);
    current = next;
  };
  requestAnimationFrame(step);
}

export const isValidEthAddress = (address: string) => {
  try {
    eth.decode(address as any);
    return true;
  } catch (error) {
    return false;
  }
};

export const isValidSolAddress = (address: string) => {
  try {
    sol.decode(address as any);
    return true;
  } catch (error) {
    return false;
  }
};

export const queryClient = new QueryClient();
