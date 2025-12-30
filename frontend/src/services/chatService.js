import axios from 'axios';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ✅ Get access token from `tokens`
const getAccessToken = () => {
  const raw = localStorage.getItem('tokens');
  if (!raw) return null;

  try {
    const tokens = JSON.parse(raw);
    return tokens.access;
  } catch (e) {
    console.error('Invalid tokens format in localStorage');
    return null;
  }
};

const authHeaders = () => {
  const token = getAccessToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const startChatSession = async () => {
  const res = await axios.post(
    `${API_BASE}/api/chat/sessions/`,
    {},
    { headers: authHeaders() }
  );
  return res.data;
};

export const sendChatMessage = async (sessionId, content) => {
  const res = await axios.post(
    `${API_BASE}/api/chat/sessions/${sessionId}/send/`,
    { content },
    { headers: authHeaders() }
  );
  return res.data;
};
