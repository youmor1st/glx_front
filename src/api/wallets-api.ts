import axios from "axios";

export async function getHotWallets() {
  const response = await axios.get(
    "https://api.owlidar.com/wallets_sender/v1/wallets/hot"
  );
  return response.data.data;
}

export async function getSavedWallets() {
  const userId = localStorage.getItem("userId");
  if (!userId) return new Error("No userId provided.");

  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `https://api.owlidar.com/userFilter/v1/users/${userId}/filters`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.filters;
}

export async function getWalletByAddress(address: string) {
  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `https://api.owlidar.com/wallets_sender/v1/wallets/${address}/info`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
  return response.data;
}

export async function getPublicWalletByUser() {
  const userId = localStorage.getItem("userId");
  if (!userId) return new Error("No userId provided.");

  const token = localStorage.getItem("authToken");

  const response = await axios.get(
    `https://api.owlidar.com/userFilter/v1/users/${userId}/wallets`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("public wallet ", response);
  return response.data.wallets;
}

export async function createUserWallet(data: any) {
  const userId = localStorage.getItem("userId");
  if (!userId) return new Error("No userId provided.");

  const token = localStorage.getItem("authToken");

  const response = await axios.post(
    `https://api.owlidar.com/userFilter/v1/users/${userId}/filters/create`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response);
}
