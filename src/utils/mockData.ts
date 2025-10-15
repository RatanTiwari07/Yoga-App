// Mock data for yoga poses
export interface YogaPose {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in seconds
}

export const yogaPoses: YogaPose[] = [
  {
    id: '1',
    name: 'Tree Pose',
    description: 'Balance on one leg with hands in prayer position',
    difficulty: 'Beginner',
    duration: 30,
  },
  {
    id: '2',
    name: 'Downward Dog',
    description: 'Form an inverted V-shape with your body',
    difficulty: 'Beginner',
    duration: 45,
  },
  {
    id: '3',
    name: 'Warrior I',
    description: 'Strong standing pose with arms raised',
    difficulty: 'Beginner',
    duration: 30,
  },
  {
    id: '4',
    name: 'Warrior II',
    description: 'Wide-legged stance with arms extended',
    difficulty: 'Intermediate',
    duration: 30,
  },
  {
    id: '5',
    name: 'Triangle Pose',
    description: 'Standing pose with one hand touching the floor',
    difficulty: 'Intermediate',
    duration: 30,
  },
  {
    id: '6',
    name: 'Child\'s Pose',
    description: 'Resting pose with forehead on the mat',
    difficulty: 'Beginner',
    duration: 60,
  },
  {
    id: '7',
    name: 'Cobra Pose',
    description: 'Gentle backbend strengthening the spine',
    difficulty: 'Beginner',
    duration: 30,
  },
  {
    id: '8',
    name: 'Plank Pose',
    description: 'Hold body straight in a push-up position',
    difficulty: 'Intermediate',
    duration: 45,
  },
  {
    id: '9',
    name: 'Bridge Pose',
    description: 'Lift hips while lying on your back',
    difficulty: 'Intermediate',
    duration: 30,
  },
  {
    id: '10',
    name: 'Lotus Pose',
    description: 'Seated meditation pose with crossed legs',
    difficulty: 'Advanced',
    duration: 60,
  },
];

// Mock leaderboard data
export interface LeaderboardUser {
  id: string;
  name: string;
  totalScore: number;
  rank: number;
}

export const mockLeaderboard: LeaderboardUser[] = [
  { id: '1', name: 'Sarah Williams', totalScore: 9850, rank: 1 },
  { id: '2', name: 'Mike Johnson', totalScore: 9420, rank: 2 },
  { id: '3', name: 'Emma Davis', totalScore: 9180, rank: 3 },
  { id: '4', name: 'John Smith', totalScore: 8950, rank: 4 },
  { id: '5', name: 'Lisa Anderson', totalScore: 8720, rank: 5 },
  { id: '6', name: 'David Brown', totalScore: 8510, rank: 6 },
  { id: '7', name: 'Amy Wilson', totalScore: 8290, rank: 7 },
  { id: '8', name: 'Chris Martinez', totalScore: 8050, rank: 8 },
  { id: '9', name: 'Jessica Taylor', totalScore: 7840, rank: 9 },
  { id: '10', name: 'Robert Lee', totalScore: 7620, rank: 10 },
];

// Generate random accuracy score
export const generateAccuracyScore = (): number => {
  return Math.floor(Math.random() * 40) + 60; // 60-100
};

// Get voice feedback based on score
export const getVoiceFeedback = (score: number): string => {
  if (score > 80) {
    return 'Good posture!';
  }
  return 'Adjust your position slightly.';
};
