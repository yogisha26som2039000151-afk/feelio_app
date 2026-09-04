export type Emotion = {
  id: string;
  emoji: string;
  label: string;
  color: string;
};

export type MoodEntry = {
  id: string;
  date: string;
  emotionId: string;
  triggers: string[];
  note?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  prompt: string;
  content: string;
  hasVoiceNote: boolean;
};

export type WellnessGoal = {
  id: string;
  title: string;
  emoji: string;
  completedToday: boolean;
  streak: number;
  totalCompletions: number;
};

export type Badge = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'supporter';
  timestamp: string;
};

export type PulseEntry = {
  id: string;
  date: string;
  feeling: string;
  affecting: string[];
  help: string[];
};

export type AppData = {
  moods: MoodEntry[];
  journal: JournalEntry[];
  goals: WellnessGoal[];
  badges: Badge[];
  pulseHistory: PulseEntry[];
  trustedContact?: string;
  anonymousMode: boolean;
};
