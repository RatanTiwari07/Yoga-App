import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';
import ActivityHeatmap from '../components/ActivityHeatmap';
import {
  getUser,
  getSessions,
  getStreak,
  getBestScore,
  clearAllData,
} from '../utils/storage';
import type { User, Session } from '../utils/storage';

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await getUser();
    const sessionsData = await getSessions();
    const streakData = await getStreak();
    const bestScoreData = await getBestScore();

    setUser(userData);
    setSessions(sessionsData);
    setStreak(streakData);
    setBestScore(bestScoreData);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? All your data will be cleared.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const totalSessions = sessions.length;
  const avgAccuracy =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.avgAccuracy, 0) / totalSessions
        )
      : 0;

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#EBF4FF', '#E0F2F7', '#F0FDF4']}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-12 pb-6">
            {/* Header */}
            <View className="mb-6 items-center">
              <View className="bg-blue-600 rounded-full w-24 h-24 items-center justify-center mb-4 shadow-lg shadow-blue-300">
                <Text className="text-5xl">🧘‍♀️</Text>
              </View>
              <Text className="text-3xl font-bold text-blue-800">
                {user?.name || 'User'}
              </Text>
              <Text className="text-gray-600 mt-1">{user?.email}</Text>
            </View>

            {/* Stats Grid */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-blue-800 mb-4">
                Performance Stats
              </Text>

              <View className="flex-row gap-3 mb-3">
                <Card title="Total Sessions" className="flex-1">
                  <Text className="text-3xl font-bold text-blue-600 mt-2">
                    {totalSessions}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Sessions completed
                  </Text>
                </Card>

                <Card title="Current Streak" className="flex-1">
                  <Text className="text-3xl font-bold text-orange-600 mt-2">
                    {streak} 🔥
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Days in a row
                  </Text>
                </Card>
              </View>

              <View className="flex-row gap-3">
                <Card title="Best Score" className="flex-1">
                  <Text className="text-3xl font-bold text-green-600 mt-2">
                    {bestScore}
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Highest achieved
                  </Text>
                </Card>

                <Card title="Avg Accuracy" className="flex-1">
                  <Text className="text-3xl font-bold text-purple-600 mt-2">
                    {avgAccuracy}%
                  </Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    Overall average
                  </Text>
                </Card>
              </View>
            </View>

            {/* Activity Heatmap */}
            <Card title="📊 Activity Heatmap" className="mb-6">
              <View className="mt-3">
                <ActivityHeatmap sessions={sessions} />
              </View>
            </Card>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-blue-800 mb-4">
                  Recent Sessions
                </Text>
                {sessions.slice(-5).reverse().map((session, index) => (
                  <Card
                    key={index}
                    title={`Session ${sessions.length - index}`}
                    className="mb-3"
                  >
                    <View className="flex-row justify-between mt-3">
                      <View>
                        <Text className="text-gray-600 text-sm">Date</Text>
                        <Text className="text-blue-800 font-semibold">
                          {new Date(session.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-600 text-sm">Poses</Text>
                        <Text className="text-blue-800 font-semibold">
                          {session.poses}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-600 text-sm">Accuracy</Text>
                        <Text className="text-blue-800 font-semibold">
                          {session.avgAccuracy}%
                        </Text>
                      </View>
                      <View>
                        <Text className="text-gray-600 text-sm">Score</Text>
                        <Text className="text-green-600 font-bold">
                          {session.score}
                        </Text>
                      </View>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            {/* Achievements */}
            <Card title="🏅 Achievements" className="mb-6">
              <View className="mt-3 gap-3">
                {totalSessions >= 1 && (
                  <View className="flex-row items-center bg-blue-50 p-3 rounded-xl">
                    <Text className="text-2xl mr-3">🎯</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-blue-800">
                        First Steps
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        Complete your first session
                      </Text>
                    </View>
                    <Text className="text-green-600 text-xl">✓</Text>
                  </View>
                )}

                {streak >= 3 && (
                  <View className="flex-row items-center bg-orange-50 p-3 rounded-xl">
                    <Text className="text-2xl mr-3">🔥</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-orange-800">
                        On Fire
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        Maintain a 3-day streak
                      </Text>
                    </View>
                    <Text className="text-green-600 text-xl">✓</Text>
                  </View>
                )}

                {totalSessions >= 10 && (
                  <View className="flex-row items-center bg-purple-50 p-3 rounded-xl">
                    <Text className="text-2xl mr-3">💪</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-purple-800">
                        Dedicated
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        Complete 10 sessions
                      </Text>
                    </View>
                    <Text className="text-green-600 text-xl">✓</Text>
                  </View>
                )}

                {bestScore >= 500 && (
                  <View className="flex-row items-center bg-green-50 p-3 rounded-xl">
                    <Text className="text-2xl mr-3">🌟</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-green-800">
                        High Achiever
                      </Text>
                      <Text className="text-gray-600 text-sm">
                        Score over 500 points
                      </Text>
                    </View>
                    <Text className="text-green-600 text-xl">✓</Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Actions */}
            <View className="gap-3 mb-6">
              <Button
                title="← Back to Dashboard"
                onPress={() => navigation.goBack()}
                variant="secondary"
              />
              <Button title="Logout" onPress={handleLogout} variant="danger" />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default ProfileScreen;
