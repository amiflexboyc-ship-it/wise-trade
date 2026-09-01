require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

// Test server
app.get("/", (req, res) => {
  res.json({
    message: "WiseTrade server is running 🚀",
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

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the official WiseTrade Support Assistant.

WiseTrade is a paper-trading platform.

Help customers with:
- deposits
- withdrawals
- trading
- orders
- wallet balances
- account problems
- login problems
- market information
- general WiseTrade questions
- complaints and reports

Be friendly, professional, and concise.

IMPORTANT RULES:
1. Never claim you personally changed a customer's balance.
2. Never claim you processed a deposit or withdrawal.
3. Never execute trades.
4. Never ask for passwords, API keys, private keys, or sensitive financial credentials.
5. Never invent transaction IDs, balances, payment confirmations, or account information.
6. If you cannot confidently answer a question, recommend contacting WiseTrade human support.
7. For serious financial problems, recommend escalation to human support.

For complaints:
- acknowledge the customer's problem
- ask for useful non-sensitive information
- explain the next appropriate support step
- remain calm and helpful

Keep answers easy to understand.
`,

      input: message,
    });

    const reply =
      response.output_text ||
      "I'm sorry, but I couldn't generate a response right now.";

    res.json({
      reply,
    });
  } catch (error) {
    console.error("AI Support Error:", error);

    res.status(500).json({
      reply:
        "Sorry, WiseTrade Support is temporarily unavailable. Please try again shortly.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`WiseTrade server running on http://localhost:${PORT}`);
});