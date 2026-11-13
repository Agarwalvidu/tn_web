'use client';

import { useState } from 'react';
import './FAQ.css';

const FAQS = [
  { question: 'What is TechNeeds?', answer: 'TechNeeds is a platform that provides technology solutions and support for various needs.' },
  { question: 'How can I contact support?', answer: 'You can contact support via our official WhatsApp group or email us at techneedsigdtuw@gmail.com.' },
  { question: 'What services do you offer?', answer: 'We offer a range of services including hackathon, tech introductory sessions, mentorship programs, tech engagement competition and speaker sessions.' },
  { question: 'Where is TechNeeds located?', answer: 'TechNeeds is based in the heart of IGDTUW founded in 2023.' },
  { question: 'Can I track my mentorship journey?', answer: 'Yes, you can track your journey through our online portal.' },
  { question: 'How do I join a cohort?', answer: 'Browse the Cohorts page, pick a track and log in. Your cohort mentor adds you and gives you an enrollment number and password.' },
  { question: 'How are leaderboard points calculated?', answer: 'Points follow fixed rules: up to 100 per quiz, a 10-point bonus for submitting on time and 5 per completed video. AI never decides your rank.' },
];

export default function Faq() {
  const [active, setActive] = useState(0);

  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-container">
        <div className="faq-head">
          <span className="lp-eyebrow">Support</span>
          <h1 id="faq-title">Frequently asked questions</h1>
          <p>Quick answers about TechNeeds, cohorts and points.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => {
            const open = active === i;
            return (
              <div key={faq.question} className={`faq-item${open ? ' active' : ''}`}>
                <button className="faq-question" aria-expanded={open} onClick={() => setActive(open ? null : i)}>
                  <span>{faq.question}</span>
                  <i className={`fas ${open ? 'fa-minus' : 'fa-plus'}`} />
                </button>
                {open && <div className="faq-answer">{faq.answer}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
