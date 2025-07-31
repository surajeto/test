import axios from 'axios';

export async function generateFeedback(score, strength, weakness) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return 'No API key provided.';
  const prompt = `คะแนนสอบ: ${score}\nจุดแข็ง: ${strength}\nจุดอ่อน: ${weakness}\nให้คำแนะนำสั้น ๆ เป็นภาษาไทย`; 
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    }, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return res.data.choices[0].message.content.trim();
  } catch (e) {
    return 'ไม่สามารถสร้างคำแนะนำได้';
  }
}
