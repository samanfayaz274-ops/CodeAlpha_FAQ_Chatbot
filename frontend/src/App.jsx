import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message,
      });

      const botMsg = { role: "bot", text: res.data.answer };
      setChat((prev) => [...prev, botMsg]);
    } catch (error) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Server error. Please try again." },
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setChat([]);
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center text-center px-4">

        <div className="w-32 h-32 rounded-full border-2 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.6)] overflow-hidden mb-6">
          <img src="image.png" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600 text-transparent bg-clip-text">
          AI FAQ Chatbot
        </h1>

        <p className="text-gray-400 mt-4 text-sm md:text-lg">
          Ask anything about Artificial Intelligence
        </p>

        <p className="text-white mt-6">
          Developed by <span className="text-purple-400 font-bold">Saman Fayaz</span>
        </p>

        <button
          onClick={() => setShowSplash(false)}
          className="mt-8 px-10 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full hover:scale-105 transition"
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-3">

      <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-4 md:p-6">

        {/* HEADER */}
        <h1 className="text-center text-2xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600 text-transparent bg-clip-text">
          AI FAQ Chatbot
        </h1>

        {/* CHAT BOX */}
        <div className="h-[60vh] overflow-y-auto p-3 space-y-3 bg-black/40 rounded-xl border border-white/10">

          {chat.map((c, i) => (
            <div
              key={i}
              className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm md:text-base ${
                  c.role === "user"
                    ? "bg-gray-800 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                {c.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-purple-400 text-sm">AI is thinking...</div>
          )}

        </div>

        {/* INPUT */}
        <div className="flex gap-2 mt-4">

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white outline-none border border-white/10"
          />

          <button
            onClick={sendMessage}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl hover:scale-105 transition"
          >
            Send
          </button>

        </div>

        {/* ACTION BUTTON */}
        <div className="flex justify-center mt-4">
          <button
            onClick={clearChat}
            className="text-sm text-red-400 hover:text-red-300"
          >
            Clear Chat
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;