// Vercel Serverless Function: WiseTrade AI Support Endpoint
// NOTE: Secrets like OPENAI_API_KEY are accessed strictly via process.env on the server.
// They are NEVER prefixed with VITE_ and are NEVER exposed to the client or browser.

export default async function handler(req, res) {
  // CORS handling for development and cross-origin requests
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        reply: "Please enter a message so I can assist you.",
      });
    }

    const trimmedMessage = message.trim();
    let reply = "";

    // 1. If OPENAI_API_KEY is configured in Vercel Environment Variables (Server-side)
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      try {
        const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are the official WiseTrade AI Support Assistant. WiseTrade is a modern crypto exchange and simulated paper-trading platform. Assist users with simulated deposits, withdrawals, order blotters, spot trading terminal, TradingView charts, and wallet vault security. Keep answers friendly, concise, and professional.",
              },
              { role: "user", content: trimmedMessage },
            ],
            max_tokens: 350,
            temperature: 0.7,
          }),
        });

        if (openAiResponse.ok) {
          const data = await openAiResponse.json();
          reply = data.choices?.[0]?.message?.content?.trim();
        } else {
          console.warn("OpenAI API returned status:", openAiResponse.status);
        }
      } catch (openAiErr) {
        console.warn("OpenAI serverless fetch failed, using fallback engine:", openAiErr.message);
      }
    }

    // 2. Intelligent Domain Fallback Engine (when OpenAI key is unconfigured or rate-limited)
    if (!reply) {
      const q = trimmedMessage.toLowerCase();
      if (q.includes("deposit") || q.includes("fund") || q.includes("add money")) {
        reply =
          "To deposit USDT into your WiseTrade account, navigate to the **Wallet Vault** or use the **Instant Funds Simulator** on the Dashboard. Select your preferred network (TRC-20, ERC-20, BEP-20, or SOL), enter the amount, and click 'Simulate Instant Deposit Credit'.";
      } else if (q.includes("withdraw") || q.includes("cash out") || q.includes("payout")) {
        reply =
          "To withdraw USDT, visit the **Wallet Vault** tab, click **Withdraw USDT**, enter your recipient address and network, and submit. The withdrawal will be logged instantly in your transaction ledger.";
      } else if (q.includes("fee") || q.includes("commission")) {
        reply =
          "WiseTrade charges an industry-low 0.10% standard maker/taker spot fee. High-volume accounts and VIP Tier traders qualify for zero-fee maker rebates.";
      } else if (q.includes("order") || q.includes("limit") || q.includes("stop") || q.includes("trade")) {
        reply =
          "You can place both **Market Orders** (filled instantly at best index price) and **Limit Orders** (placed at your custom target price) on the **Spot Trading** terminal. Take-profit and stop-loss triggers can also be pre-configured.";
      } else if (q.includes("reset") || q.includes("balance") || q.includes("restart")) {
        reply =
          "To reset your wallet balance back to the default $10,000 USDT sandbox capital, click the **Reset Balances** button at the top of your Dashboard or Profile page.";
      } else {
        reply =
          "Hello! I am your WiseTrade AI Support Assistant. I can help you with trading orders, wallet deposits, withdrawals, market depth analysis, and security settings. How can I assist your trading today?";
      }
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Vercel Serverless Function Error:", err);
    return res.status(500).json({
      reply:
        "Welcome to WiseTrade Support! We encountered a temporary hiccup processing your request. Please try again or open a formal support ticket.",
    });
  }
}
