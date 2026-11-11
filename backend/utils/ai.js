/**
 * AI Profile generation.
 *
 * The AI only DESCRIBES and RECOMMENDS. Rank, points and badges are computed by
 * rules (see utils/points.js) and are passed in as facts.
 *
 * Provider: Google Gemini REST API (LLM_API_KEY, LLM_MODEL from env).
 * If the key is missing, the call fails, times out, or returns bad JSON,
 * we fall back to a template built from the same stats so the page never breaks.
 */
const crypto = require('crypto');

const TIMEOUT_MS = 15000;

function statsHash(facts) {
  return crypto.createHash('sha1').update(JSON.stringify(facts)).digest('hex').slice(0, 16);
}

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const strList = (v, maxItems, maxLen) =>
  Array.isArray(v) ? v.map((x) => str(x, maxLen)).filter(Boolean).slice(0, maxItems) : [];

function validate(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const summary = str(raw.summary, 700);
  if (!summary) return null;
  const recs = Array.isArray(raw.recommendations)
    ? raw.recommendations
        .map((r) => ({ title: str(r && r.title, 100), reason: str(r && r.reason, 250) }))
        .filter((r) => r.title)
        .slice(0, 3)
    : [];
  if (!recs.length) return null;
  return {
    summary,
    strengths: strList(raw.strengths, 4, 160),
    improvements: strList(raw.improvements, 4, 160),
    recommendations: recs,
  };
}

function parseJson(text) {
  if (!text) return null;
  const cleaned = String(text).replace(/```json|```/gi, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const a = cleaned.indexOf('{');
    const b = cleaned.lastIndexOf('}');
    if (a >= 0 && b > a) {
      try { return JSON.parse(cleaned.slice(a, b + 1)); } catch { /* fall through */ }
    }
    return null;
  }
}

function buildPrompt(facts) {
  return [
    'You are a supportive learning coach inside a student mentorship platform.',
    'Using ONLY the JSON facts below, write a short performance profile for the student.',
    'Rules: do not invent data; do not mention or change rank/points (they are computed by rules);',
    'be encouraging, specific and concise; address the student in second person.',
    'Return STRICT JSON only, no markdown, with exactly this shape:',
    '{"summary": string (max 3 sentences),',
    ' "strengths": string[] (max 3),',
    ' "improvements": string[] (max 3),',
    ' "recommendations": [{"title": string, "reason": string}] (exactly 3)}',
    '',
    'FACTS:',
    JSON.stringify(facts),
  ].join('\n');
}

async function callGemini(facts) {
  const key = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || 'gemini-2.0-flash';
  if (!key || /your_.*_here/i.test(key)) throw new Error('LLM_API_KEY not configured');

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        signal: ctrl.signal,
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: buildPrompt(facts) }] }],
          generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
        }),
      }
    );
    if (!res.ok) throw new Error(`LLM HTTP ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
    const parsed = validate(parseJson(text));
    if (!parsed) throw new Error('LLM returned unusable JSON');
    return parsed;
  } finally {
    clearTimeout(timer);
  }
}

/** Template-based profile built from the same facts. Always works. */
function fallbackProfile(facts) {
  const quizzes = facts.cohorts.flatMap((c) => c.quizzes.map((q) => ({ ...q, cohort: c.name })));
  const best = [...quizzes].sort((a, b) => b.pct - a.pct)[0];
  const weak = quizzes.filter((q) => q.pct < 60).sort((a, b) => a.pct - b.pct);
  const first = facts.cohorts[0];

  let summary;
  if (!first) {
    summary = `Welcome, ${facts.firstName}! You are not enrolled in a cohort yet. Once your mentor adds you, your progress will show up here.`;
  } else if (!quizzes.length) {
    summary = `Hi ${facts.firstName}, you are enrolled in ${facts.cohorts.map((c) => c.name).join(' and ')} but have not taken a quiz yet. Your first quiz will start building your profile.`;
  } else {
    const avg = Math.round(quizzes.reduce((s, q) => s + q.pct, 0) / quizzes.length);
    summary = `You have completed ${quizzes.length} quiz${quizzes.length > 1 ? 'zes' : ''} with an average of ${avg}%, and you are ranked #${first.rank} of ${first.of} in ${first.name}. ${
      avg >= 75 ? 'Strong work, keep the momentum going.' : avg >= 50 ? 'Solid progress, with room to tighten a few topics.' : 'There is plenty of room to grow, and each quiz is a good chance to improve.'
    }`;
  }

  const strengths = [];
  if (best) strengths.push(`Scored ${best.pct}% in "${best.title}"`);
  if (facts.streak >= 2) strengths.push(`Kept a ${facts.streak}-day learning streak`);
  const videosDone = facts.cohorts.reduce((s, c) => s + c.videosCompleted, 0);
  if (videosDone > 0) strengths.push(`Completed ${videosDone} lecture video${videosDone > 1 ? 's' : ''}`);
  if (!strengths.length) strengths.push('You have started your journey, which is the hardest step');

  const improvements = weak.slice(0, 3).map((q) => `Revisit "${q.title}" (${q.pct}%)`);
  if (facts.pending.length) improvements.push(`Finish ${facts.pending.length} pending item${facts.pending.length > 1 ? 's' : ''}`);
  if (!improvements.length) improvements.push('Keep practising to stay ahead of the leaderboard');

  const recommendations = [];
  facts.pending.slice(0, 2).forEach((p) =>
    recommendations.push({
      title: p.type === 'quiz' ? `Take "${p.title}"` : `Watch "${p.title}"`,
      reason: p.type === 'quiz' ? 'Quizzes add the most points and show where you stand.' : 'Videos build the base for upcoming quizzes.',
    })
  );
  weak.slice(0, 2).forEach((q) =>
    recommendations.push({ title: `Revise ${q.cohort} basics`, reason: `Your score in "${q.title}" was ${q.pct}%, so a quick revision will help.` })
  );
  recommendations.push({ title: 'Ask your mentor for feedback', reason: 'A short chat with your mentor can point you to the right next topic.' });
  recommendations.push({ title: 'Keep a daily streak', reason: 'Even 20 minutes a day compounds over the cohort.' });

  return { summary, strengths: strengths.slice(0, 3), improvements: improvements.slice(0, 3), recommendations: recommendations.slice(0, 3) };
}

/** Returns { profile, source } where source is 'ai' or 'template'. Never throws. */
async function generateProfile(facts) {
  try {
    const profile = await callGemini(facts);
    return { profile, source: 'ai' };
  } catch (err) {
    console.warn('[ai] falling back to template:', err.message);
    return { profile: fallbackProfile(facts), source: 'template' };
  }
}

module.exports = { generateProfile, fallbackProfile, statsHash, validate };
