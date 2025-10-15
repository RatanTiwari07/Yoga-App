import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  USER: '@user',
  SESSIONS: '@sessions',
  STREAK: '@streak',
  BEST_SCORE: '@best_score',
};

// User interface
export interface User {
  email: string;
  name: string;
  totalScore: number;
}

// Session interface
export interface Session {
  date: string;
  poses: number;
  avgAccuracy: number;
  score: number;
}

// Save user data
export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Get user data
export const getUser = async (): Promise<User | null> => {
  try {
    const user = await AsyncStorage.getItem(KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Clear user data (logout)
export const clearUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.USER);
  } catch (error) {
    console.error('Error clearing user:', error);
  }
};

// Save session
export const saveSession = async (session: Session): Promise<void> => {
  try {
    const sessions = await getSessions();
    sessions.push(session);
    await AsyncStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

// Get all sessions
export const getSessions = async (): Promise<Session[]> => {
  try {
    const sessions = await AsyncStorage.getItem(KEYS.SESSIONS);
    const existingSessions = sessions ? JSON.parse(sessions) : [];
    
    // If no sessions exist, generate some mock data for demo
    if (existingSessions.length === 0) {
      return generateMockSessions();
    }
    
    return existingSessions;
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

// Generate mock sessions for demo purposes
const generateMockSessions = (): Session[] => {
  const mockSessions: Session[] = [];
  const today = new Date();
  
  // Generate random sessions over the last 60 days
  const daysToGenerate = [0, 1, 2, 5, 7, 10, 12, 15, 18, 20, 25, 28, 32, 35, 40, 45, 50, 55];
  
  daysToGenerate.forEach((daysAgo) => {
    const sessionDate = new Date(today);
    sessionDate.setDate(sessionDate.getDate() - daysAgo);
    
    // Sometimes add multiple sessions per day
    const sessionsPerDay = Math.random() > 0.7 ? 2 : 1;
    
    for (let i = 0; i < sessionsPerDay; i++) {
      const poses = Math.floor(Math.random() * 5) + 3; // 3-7 poses
      const avgAccuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      mockSessions.push({
        date: new Date(sessionDate.getTime() + i * 3600000).toISOString(), // Add hours
        poses,
        avgAccuracy,
        score: avgAccuracy * poses,
      });
    }
  });
  
  return mockSessions.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

// Save streak
export const saveStreak = async (streak: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.STREAK, streak.toString());
  } catch (error) {
    console.error('Error saving streak:', error);
  }
};

// Get streak
export const getStreak = async (): Promise<number> => {
  try {
    const streak = await AsyncStorage.getItem(KEYS.STREAK);
    return streak ? parseInt(streak, 10) : 0;
  } catch (error) {
    console.error('Error getting streak:', error);
    return 0;
  }
};

// Save best score
export const saveBestScore = async (score: number): Promise<void> => {
  try {
    const currentBest = await getBestScore();
    if (score > currentBest) {
      await AsyncStorage.setItem(KEYS.BEST_SCORE, score.toString());
    }
  } catch (error) {
    console.error('Error saving best score:', error);
  }
};

// Get best score
export const getBestScore = async (): Promise<number> => {
  try {
    const score = await AsyncStorage.getItem(KEYS.BEST_SCORE);
    return score ? parseInt(score, 10) : 0;
  } catch (error) {
    console.error('Error getting best score:', error);
    return 0;
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      KEYS.USER,
      KEYS.SESSIONS,
      KEYS.STREAK,
      KEYS.BEST_SCORE,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
