const express = require('express');
const Program = require('../models/Program');
const Mentee = require('../models/Mentee');
const { getCohortLeaderboard } = require('../utils/standings');
const { POINTS } = require('../utils/points');

const router = express.Router();

// GET /api/public/cohorts  - cohort listing for the "Get Started" page (no auth)
router.get('/cohorts', async (req, res) => {
  const programs = await Program.find().populate('mentors', 'name').select('name description mentors').lean();
  const counts = await Mentee.aggregate([
    { $unwind: '$programs' },
    { $group: { _id: '$programs', count: { $sum: 1 } } },
  ]);
  const map = new Map(counts.map((c) => [String(c._id), c.count]));
  res.json(
    programs.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description || '',
      mentors: (p.mentors || []).map((m) => m.name),
      menteeCount: map.get(String(p._id)) || 0,
    }))
  );
});

// GET /api/public/leaderboard/:cohortId  - names and points only (no emails)
router.get('/leaderboard/:cohortId', async (req, res) => {
  if (!/^[a-f\d]{24}$/i.test(req.params.cohortId)) return res.status(400).json({ error: 'Invalid cohort id' });
  const rows = await getCohortLeaderboard(req.params.cohortId);
  if (!rows) return res.status(404).json({ error: 'Cohort not found' });
  res.json({
    rules: POINTS,
    rows: rows.map((r) => ({
      rank: r.rank,
      name: r.name,
      avatar: r.avatar,
      points: r.points,
      quizzesCompleted: r.quizzesCompleted,
      streak: r.streak,
      breakdown: r.breakdown,
    })),
  });
});

module.exports = router;
