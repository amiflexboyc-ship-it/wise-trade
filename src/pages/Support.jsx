
import { useState } from "react";
import { MessageCircle, Send, Headphones } from "lucide-react";

function Support() {
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hello 👋 I'm the WiseTrade Support Assistant. How can I help you today?",
        },
    ]);


    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userMessage,
            },
        ]);

        setMessage("");

        try {
            console.log("Sending message to WiseTrade backend...");

            const response = await fetch(
                "http://127.0.0.1:5000/api/support/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: userMessage,
                    }),
                }
            );

            console.log("Backend status:", response.status);

            if (!response.ok) {
                throw new Error(`Backend returned ${response.status}`);
            }

            const data = await response.json();

            console.log("Backend response:", data);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: data.reply,
                },
            ]);
        } catch (error) {
            console.error("Support connection error:", error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text:
                        "Sorry, I cannot connect to WiseTrade Support right now. Please try again.",
                },
            ]);
        }
    };



    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8">
            <div className="mx-auto max-w-4xl">

                {/* Header */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="rounded-xl bg-blue-600 p-3 text-white">
                        <Headphones size={28} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Help & Support
                        </h1>

                        <p className="text-slate-400">
                            Get help with your WiseTrade account
                        </p>
                    </div>
                </div>

                {/* Chat */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                    {/* Chat Header */}
                    <div className="flex items-center gap-3 border-b border-slate-800 p-4">
                        <MessageCircle className="text-blue-400" />

                        <div>
                            <h2 className="font-semibold text-white">
                                WiseTrade Assistant
                            </h2>

                            <p className="text-xs text-green-400">
                                ● Online
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-[500px] space-y-4 overflow-y-auto p-5">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-800 text-slate-200"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="border-t border-slate-800 p-4">
                        <div className="flex gap-3">

                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSend();
                                    }
                                }}
                                placeholder="Describe your problem..."
                                className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
                            />

                            <button
                                type="button"
                                onClick={handleSend}
                                className="rounded-xl bg-blue-600 px-5 text-white transition hover:bg-blue-700"
                            >
                                <Send size={20} />
                            </button>

                        </div>
                    </div>
                </div>

                {/* Quick Help */}
                <div className="mt-6 grid gap-3 sm:grid-cols-3">

                    <button
                        type="button"
                        onClick={() => setMessage("My deposit failed")}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-white hover:bg-slate-800"
                    >
                        💰 Deposit Problem
                    </button>

                    <button
                        type="button"
                        onClick={() => setMessage("I have a withdrawal problem")}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-white hover:bg-slate-800"
                    >
                        💸 Withdrawal Problem
                    </button>

                    <button
                        type="button"
                        onClick={() => setMessage("I have a trading problem")}
                        className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-white hover:bg-slate-800"
                    >
                        📊 Trading Problem
                    </button>

                </div>
            </div>
        </div>
    );
}

export default Support;

