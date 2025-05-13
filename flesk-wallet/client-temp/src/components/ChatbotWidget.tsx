import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';

const ChatbotWidget: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    console.log('Envoi message chatbot:', input);
    const userMessage = { sender: 'Vous', text: input };
    setMessages(msgs => [...msgs, userMessage]);
    setLoading(true);
    setInput('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ message: userMessage.text })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'Bot', text: data.response }]);
    } catch (err) {
      setMessages(msgs => [...msgs, { sender: 'Bot', text: "Erreur de connexion au serveur." }]);
    }
    setLoading(false);
  };

  return (
    <Paper elevation={4} sx={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      width: 350,
      maxHeight: 500,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 2000,
      p: 2
    }}>
      <Typography variant="h6" sx={{ mb: 1, color: '#FF5733' }}>Chatbot Finance</Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', mb: 1, maxHeight: 300 }}>
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1, textAlign: msg.sender === 'Vous' ? 'right' : 'left' }}>
            <Typography variant="body2" sx={{ fontWeight: msg.sender === 'Vous' ? 600 : 400 }}>
              {msg.sender}: {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Pose ta question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          disabled={loading}
        />
        <Button variant="contained" onClick={sendMessage} disabled={loading || !input.trim()} sx={{ bgcolor: '#FF5733' }}>
          Envoyer
        </Button>
      </Box>
    </Paper>
  );
};

export default ChatbotWidget; 