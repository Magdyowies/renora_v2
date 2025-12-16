import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../services/api';
import { MessageCircle, Send, Plus, Bot, User } from 'lucide-react';
import { format } from 'date-fns';

export default function Chat() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSessions = async () => {
    try {
      const response = await chatAPI.getSessions();
      setSessions(response.data);
      if (response.data.length > 0 && response.data[0].status === 'active') {
        loadSession(response.data[0].id);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
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
      console.error('Error loading session:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const response = await chatAPI.createSession();
      setCurrentSession(response.data);
      setMessages(response.data.messages || []);
      loadSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentSession || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    setMessages((prev) => [...prev, { sender_type: 'user', content: messageText, created_at: new Date().toISOString() }]);

    try {
      const response = await chatAPI.sendMessage(currentSession.id, messageText);
      setMessages((prev) => [...prev.slice(0, -1), response.data.user_message, response.data.bot_message]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { sender_type: 'bot', content: 'Sorry, I encountered an error. Please try again.', created_at: new Date().toISOString() },
      ]);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 mr-2" />
              <div>
                <h1 className="font-semibold">Rentora AI Assistant</h1>
                <p className="text-sm text-primary-200">Here to help with your rental needs</p>
              </div>
            </div>
            <button
              onClick={createNewSession}
              className="flex items-center bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30"
            >
              <Plus className="h-4 w-4 mr-1" />
              New Chat
            </button>
          </div>

          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {!currentSession ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Bot className="h-16 w-16 text-primary-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a conversation</h3>
                  <p className="text-gray-500 mb-4">
                    Ask me anything about vehicle rentals, bookings, or payments
                  </p>
                  <button
                    onClick={createNewSession}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700"
                  >
                    Start Chat
                  </button>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.sender_type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {msg.sender_type === 'user' ? (
                          <User className="h-4 w-4 mr-1" />
                        ) : (
                          <Bot className="h-4 w-4 mr-1" />
                        )}
                        <span className="text-xs opacity-75">
                          {msg.sender_type === 'user' ? 'You' : 'Rentora AI'}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.created_at && (
                        <p className="text-xs opacity-50 mt-2">
                          {format(new Date(msg.created_at), 'HH:mm')}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {currentSession && (
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50"
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
