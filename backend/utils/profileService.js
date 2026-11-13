const Mentee = require('../models/Mentee');
const { getMenteeFacts, toAiFacts } = require('./standings');
const { generateProfile, statsHash } = require('./ai');

const COOLDOWN_MS = 10 * 1000; // stop rapid-fire "Refresh" clicks from hammering the LLM

/**
 * Builds the full AI Profile payload for a mentee.
 * - Rank, points and badges come from rules.
 * - Summary + recommendations come from the LLM (or a template fallback),
 *   cached on the mentee and regenerated only when the stats change or `force` is set.
 */
async function buildProfile(menteeId, { force = false } = {}) {
  const facts = await getMenteeFacts(menteeId);
  if (!facts) return null;

  const aiFacts = toAiFacts(facts);
  const snapshot = statsHash(aiFacts);
  const cached = facts.mentee.aiProfile;
  const hasCache = cached && cached.summary && Array.isArray(cached.recommendations) && cached.recommendations.length > 0;
  const fresh = hasCache && cached.statsSnapshot === snapshot;
  const coolingDown = hasCache && cached.generatedAt && Date.now() - new Date(cached.generatedAt).getTime() < COOLDOWN_MS;

  let ai = cached;
  let regenerated = false;
  if (!hasCache || (!fresh && !coolingDown) || (force && !coolingDown)) {
    const { profile, source } = await generateProfile(aiFacts);
    ai = { ...profile, source, generatedAt: new Date(), statsSnapshot: snapshot };
    await Mentee.updateOne({ _id: menteeId }, { $set: { aiProfile: ai } });
    regenerated = true;
  }

  return {
    profile: {
      id: String(facts.mentee._id),
      name: facts.mentee.name,
      enrollmentNumber: facts.mentee.enrollmentNumber,
      avatar: facts.mentee.avatar || '',
      streak: facts.streak,
      totalPoints: facts.totalPoints,
      bestRank: facts.bestRank,
      videosCompleted: facts.videosCompleted,
      cohorts: facts.cohorts,
      badges: facts.badges,
      pending: facts.pending.slice(0, 8),
      quizResults: facts.quizResults,
    },
    ai: {
      summary: ai.summary,
      strengths: ai.strengths || [],
      improvements: ai.improvements || [],
      recommendations: ai.recommendations || [],
      source: ai.source || 'template',
      generatedAt: ai.generatedAt,
      upToDate: ai.statsSnapshot === snapshot,
    },
    regenerated,
  };
}

module.exports = { buildProfile };
