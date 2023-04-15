import { useState } from "react";
import ReactMarkdown from "react-markdown";

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: message,
      },
    ];

    setMessages(newMessages);
    setMessage("");

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: newMessages,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        const newMessages2 = [...newMessages, data.choices[0].message];
        setMessages(newMessages2);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky navbar */}
      <nav className="bg-white shadow w-full px-4 py-2 fixed top-0 z-10">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-lg font-bold">Jobot</h1>
        </div>
      </nav>
      <div className="flex-1 max-w-xl mx-auto px-4 py-8 flex flex-col">
        {messages.map(({ role, content }, idx) => (
          <div className="border rounded-md p-4 mb-4 w-full">
            <div className="text-sm font-bold">
              {role == "user" ? "You" : "Jobot"}
            </div>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="max-w-xl mx-auto ">
        <form onSubmit={handleSubmit} className="px-4 py-2 flex items-center ">
          {/* Chat input box */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-400 rounded-lg px-4 py-4 mr-4"
            placeholder="Send a message"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
