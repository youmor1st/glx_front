import axios from "axios";

export async function getBalanceByAddress(data: {
  blockchain: string;
  publicAddress: string;
}) {
  const userId = localStorage.getItem("userId");
  if (!userId) return new Error("No userId provided.");

  const token = localStorage.getItem("authToken");
  if (!token) return new Error("No authToken provided.");

  try {
    const response = await axios.post(
      "https://api.owlidar.com/accountinfo/v1/token/info",
      {
        blockchain: data.blockchain ?? "SOL",
        publicAddress: data.publicAddress,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(error.responsec || error.message);
    throw error;
  }
}
