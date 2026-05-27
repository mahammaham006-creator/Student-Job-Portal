import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const POLL_INTERVAL = 2000; // poll every 2 seconds

export default function Chat() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const lastMessageCount = useRef(0);

  // Load conversations once on mount
  useEffect(() => {
    api.get('/messages/conversations')
      .then(r => setConversations(r.data))
      .finally(() => setLoading(false));
  }, []);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const { data } = await api.get(`/messages/${userId}`);
      // Only update state if new messages arrived (avoids unnecessary re-renders)
      if (data.length !== lastMessageCount.current) {
        lastMessageCount.current = data.length;
        setMessages(data);
      }
    } catch { /* silent */ }
  }, [userId]);

  // Start/stop polling when active conversation changes
  useEffect(() => {
    if (!userId) return;

    // Set active user from conversations list
    const conv = conversations.find(c => c.partner._id === userId);
    if (conv) setActiveUser(conv.partner);

    // Initial fetch
    fetchMessages();

    // Start polling
    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL);

    return () => {
      clearInterval(pollRef.current);
      lastMessageCount.current = 0;
    };
  }, [userId, conversations, fetchMessages]);

  // Also refresh conversations list periodically to show latest previews
  useEffect(() => {
    const convPoll = setInterval(() => {
      api.get('/messages/conversations')
        .then(r => setConversations(r.data))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(convPoll);
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;
    const content = input;
    setInput(''); // clear immediately for responsiveness
    try {
      const { data } = await api.post(`/messages/${userId}`, { content });
      setMessages(prev => [...prev, data]);
      lastMessageCount.current += 1;
      // Refresh conversations to update last message preview
      api.get('/messages/conversations').then(r => setConversations(r.data));
    } catch {
      setInput(content); // restore on failure
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 h-[calc(100vh-80px)] flex gap-4">
      {/* Conversations list */}
      <div className="w-72 flex-shrink-0 card overflow-y-auto">
        <h2 className="font-semibold mb-3">Messages</h2>
        {conversations.length === 0 ? (
          <p className="text-sm text-gray-500">No conversations yet.</p>
        ) : (
          <div className="space-y-1">
            {conversations.map(({ partner, lastMessage }) => (
              <button key={partner._id} onClick={() => navigate(`/chat/${partner._id}`)}
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${userId === partner._id ? 'bg-primary-50' : ''}`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm flex-shrink-0">
                    {partner.name?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{partner.name}</p>
                    <p className="text-xs text-gray-400 truncate">{lastMessage.content}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat window */}
      <div className="flex-1 card flex flex-col overflow-hidden">
        {!userId ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="border-b pb-3 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-sm">
                {activeUser?.name?.[0]}
              </div>
              <div>
                <p className="font-medium text-sm">{activeUser?.name}</p>
                <p className="text-xs text-gray-400 capitalize">{activeUser?.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {messages.map((msg, i) => {
                const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                return (
                  <div key={msg._id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${isMe ? 'bg-primary-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex gap-2 mt-3 border-t pt-3">
              <input className="input flex-1" placeholder="Type a message..."
                value={input} onChange={e => setInput(e.target.value)} />
              <button type="submit" className="btn-primary px-4">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
