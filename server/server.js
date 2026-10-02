const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Test server
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "WiseTrade AI Support & Trading API is running 🚀",
    version: "2.1.0",
  });
});

// AI WiseTrade Support
app.post("/api/support/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        reply: "Please enter a message so I can help you.",
      });
    }

    console.log("Customer message:", message);

    let reply = "";
    try {
      if (openai && process.env.OPENAI_API_KEY) {
        if (typeof openai.responses?.create === "function") {
          const response = await openai.responses.create({
            model: "gpt-5.6-luna",
            instructions: `You are the official WiseTrade Support Assistant. WiseTrade is a modern crypto exchange and simulation platform. Assist with deposits, withdrawals, order blotters, charts, and wallet management. Be friendly, concise, and professional.`,
            input: message,
          });
          reply = response.output_text;
        } else if (typeof openai.chat?.completions?.create === "function") {
          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are the official WiseTrade Support Assistant. WiseTrade is a cryptocurrency exchange and simulation platform. Answer questions regarding crypto trading, deposits, withdrawals, orders, and wallet security professionally and concisely.",
              },
              { role: "user", content: message },
            ],
          });
          reply = completion.choices?.[0]?.message?.content;
        }
      }
    } catch (apiErr) {
      console.warn("OpenAI API call failed or quota limited, using intelligent fallback engine:", apiErr.message);
    }

    // Intelligent domain fallback if OpenAI response is not available
    if (!reply || !reply.trim()) {
      const q = message.toLowerCase();
      if (q.includes("deposit") || q.includes("fund") || q.includes("add money")) {
        reply =
          "To deposit USDT into your WiseTrade account, navigate to the **Wallet Vault** or use the **Instant Funds Simulator** on the Dashboard. Select your preferred network (TRC-20, ERC-20, BEP-20, or SOL), enter the amount, and click 'Simulate Instant Deposit Credit'.";
      } else if (q.includes("withdraw") || q.includes("cash out") || q.includes("payout")) {
        reply =
          "To withdraw USDT, visit the **Wallet Vault** tab, click **Withdraw USDT**, enter your recipient address and desired network, and submit. The withdrawal will be logged instantly in your transaction ledger.";
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

    res.json({ reply });
  } catch (error) {
    console.error("AI Support Error:", error);
    res.json({
      reply:
        "Welcome to WiseTrade Support! If you have any questions regarding your wallet, spot orders, or platform features, please let us know or open a formal support ticket.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`WiseTrade server running on http://localhost:${PORT}`);
});