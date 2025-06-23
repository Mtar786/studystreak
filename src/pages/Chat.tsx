import { useState } from "react";
import { Link } from "react-router-dom";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const fakeReply = `AI: That's interesting! Tell me more about "${trimmed}".`;

    setMessages([...messages, `You: ${trimmed}`, fakeReply]);
    setInput("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>🤖 Chat with AI</h2>

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
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            {msg}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: "0.5rem", fontSize: "1rem" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <Link to="/">
          <button style={{ background: "#eee", padding: "0.5rem 1rem", border: "1px solid #aaa" }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
