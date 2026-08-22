const API_URL = "https://api.binance.com/api/v3/ticker/price";

export async function getMarketPrices() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch market prices");
    }

    const data = await response.json();

    const symbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT"];

    return data.filter((coin) => symbols.includes(coin.symbol));
  } catch (error) {
    console.error("Market API Error:", error);
    return [];
  }
}