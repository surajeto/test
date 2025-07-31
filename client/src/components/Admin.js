import React, { useState } from 'react';
import axios from 'axios';

export default function Admin({ token }) {
  const [name, setName] = useState('');
  const [open, setOpen] = useState('');
  const [close, setClose] = useState('');
  const create = async () => {
    await axios.post('/api/admin/exams', { name, openDate: open, closeDate: close }, { headers: { Authorization: `Bearer ${token}` } });
    alert('Created');
  };
  return (
    <div>
      <h2>Create Exam</h2>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Open" value={open} onChange={e => setOpen(e.target.value)} />
      <input placeholder="Close" value={close} onChange={e => setClose(e.target.value)} />
      <button onClick={create}>Create</button>
    </div>
  );
}
