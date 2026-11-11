'use client';

import { useEffect, useState } from 'react';
import { getQuiz, submitQuiz } from '../../lib/api';
import { formatDateTime } from '../../lib/video';
import { Spinner, Alert } from '../ui/Common';
import '../ui/tn.css';

export default function QuizTaker({ token, resourceId, onClose, onSubmitted }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getQuiz(token, resourceId)
      .then((q) => {
        setQuiz(q);
        if (q.submitted) setResult(q.result);
      })
      .catch((e) => setError(e.message));
  }, [token, resourceId]);

  const answered = Object.keys(answers).length;
  const total = quiz?.questions?.length || 0;

  const handleSubmit = async () => {
    if (answered < total && !confirm(`You have answered ${answered} of ${total} questions. Submit anyway? You can only submit once.`)) return;
    setSubmitting(true);
    setError('');
    try {
      const payload = quiz.questions.map((q) => ({ questionId: q.id, selectedOptionIndex: answers[q.id] ?? -1 }));
      const res = await submitQuiz(token, resourceId, payload);
      setResult({ score: res.score, max: res.max, base: res.breakdown.base, bonus: res.breakdown.bonus });
      onSubmitted && onSubmitted();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tn-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="tn-modal">
        {!quiz && !error && <Spinner />}
        {error && <Alert>{error}</Alert>}

        {quiz && (
          <>
            <h2>{quiz.title}</h2>

            {result ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1a3a5c' }}>{result.score} / {result.max}</div>
                <p className="tn-muted" style={{ margin: '0.4rem 0 1rem' }}>
                  You earned <strong>{(result.base || 0) + (result.bonus || 0)} points</strong>
                  {' '}({result.base} for your score{result.bonus ? ` + ${result.bonus} on-time bonus` : ''}).
                </p>
                <button className="tn-btn" onClick={onClose}>Back to cohort</button>
              </div>
            ) : quiz.status === 'upcoming' ? (
              <Alert type="info">This quiz opens on {formatDateTime(quiz.startTime)}.</Alert>
            ) : quiz.status === 'closed' ? (
              <Alert type="error">The deadline for this quiz has passed.</Alert>
            ) : (
              <>
                <p className="tn-muted" style={{ marginBottom: '1rem' }}>
                  Closes {formatDateTime(quiz.endTime)} &middot; {total} questions &middot; {quiz.maxScore} marks &middot; one attempt only
                </p>
                {quiz.questions.map((q, i) => (
                  <fieldset key={q.id} style={{ border: 'none', marginBottom: '1.1rem', padding: 0 }}>
                    <legend style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
                      {i + 1}. {q.questionText} <span className="tn-muted">({q.marks} mark{q.marks > 1 ? 's' : ''})</span>
                    </legend>
                    {q.options.map((opt, j) => (
                      <label key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.4rem 0.6rem', borderRadius: 8, cursor: 'pointer', background: answers[q.id] === j ? '#e8f3fb' : 'transparent' }}>
                        <input type="radio" name={`q-${q.id}`} checked={answers[q.id] === j} onChange={() => setAnswers({ ...answers, [q.id]: j })} />
                        {opt}
                      </label>
                    ))}
                  </fieldset>
                ))}
                <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                  <button className="tn-btn-outline" onClick={onClose}>Cancel</button>
                  <button className="tn-btn" disabled={submitting} onClick={handleSubmit}>{submitting ? 'Submitting...' : `Submit (${answered}/${total})`}</button>
                </div>
              </>
            )}
          </>
        )}
        {!quiz && error && <div style={{ textAlign: 'right' }}><button className="tn-btn-outline" onClick={onClose}>Close</button></div>}
      </div>
    </div>
  );
}
