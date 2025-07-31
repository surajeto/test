import { google } from 'googleapis';

const spreadsheetId = process.env.SHEET_ID;
const credentials = process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : null;

function getClient() {
  if (!credentials) throw new Error('No Google credentials');
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return google.sheets({ version: 'v4', auth });
}

export async function appendUser(user) {
  const sheets = getClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Users!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[user.studentId, user.name, user.year, user.major, user.faculty, user.password, user.role]] }
  });
}

export async function findUserById(studentId) {
  if (!credentials) return null;
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Users!A2:G' });
  const rows = res.data.values || [];
  for (const row of rows) {
    if (row[0] === studentId) {
      return { studentId: row[0], name: row[1], year: row[2], major: row[3], faculty: row[4], password: row[5], role: row[6] };
    }
  }
  return null;
}

export async function createExam(exam) {
  const sheets = getClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Exams!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[exam.name, exam.openDate, exam.closeDate]] }
  });
}

export async function getExams() {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Exams!A2:C' });
  const rows = res.data.values || [];
  return rows.map((r, i) => ({ id: i + 1, name: r[0], openDate: r[1], closeDate: r[2] }));
}

export async function appendSubmission(data) {
  const sheets = getClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Submissions!A1',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[data.date, data.studentId, data.examId, data.score, data.strength, data.weakness, data.feedback]] }
  });
}

export async function getSubmissions(filter) {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range: 'Submissions!A2:G' });
  const rows = res.data.values || [];
  let results = rows.map(r => ({
    date: r[0], studentId: r[1], examId: r[2], score: r[3], strength: r[4], weakness: r[5], feedback: r[6]
  }));
  if (filter.examId) results = results.filter(r => r.examId === filter.examId);
  return results;
}
