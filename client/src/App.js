import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Admin from './components/Admin.js';

function Login({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Student ID" value={id} onChange={e => setId(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={async () => {
        const res = await axios.post('/api/login', { studentId: id, password });
        onLogin(res.data.token);
      }}>Login</button>
    </div>
  );
}

function ExamForm({ token }) {
  const [exams, setExams] = useState([]);
  const [examId, setExamId] = useState('');
  const [score, setScore] = useState('');
  const [strength, setStrength] = useState('');
  const [weakness, setWeakness] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => { axios.get('/api/exams').then(r => setExams(r.data)); }, []);

  const submit = async () => {
    const res = await axios.post(`/api/exams/${examId}/submit`, { score, strength, weakness }, { headers: { Authorization: `Bearer ${token}` } });
    setFeedback(res.data.feedback);
  };

  return (
    <div>
      <h2>Submit Score</h2>
      <select onChange={e => setExamId(e.target.value)} value={examId}>
        <option value="">Select exam</option>
        {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <input placeholder="Score" value={score} onChange={e => setScore(e.target.value)} />
      <input placeholder="Strength" value={strength} onChange={e => setStrength(e.target.value)} />
      <input placeholder="Weakness" value={weakness} onChange={e => setWeakness(e.target.value)} />
      <button onClick={submit}>Submit</button>
      {feedback && <p>AI Feedback: {feedback}</p>}
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('student');
  if (!token) return <Login onLogin={(tk) => { setToken(tk); const payload = JSON.parse(atob(tk.split('.')[1])); setRole(payload.role); }} />;
  if (role === 'admin') return <Admin token={token} />;
  return <ExamForm token={token} />;
}
