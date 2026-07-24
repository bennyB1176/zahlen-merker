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
  {
    id: 'photosynthesis',
    title: 'How Plants Eat Light',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `Every scrap of food you have ever eaten traces back to a quiet chemical trick performed by plants: photosynthesis. Inside a leaf sit tiny green factories called chloroplasts, packed with a pigment named chlorophyll. Chlorophyll is green precisely because it absorbs red and blue light while reflecting green back to your eye. When sunlight strikes it, the captured energy is used to split water into hydrogen and oxygen. The oxygen is released into the air as a by-product, which is why forests and ocean plankton supply most of the air we breathe. The hydrogen, meanwhile, is combined with carbon dioxide pulled from the atmosphere to build sugar, the plant's fuel and building material. In a single sentence: plants turn light, water, and air into food and oxygen. This is not a minor process. It quietly moves more energy than all of human civilization uses, and it set the stage for complex life by filling the ancient atmosphere with oxygen. When you burn wood or eat bread, you are really releasing sunlight that a plant stored away, sometimes only months ago, sometimes hundreds of millions of years before.`,
    questions: [
      {
        q: 'Why does chlorophyll appear green?',
        options: [
          'It absorbs green light',
          'It reflects green light while absorbing red and blue',
          'It produces green dye',
          'It glows in sunlight',
        ],
        answerIndex: 1,
      },
      {
        q: 'Where does the oxygen released by photosynthesis come from?',
        options: [
          'From carbon dioxide',
          'From splitting water',
          'From the soil',
          'From sugar',
        ],
        answerIndex: 1,
      },
      {
        q: 'What does the plant build by combining hydrogen with carbon dioxide?',
        options: ['Water', 'Chlorophyll', 'Sugar', 'Oxygen'],
        answerIndex: 2,
      },
      {
        q: 'According to the passage, what are you really releasing when you eat bread?',
        options: [
          'Stored sunlight',
          'Extra oxygen',
          'Carbon dioxide only',
          'Minerals from soil',
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'library-alexandria',
    title: 'The Library That Burned',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `In the ancient city of Alexandria, on the coast of Egypt, stood the most famous library of the old world. Founded more than two thousand years ago, it aimed at an audacious goal: to collect a copy of every book that existed. Ships arriving in the harbor were reportedly searched, and any scrolls found aboard were copied by scribes; sometimes the copy was returned to the owner and the original kept. Scholars from across the Mediterranean came to read, argue, and write there. It was less a single room than a research institute, with lecture halls, gardens, and perhaps hundreds of thousands of scrolls. Popular legend says the library vanished in one dramatic fire, often blamed on Julius Caesar. The truth is slower and sadder. The collection declined over centuries through a mix of war, budget cuts, neglect, and the gradual loss of the scholars who maintained it. Knowledge, it turns out, is not destroyed only by flames; it can also simply be forgotten when no one is paid to keep it. The lesson stuck: much of what the ancient world knew was lost, and later generations spent centuries rediscovering it.`,
    questions: [
      {
        q: 'What was the ambitious goal of the Library of Alexandria?',
        options: [
          'To train soldiers',
          'To collect a copy of every existing book',
          'To store grain',
          'To print newspapers',
        ],
        answerIndex: 1,
      },
      {
        q: 'How did the library reportedly obtain many of its scrolls?',
        options: [
          'By buying them at markets only',
          'By copying scrolls found on ships in the harbor',
          'By writing them all from scratch',
          'By trading gold for them',
        ],
        answerIndex: 1,
      },
      {
        q: 'What does the passage say actually caused the library’s loss?',
        options: [
          'A single dramatic fire',
          'An earthquake',
          'A slow decline of war, neglect, and lost scholars',
          'A flood from the harbor',
        ],
        answerIndex: 2,
      },
      {
        q: 'What broader lesson does the passage draw?',
        options: [
          'Knowledge can be lost through neglect, not only fire',
          'Libraries are fireproof',
          'Books are unimportant',
          'Caesar founded the library',
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'ant-grasshopper',
    title: 'The Ant and the Grasshopper',
    author: 'Aesop',
    source: "Aesop's Fables (retold)",
    license: 'Public domain',
    text: `In a field one summer's day a Grasshopper was hopping about, chirping and singing to its heart's content. An Ant passed by, bearing along with great effort an ear of corn he was taking to the nest. "Why not come and chat with me," said the Grasshopper, "instead of toiling and moiling in that way?" "I am helping to lay up food for the winter," said the Ant, "and recommend you to do the same." "Why bother about winter?" said the Grasshopper; "we have got plenty of food at present." But the Ant went on its way and continued its toil. When the winter came the Grasshopper had no food, and found itself dying of hunger, while it saw the ants distributing every day corn and grain from the stores they had collected in the summer. Then the Grasshopper knew, too late, how foolish it had been. And the moral, carried down the centuries, is one every reader can weigh for themselves: it is best to prepare for the days of need before they arrive, for the season of plenty does not last forever.`,
    questions: [
      {
        q: 'What was the Ant doing when the Grasshopper called out?',
        options: [
          'Singing',
          'Sleeping',
          'Carrying food to store for winter',
          'Chatting with friends',
        ],
        answerIndex: 2,
      },
      {
        q: 'Why did the Grasshopper not gather food?',
        options: [
          'It was injured',
          'It thought there was plenty of food already',
          'It could not find any',
          'It was helping the ants',
        ],
        answerIndex: 1,
      },
      {
        q: 'What happened to the Grasshopper in winter?',
        options: [
          'It found a warm home',
          'It had stored enough',
          'It went hungry',
          'It moved south',
        ],
        answerIndex: 2,
      },
      {
        q: 'What is the moral of the fable?',
        options: [
          'Prepare for times of need before they arrive',
          'Singing is a waste of time',
          'Ants are unfriendly',
          'Winter never comes',
        ],
        answerIndex: 0,
      },
    ],
  },
  {
    id: 'attention',
    title: 'The Myth of Multitasking',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `We like to believe we can do several demanding things at once, but for tasks that need real thought, the brain does not truly multitask. Instead it switches, flicking attention rapidly from one job to another. Each switch carries a hidden cost: a small delay while the mind reloads the rules of the new task, plus a lingering residue where part of your attention is still stuck on the thing you just left. Do this dozens of times an hour, checking a message mid-sentence, and the costs pile up. Studies find that heavy task-switching not only slows you down but increases errors, and it can leave you feeling busy while achieving surprisingly little. Reading is especially fragile this way. Comprehension depends on holding a thread of meaning in mind, and every interruption drops that thread, forcing you to backtrack. This is why deep focus, working on one thing with notifications silenced, tends to beat frantic juggling. The practical takeaway is simple but hard: protect single blocks of attention. A quiet twenty minutes of undivided reading will teach you more than an hour spent dipping in and out between pings.`,
    questions: [
      {
        q: 'What does the brain actually do instead of multitasking on hard tasks?',
        options: [
          'It runs tasks in parallel perfectly',
          'It rapidly switches attention between tasks',
          'It shuts down one side',
          'It slows the heart rate',
        ],
        answerIndex: 1,
      },
      {
        q: 'What is the "residue" described in the passage?',
        options: [
          'Leftover attention stuck on the previous task',
          'A chemical in the brain',
          'A type of memory loss',
          'Background noise',
        ],
        answerIndex: 0,
      },
      {
        q: 'Why is reading especially hurt by interruptions?',
        options: [
          'It needs bright light',
          'It requires holding a thread of meaning that interruptions drop',
          'It uses only one eye',
          'It is done silently',
        ],
        answerIndex: 1,
      },
      {
        q: 'What is the passage’s practical advice?',
        options: [
          'Multitask more efficiently',
          'Check messages often',
          'Protect single blocks of undivided attention',
          'Read faster to save time',
        ],
        answerIndex: 2,
      },
    ],
  },
  {
    id: 'volcanoes',
    title: 'Why Volcanoes Erupt',
    source: 'Written for SpeedRead',
    license: 'CC0-1.0 (public domain dedication)',
    text: `A volcano is, at heart, a pressure valve for the planet. Deep beneath the surface, heat from Earth's interior melts rock into a thick, gas-rich liquid called magma. Because this molten rock is lighter than the solid rock around it, it slowly rises, collecting in chambers a few kilometers down. The real driver of an eruption is not just heat but dissolved gas. As magma rises and the pressure on it drops, gases that were trapped inside come out of solution and form bubbles, much like the fizz released when you open a shaken bottle. If the magma is runny, the gas escapes gently and lava flows out in glowing rivers. If the magma is thick and sticky, the gas cannot escape easily; pressure builds until the volcano bursts in a violent explosion, blasting ash high into the sky. Most volcanoes sit along the edges of Earth's great tectonic plates, where the crust is pulling apart or grinding together. Far from being only destroyers, volcanoes build new land, enrich soil with minerals, and over billions of years helped release the gases that formed the early atmosphere.`,
    questions: [
      {
        q: 'What is magma?',
        options: [
          'Solid surface rock',
          'Molten, gas-rich rock beneath the surface',
          'Cooled lava',
          'Volcanic ash',
        ],
        answerIndex: 1,
      },
      {
        q: 'What mainly drives an eruption as magma rises?',
        options: [
          'Rain seeping in',
          'Dissolved gas forming bubbles as pressure drops',
          'Wind pressure',
          'Earthquakes alone',
        ],
        answerIndex: 1,
      },
      {
        q: 'Why does thick, sticky magma cause violent explosions?',
        options: [
          'It is colder',
          'Gas cannot escape easily, so pressure builds',
          'It is heavier than air',
          'It contains no gas',
        ],
        answerIndex: 1,
      },
      {
        q: 'Where are most volcanoes located?',
        options: [
          'In the centre of continents',
          'Along the edges of tectonic plates',
          'Only under the ocean',
          'At the poles',
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
