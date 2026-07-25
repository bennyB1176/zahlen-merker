import { useState } from 'react';
import { useStore } from '../../store';
import { PASSAGES } from '../../data/passages';
import { countWords } from '../../engine/wpm';
import { DailyPlanCard } from './DailyPlanCard';

export function LibraryScreen() {
  const choosePassage = useStore((s) => s.choosePassage);
  const startCustom = useStore((s) => s.startCustom);
  const targetWpm = useStore((s) => s.settings.currentTargetWpm);

  const [showPaste, setShowPaste] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const customWords = countWords(text);

  return (
    <div className="screen">
      <h1>SpeedRead</h1>
      <p className="subtitle">
        Read faster while keeping comprehension. Current target: {targetWpm} WPM.
      </p>

      <DailyPlanCard />

      {PASSAGES.map((p) => (
        <div className="card" key={p.id}>
          <h3>{p.title}</h3>
          <p className="meta">
            {p.author ? `${p.author} · ` : ''}
            {p.wordCount} words · {p.questions.length}-question quiz
          </p>
          <button
            className="btn primary"
            onClick={() => choosePassage(p)}
            data-testid={`start-${p.id}`}
          >
            Read this
          </button>
        </div>
      ))}

      <div className="card">
        <h3>Bring your own text</h3>
        <p className="meta">Paste any article or notes. Tracks raw speed (no quiz).</p>
        {!showPaste ? (
          <button className="btn" onClick={() => setShowPaste(true)}>
            Paste text
          </button>
        ) : (
          <>
            <div className="field">
              <input
                type="text"
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Custom title"
              />
            </div>
            <div className="field">
              <textarea
                rows={6}
                placeholder="Paste your text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-label="Custom text"
                data-testid="custom-text"
              />
            </div>
            <button
              className="btn primary"
              disabled={customWords < 5}
              onClick={() => startCustom(title, text)}
              data-testid="start-custom"
            >
              {customWords < 5 ? 'Add more text' : `Read ${customWords} words`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
