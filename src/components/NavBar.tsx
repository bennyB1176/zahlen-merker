import { useStore, type View } from '../store';

const TABS: { view: View; label: string; icon: string }[] = [
  { view: 'library', label: 'Read', icon: '📖' },
  { view: 'numbers', label: 'Numbers', icon: '🔢' },
  { view: 'progress', label: 'Progress', icon: '📈' },
  { view: 'about', label: 'About', icon: 'ℹ️' },
];

export function NavBar() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);

  // Hide during an active reading flow to keep focus on the words.
  if (view === 'reader' || view === 'quiz' || view === 'results') return null;

  return (
    <nav className="nav" aria-label="Main">
      {TABS.map((tab) => (
        <button
          key={tab.view}
          aria-current={view === tab.view ? 'page' : undefined}
          onClick={() => setView(tab.view)}
        >
          <span className="ico" aria-hidden>
            {tab.icon}
          </span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
