import { useStore } from '../../store';

export function QuizScreen() {
  const passage = useStore((s) => s.passage);
  const answers = useStore((s) => s.quizAnswers);
  const setQuizAnswer = useStore((s) => s.setQuizAnswer);
  const submitQuiz = useStore((s) => s.submitQuiz);

  if (!passage) return null;
  const allAnswered = passage.questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="screen">
      <h1>Quick comprehension check</h1>
      <p className="subtitle">
        Speed only counts if you understood it — this sets your effective WPM.
      </p>

      {passage.questions.map((question, qi) => (
        <div className="q-block" key={qi} data-testid="quiz-question">
          <div className="q-text">
            {qi + 1}. {question.q}
          </div>
          {question.options.map((opt, oi) => (
            <button
              key={oi}
              className="option"
              aria-pressed={answers[qi] === oi}
              onClick={() => setQuizAnswer(qi, oi)}
            >
              {opt}
            </button>
          ))}
        </div>
      ))}

      <button
        className="btn primary"
        disabled={!allAnswered}
        onClick={() => submitQuiz()}
        data-testid="submit-quiz"
      >
        {allAnswered ? 'See my results →' : 'Answer all questions'}
      </button>
    </div>
  );
}
