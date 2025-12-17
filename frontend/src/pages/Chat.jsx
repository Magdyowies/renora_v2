import { useState, useEffect, useRef } from "react";
import { chatAPI } from "../services/api";
import { MessageCircle, Send, Plus, Bot, User } from "lucide-react";
import { format } from "date-fns";

export default function Chat() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadSessions = async () => {
    try {
      const response = await chatAPI.getSessions();
      setSessions(response.data);
      if (response.data.length > 0 && response.data[0].status === "active") {
        loadSession(response.data[0].id);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const response = await chatAPI.getSession(sessionId);
      setCurrentSession(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await chatAPI.createSession();
      setCurrentSession(response.data);
      setMessages(response.data.messages || []);
      loadSessions();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentSession || sending) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    setMessages((prev) => [
      ...prev,
      {
        sender_type: "user",
        content: messageText,
        created_at: new Date().toISOString(),
      },
    ]);

    try {
      const response = await chatAPI.sendMessage(
        currentSession.id,
        messageText,
      );
      setMessages((prev) => [
        ...prev.slice(0, -1),
        response.data.user_message,
        response.data.bot_message,
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender_type: "bot",
          content: "Sorry, I encountered an error. Please try again.",
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="bg-primary-600 flex items-center justify-between p-4 text-white">
            <div className="flex items-center">
              <MessageCircle className="mr-2 h-6 w-6" />
              <div>
                <h1 className="font-semibold">Rentora AI Assistant</h1>
                <p className="text-primary-200 text-sm">
                  Here to help with your rental needs
                </p>
              </div>
            </div>
            <button
              onClick={createNewSession}
              className="flex items-center rounded-lg bg-white/20 px-3 py-2 hover:bg-white/30"
            >
              <Plus className="mr-1 h-4 w-4" />
              New Chat
            </button>
          </div>

          <div className="flex h-[500px] flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              {!currentSession ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Bot className="text-primary-300 mb-4 h-16 w-16" />
                  <h3 className="mb-2 text-xl font-semibold text-gray-700">
                    Start a conversation
                  </h3>
                  <p className="mb-4 text-gray-500">
                    Ask me anything about vehicle rentals, bookings, or payments
                  </p>
                  <button
                    onClick={createNewSession}
                    className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-3 text-white"
                  >
                    Start Chat
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.sender_type === "user"
                          ? "bg-primary-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="mb-1 flex items-center">
                        {msg.sender_type === "user" ? (
                          <User className="mr-1 h-4 w-4" />
                        ) : (
                          <Bot className="mr-1 h-4 w-4" />
                        )}
                        <span className="text-xs opacity-75">
                          {msg.sender_type === "user" ? "You" : "Rentora AI"}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.created_at && (
                        <p className="mt-2 text-xs opacity-50">
                          {format(new Date(msg.created_at), "HH:mm")}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {currentSession && (
              <form onSubmit={sendMessage} className="border-t p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="focus:ring-primary-500 flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-3 text-white disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
