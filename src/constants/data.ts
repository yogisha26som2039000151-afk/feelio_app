import type { Badge, Emotion, WellnessGoal } from '@/types';

export const EMOTIONS: Emotion[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FFD93D' },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#6BCB77' },
  { id: 'okay', emoji: '😐', label: 'Okay', color: '#A8DADC' },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#B8B8D1' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: '#FFB347' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#74B9FF' },
  { id: 'stressed', emoji: '😤', label: 'Stressed', color: '#FF6B6B' },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#E17055' },
  { id: 'lonely', emoji: '🥺', label: 'Lonely', color: '#A29BFE' },
  { id: 'overwhelmed', emoji: '😵', label: 'Overwhelmed', color: '#FD79A8' },
];

export const MOOD_TRIGGERS = [
  'School / Work',
  'Relationships',
  'Sleep',
  'Health',
  'Social media',
  'Family',
  'Finances',
  'Weather',
  'Nothing specific',
];

export const PULSE_AFFECTING = [
  'Academic pressure',
  'Relationships',
  'Sleep issues',
  'Social media',
  'Loneliness',
  'Health concerns',
  'Family stress',
  'Work overload',
  'Self-doubt',
];

export const PULSE_HELP = [
  'Talk to someone',
  'Journal my thoughts',
  'Breathing exercise',
  'Take a walk',
  'Listen to music',
  'Rest / nap',
  'Meditation',
  'Reach out to a friend',
];

export const JOURNAL_PROMPTS = [
  "What's on your mind?",
  'What made you smile today?',
  'What is stressing you out?',
  'What are you grateful for?',
  'What would make tomorrow better?',
  'How did you take care of yourself today?',
];

export const RELIEF_ACTIVITIES = [
  {
    id: 'breathing',
    title: '2-Minute Breathing',
    emoji: '🌬️',
    duration: '2 min',
    description: 'Slow, calming breaths to ease tension',
    type: 'breathing' as const,
  },
  {
    id: 'grounding',
    title: '5-4-3-2-1 Grounding',
    emoji: '🌍',
    duration: '3 min',
    description: 'Use your senses to anchor yourself in the present',
    type: 'grounding' as const,
  },
  {
    id: 'meditation',
    title: 'Quick Meditation',
    emoji: '🧘',
    duration: '5 min',
    description: 'A short guided moment of stillness',
    type: 'meditation' as const,
  },
  {
    id: 'sounds',
    title: 'Relaxation Sounds',
    emoji: '🎵',
    duration: '10 min',
    description: 'Rain, ocean waves, and gentle ambient tones',
    type: 'sounds' as const,
  },
  {
    id: 'stretch',
    title: 'Desk Stretch',
    emoji: '🙆',
    duration: '2 min',
    description: 'Release physical tension with simple stretches',
    type: 'stretch' as const,
  },
  {
    id: 'gratitude',
    title: 'Gratitude Pause',
    emoji: '💛',
    duration: '1 min',
    description: 'Name three small things you appreciate right now',
    type: 'gratitude' as const,
  },
];

export const LEARN_TOPICS = [
  {
    id: 'stress',
    title: 'Stress',
    emoji: '⚡',
    color: '#FFB347',
    summary: 'Understanding stress and healthy ways to cope',
    content: [
      'Stress is your body\'s natural response to challenges. A little stress can motivate you, but too much can feel overwhelming.',
      'Common signs include trouble sleeping, irritability, headaches, and difficulty concentrating.',
      'Healthy coping strategies: take breaks, talk to someone you trust, move your body, and practice deep breathing.',
      'Remember: asking for help is a sign of strength, not weakness.',
    ],
  },
  {
    id: 'anxiety',
    title: 'Anxiety',
    emoji: '💭',
    color: '#A29BFE',
    summary: 'What anxiety feels like and how to manage it',
    content: [
      'Anxiety is excessive worry about everyday situations. It\'s one of the most common mental health experiences.',
      'Physical symptoms can include a racing heart, sweating, restlessness, and stomach discomfort.',
      'Grounding techniques like the 5-4-3-2-1 method can help bring you back to the present moment.',
      'If anxiety interferes with daily life, consider speaking with a counselor or mental health professional.',
    ],
  },
  {
    id: 'overthinking',
    title: 'Overthinking',
    emoji: '🌀',
    color: '#74B9FF',
    summary: 'Breaking the cycle of repetitive thoughts',
    content: [
      'Overthinking means replaying situations or worrying about things you can\'t control.',
      'It often leads to mental exhaustion without solving the problem.',
      'Try setting a "worry timer" — give yourself 10 minutes to think, then redirect to an activity.',
      'Journaling can help externalize thoughts so they feel less overwhelming.',
    ],
  },
  {
    id: 'academic-pressure',
    title: 'Academic Pressure',
    emoji: '📚',
    color: '#6BCB77',
    summary: 'Managing school and study stress',
    content: [
      'Academic pressure comes from grades, expectations, competition, and fear of failure.',
      'Your worth is not defined by your grades or test scores.',
      'Break large tasks into small steps. Study in focused 25-minute blocks with breaks.',
      'Talk to teachers, counselors, or peers when you feel overwhelmed — you\'re not alone.',
    ],
  },
  {
    id: 'relationships',
    title: 'Relationships',
    emoji: '💕',
    color: '#FD79A8',
    summary: 'Navigating friendships, family, and connections',
    content: [
      'Healthy relationships are built on trust, respect, and open communication.',
      'It\'s okay to set boundaries — saying no protects your emotional well-being.',
      'Conflict is normal. Focus on listening and expressing feelings without blame.',
      'If a relationship feels consistently draining or unsafe, reach out for support.',
    ],
  },
  {
    id: 'self-esteem',
    title: 'Self-Esteem',
    emoji: '✨',
    color: '#FFD93D',
    summary: 'Building a kinder relationship with yourself',
    content: [
      'Self-esteem is how you value and perceive yourself. It can change over time.',
      'Challenge negative self-talk: would you say this to a friend?',
      'Celebrate small wins — they add up to real progress.',
      'Surround yourself with people who uplift you and limit comparison on social media.',
    ],
  },
  {
    id: 'social-media',
    title: 'Social Media Pressure',
    emoji: '📱',
    color: '#E17055',
    summary: 'Staying balanced in a digital world',
    content: [
      'Social media often shows curated highlights, not real life. Comparison can harm self-esteem.',
      'Notice how apps make you feel. If scrolling leaves you anxious or inadequate, take a break.',
      'Set screen-time limits and create phone-free zones, especially before bed.',
      'Curate your feed to follow accounts that inspire and educate, not ones that trigger negativity.',
    ],
  },
  {
    id: 'burnout',
    title: 'Burnout',
    emoji: '🔥',
    color: '#FF6B6B',
    summary: 'Recognizing and recovering from burnout',
    content: [
      'Burnout is emotional, physical, and mental exhaustion from prolonged stress.',
      'Signs include chronic fatigue, cynicism, reduced performance, and feeling detached.',
      'Recovery requires rest — not just sleep, but activities that genuinely recharge you.',
      'Rebuild gradually: prioritize sleep, nutrition, movement, and connection with others.',
    ],
  },
];

export const DEFAULT_GOALS: WellnessGoal[] = [
  { id: 'water', title: 'Drink enough water', emoji: '💧', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'walk', title: 'Take a short walk', emoji: '🚶', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'sleep', title: 'Get 7+ hours of sleep', emoji: '😴', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'gratitude', title: 'Write one gratitude note', emoji: '📝', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'screen', title: 'Limit screen time before bed', emoji: '📵', completedToday: false, streak: 0, totalCompletions: 0 },
  { id: 'connect', title: 'Connect with someone', emoji: '💬', completedToday: false, streak: 0, totalCompletions: 0 },
];

export const DEFAULT_BADGES: Badge[] = [
  { id: 'first-mood', title: 'First Check-in', emoji: '🌈', description: 'Logged your first mood', earned: false },
  { id: 'week-streak', title: '7-Day Streak', emoji: '🔥', description: 'Checked in for 7 days straight', earned: false },
  { id: 'journaler', title: 'Journaler', emoji: '📓', description: 'Wrote 5 journal entries', earned: false },
  { id: 'breather', title: 'Deep Breather', emoji: '🌬️', description: 'Completed a breathing exercise', earned: false },
  { id: 'learner', title: 'Knowledge Seeker', emoji: '🧠', description: 'Read 3 Learn articles', earned: false },
  { id: 'helper', title: 'Community Helper', emoji: '💛', description: 'Used Talk Space to connect', earned: false },
];

export const CRISIS_RESOURCES = [
  { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 free and confidential support' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free 24/7 text-based crisis support' },
  { name: 'SAMHSA Helpline', number: '1-800-662-4357', description: 'Treatment referral and information' },
  { name: 'International Association for Suicide Prevention', number: 'https://www.iasp.info/resources/Crisis_Centres/', description: 'Find crisis centers worldwide' },
];

export const TALK_RESPONSES = [
  "Thank you for sharing that with me. It takes courage to open up, and I'm here to listen.",
  "That sounds really difficult. Your feelings are completely valid.",
  "I hear you. Would you like to tell me more about what's been on your mind?",
  "It's okay to not have all the answers right now. Sometimes just being heard helps.",
  "You're not alone in this. Many people go through similar experiences.",
  "That must be really hard. I'm glad you reached out today.",
  "Remember, taking care of your mental health is just as important as physical health.",
  "Is there anything specific that might help you feel a little better right now?",
];

export const GROUNDING_STEPS = [
  { sense: 'See', count: 5, prompt: 'Name 5 things you can see around you' },
  { sense: 'Touch', count: 4, prompt: 'Name 4 things you can physically feel' },
  { sense: 'Hear', count: 3, prompt: 'Name 3 things you can hear' },
  { sense: 'Smell', count: 2, prompt: 'Name 2 things you can smell' },
  { sense: 'Taste', count: 1, prompt: 'Name 1 thing you can taste' },
];

export const MEDITATION_STEPS = [
  'Find a comfortable position and close your eyes.',
  'Take a deep breath in through your nose for 4 counts.',
  'Hold gently for 4 counts.',
  'Exhale slowly through your mouth for 6 counts.',
  'Notice any tension in your body and let it soften.',
  'If your mind wanders, gently bring it back to your breath.',
  'Continue breathing slowly and deeply.',
  'When ready, open your eyes and notice how you feel.',
];

export const RELAXATION_SOUNDS = [
  { id: 'rain', name: 'Gentle Rain', emoji: '🌧️' },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊' },
  { id: 'forest', name: 'Forest Birds', emoji: '🌲' },
  { id: 'wind', name: 'Soft Wind', emoji: '🍃' },
];
