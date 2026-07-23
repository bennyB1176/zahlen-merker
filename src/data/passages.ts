import { countWords } from '../engine/wpm';
import type { Passage, Question } from '../engine/types';

interface RawPassage {
  id: string;
  title: string;
  author?: string;
  source: string;
  license: string;
  text: string;
  questions: Question[];
}

// Original expository texts written for this app (dedicated to the public domain,
// CC0) plus a public-domain classic. No licensing cost, fully offline.
const RAW: RawPassage[] = [
  {
    id: 'how-eyes-read',
    title: 'How Your Eyes Actually Read',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `Reading feels like a smooth glide across the page, but your eyes do not move smoothly at all. They jump in short, rapid hops called saccades, pausing between hops on fixations that each last about a quarter of a second. Almost all of the actual seeing happens during those brief pauses, because vision is blurred while the eyes are in motion. A slower reader tends to make more fixations per line and, crucially, more backward jumps called regressions, where the eyes return to re-read something already seen. Regressions can eat up a large share of reading time. Another hidden brake is subvocalization, the silent inner voice that pronounces each word. Because that voice runs at roughly speaking speed, leaning on it caps how fast you can go. Speed-reading methods try to reduce wasted fixations, cut regressions, and quiet the inner voice. But there is a firm limit set by the brain, not the eyes: comprehension falls once the incoming words arrive faster than meaning can be built. The goal, then, is not raw velocity. It is reading as fast as you can while still understanding, and gradually widening that ceiling with practice.`,
    questions: [
      {
        q: 'What are the rapid jumps your eyes make while reading called?',
        options: ['Fixations', 'Saccades', 'Regressions', 'Chunks'],
        answerIndex: 1,
      },
      {
        q: 'When does almost all of the actual seeing happen?',
        options: [
          'During the jumps between words',
          'During the brief pauses (fixations)',
          'Only at the end of a line',
          'While blinking',
        ],
        answerIndex: 1,
      },
      {
        q: 'Why does subvocalization limit reading speed?',
        options: [
          'It requires moving your lips',
          'The inner voice runs at about speaking speed',
          'It uses too much memory',
          'It causes more blinking',
        ],
        answerIndex: 1,
      },
      {
        q: 'According to the passage, what sets the firm upper limit on useful reading speed?',
        options: [
          'How fast the eyes can physically move',
          'The size of the text',
          'How fast the brain can build meaning',
          'The number of words on the page',
        ],
        answerIndex: 2,
      },
    ],
  },
  {
    id: 'octopus',
    title: 'The Remarkable Octopus',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `The octopus is one of the strangest intelligent animals on Earth. It has three hearts, blue copper-based blood, and no bones at all, which lets its soft body squeeze through any gap larger than its beak, the only hard part of its anatomy. Most surprising is how its mind is arranged. Of its roughly five hundred million nerve cells, well over half sit not in the brain but in the arms themselves. Each arm can taste, touch, and react on its own, so an octopus is something like a committee of nine partly independent thinkers. Their skin is a living screen. Millions of pigment sacs called chromatophores expand and contract to change color in a fraction of a second, letting the animal vanish against sand, coral, or rock. Oddly, octopuses appear to be colorblind, yet they match their surroundings with uncanny accuracy, possibly sensing light through their skin. They solve puzzles, open jars, and recognize individual human faces. But this brilliance is brief. Most species live only one or two years, and females usually die soon after their eggs hatch. A creature this clever, this alien, and this short-lived remains one of the ocean's deepest puzzles.`,
    questions: [
      {
        q: 'How many hearts does an octopus have?',
        options: ['One', 'Two', 'Three', 'Nine'],
        answerIndex: 2,
      },
      {
        q: 'Where are more than half of an octopus’s nerve cells located?',
        options: ['In the brain', 'In the arms', 'In the beak', 'In the skin'],
        answerIndex: 1,
      },
      {
        q: 'What do chromatophores allow the octopus to do?',
        options: [
          'Swim faster',
          'Change color almost instantly',
          'Breathe underwater',
          'Grow new arms',
        ],
        answerIndex: 1,
      },
      {
        q: 'What is described as surprising about octopus vision?',
        options: [
          'They can see in the dark',
          'They appear to be colorblind yet still match their surroundings',
          'They have no eyes',
          'They only see in blue',
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'sleep',
    title: 'What Sleep Does For You',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `Sleep can look like doing nothing, but the sleeping brain is intensely busy. A night of sleep moves through repeating cycles of roughly ninety minutes, alternating between deep slow-wave sleep and the vivid dreaming stage known as REM. Each stage does different work. During deep sleep, the brain replays and files the day's experiences, moving fragile new memories into more permanent storage, which is why studying and then sleeping beats studying through the night. Deep sleep also acts like a cleaning service: channels between brain cells widen and a wash of fluid flushes out waste proteins that build up while you are awake. REM sleep, by contrast, seems to weave new information into the web of what you already know, supporting creativity and emotional balance. This is why a tired mind struggles with both problem-solving and mood. Skimping on sleep does not just make you groggy; it measurably weakens memory, attention, and judgment the very next day. The effects compound over time. There is no known way to fully train your body to need less sleep. The most reliable performance boost available to almost anyone is not a supplement or a trick, but a consistent, full night of rest.`,
    questions: [
      {
        q: 'About how long is one full sleep cycle?',
        options: ['15 minutes', '45 minutes', '90 minutes', '4 hours'],
        answerIndex: 2,
      },
      {
        q: 'What mainly happens to memories during deep slow-wave sleep?',
        options: [
          'They are erased',
          'Fragile new memories move into more permanent storage',
          'They are turned into dreams only',
          'Nothing happens to them',
        ],
        answerIndex: 1,
      },
      {
        q: 'How does the passage describe the "cleaning" role of deep sleep?',
        options: [
          'Fluid flushes waste proteins from between brain cells',
          'It lowers body temperature',
          'It repairs muscles',
          'It resets the eyes',
        ],
        answerIndex: 0,
      },
      {
        q: 'What is the passage’s main conclusion about sleep?',
        options: [
          'You can train yourself to need much less of it',
          'A consistent full night of rest is a reliable performance boost',
          'REM sleep is the only stage that matters',
          'Supplements work better than sleep',
        ],
        answerIndex: 1,
      },
    ],
  },
  {
    id: 'tortoise-hare',
    title: 'The Tortoise and the Hare',
    author: 'Aesop',
    source: "Aesop's Fables (retold)",
    license: 'Public domain',
    text: `A Hare was one day making fun of a Tortoise for being so slow upon his feet. "Wait a bit," said the Tortoise; "I will run a race with you, and I'll wager that I win." "Very well," replied the Hare, laughing, "we shall soon see." So it was agreed that they should start at once. The Tortoise set off at a steady, plodding pace, never stopping for a moment, straight toward the finish line. The Hare, meanwhile, sprinted far ahead, and seeing how much time he had, thought there was no need to hurry. He lay down by the roadside beneath a shady tree and soon fell fast asleep. At last he woke and ran as quickly as he could, but when he reached the goal he found the Tortoise already resting there, quietly waiting. The Hare had lost the race by his own carelessness. And the moral of the story, told for many centuries since, is a simple one that any reader can carry away: slow and steady, kept up without fail, wins the race far more often than a burst of speed that does not last.`,
    questions: [
      {
        q: 'Why did the Hare stop during the race?',
        options: [
          'He was injured',
          'He was confident he had time and fell asleep',
          'He got lost',
          'He gave up',
        ],
        answerIndex: 1,
      },
      {
        q: 'How did the Tortoise approach the race?',
        options: [
          'With sudden bursts of speed',
          'By taking shortcuts',
          'At a steady, plodding pace without stopping',
          'By asking others for help',
        ],
        answerIndex: 2,
      },
      {
        q: 'What is the moral of the fable?',
        options: [
          'The fastest always wins',
          'Slow and steady wins the race',
          'Never race a friend',
          'Rest whenever you can',
        ],
        answerIndex: 1,
      },
      {
        q: 'What caused the Hare to lose?',
        options: [
          'The Tortoise cheated',
          'His own carelessness',
          'Bad weather',
          'A wrong turn',
        ],
        answerIndex: 1,
      },
    ],
  },
];

export const PASSAGES: Passage[] = RAW.map((p) => ({
  ...p,
  wordCount: countWords(p.text),
}));

export function getPassage(id: string): Passage | undefined {
  return PASSAGES.find((p) => p.id === id);
}
