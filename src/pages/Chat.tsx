import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const userMsg = input.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, `You: ${userMsg}`]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMsg }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const reply = res.data.choices[0].message.content;
      setMessages((prev) => [...prev, `AI: ${reply}`]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, "AI: [Error getting response]"]);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🤖 Chat with AI</h2>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#f9f9f9",
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "0.5rem" }}>{msg}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <Link to="/">
          <button style={{ padding: "0.5rem 1rem", border: "1px solid #aaa" }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
