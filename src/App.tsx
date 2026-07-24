import { useEffect } from 'react';
import { useStore } from './store';
import { NavBar } from './components/NavBar';
import { LibraryScreen } from './features/library/LibraryScreen';
import { ReaderScreen } from './features/reader/ReaderScreen';
import { QuizScreen } from './features/quiz/QuizScreen';
import { ResultsScreen } from './features/results/ResultsScreen';
import { ProgressScreen } from './features/progress/ProgressScreen';
import { NumberFlashScreen } from './features/numbers/NumberFlashScreen';
import { AboutScreen } from './features/about/AboutScreen';

export default function App() {
  const ready = useStore((s) => s.ready);
  const view = useStore((s) => s.view);
  const init = useStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <div className="app">
      {!ready ? (
        <div className="screen">
          <p className="empty">Loading…</p>
        </div>
      ) : (
        <>
          {view === 'library' && <LibraryScreen />}
          {view === 'reader' && <ReaderScreen />}
          {view === 'quiz' && <QuizScreen />}
          {view === 'results' && <ResultsScreen />}
          {view === 'progress' && <ProgressScreen />}
          {view === 'numbers' && <NumberFlashScreen />}
          {view === 'about' && <AboutScreen />}
        </>
      )}
      <NavBar />
    </div>
  );
}
