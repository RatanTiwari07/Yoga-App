import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';
import { mockLeaderboard } from '../utils/mockData';
import { getUser } from '../utils/storage';
import type { LeaderboardUser } from '../utils/mockData';
import type { User } from '../utils/storage';

interface LeaderboardScreenProps {
  navigation: any;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  navigation,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await getUser();
    setCurrentUser(user);

    // Add current user to leaderboard if exists
    if (user) {
      const userInLeaderboard = mockLeaderboard.find(
        (u) => u.name.toLowerCase() === user.name.toLowerCase()
      );

      if (!userInLeaderboard) {
        const updatedLeaderboard = [
          ...mockLeaderboard,
          {
            id: 'current',
            name: user.name,
            totalScore: user.totalScore || 0,
            rank: mockLeaderboard.length + 1,
          },
        ].sort((a, b) => b.totalScore - a.totalScore);

        // Update ranks
        const rankedLeaderboard = updatedLeaderboard.map((user, index) => ({
          ...user,
          rank: index + 1,
        }));

        setLeaderboard(rankedLeaderboard);
      } else {
        setLeaderboard(mockLeaderboard);
      }
    } else {
      setLeaderboard(mockLeaderboard);
    }
  };

  const getRankEmoji = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const isCurrentUser = (user: LeaderboardUser): boolean => {
    return (
      currentUser?.name.toLowerCase() === user.name.toLowerCase() ||
      user.id === 'current'
    );
  };

  const renderLeaderboardItem = ({
    item,
  }: {
    item: LeaderboardUser;
  }) => {
    const isCurrent = isCurrentUser(item);

    return (
      <View
        className={`mb-3 ${
          isCurrent ? 'border-2 border-blue-500' : ''
        } rounded-2xl overflow-hidden`}
      >
        <View
          className={`${
            isCurrent ? 'bg-blue-50' : 'bg-white'
          } rounded-2xl p-4 shadow-md shadow-gray-300 flex-row items-center justify-between`}
        >
          {/* Rank */}
          <View className="w-16 items-center">
            {item.rank <= 3 ? (
              <Text className="text-4xl">{getRankEmoji(item.rank)}</Text>
            ) : (
              <View className="bg-gray-200 rounded-full w-12 h-12 items-center justify-center">
                <Text className="text-gray-700 font-bold text-lg">
                  {item.rank}
                </Text>
              </View>
            )}
          </View>

          {/* User Info */}
          <View className="flex-1 mx-4">
            <View className="flex-row items-center">
              <Text
                className={`text-lg font-bold ${
                  isCurrent ? 'text-blue-800' : 'text-gray-800'
                }`}
              >
                {item.name}
              </Text>
              {isCurrent && (
                <View className="ml-2 bg-blue-600 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-bold">YOU</Text>
                </View>
              )}
            </View>
            <Text className="text-gray-500 text-sm mt-1">
              {item.totalScore} points
            </Text>
          </View>

          {/* Score */}
          <View className="items-end">
            <View
              className={`${
                isCurrent ? 'bg-blue-600' : 'bg-gray-100'
              } px-4 py-2 rounded-full`}
            >
              <Text
                className={`font-bold ${
                  isCurrent ? 'text-white' : 'text-gray-700'
                }`}
              >
                ⭐ {item.totalScore}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#EBF4FF', '#E0F2F7', '#F0FDF4']}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-blue-800">
              🏆 Leaderboard
            </Text>
            <Text className="text-gray-600 mt-1">
              Top yoga practitioners worldwide
            </Text>
          </View>

          {/* Stats Card */}
          {currentUser && (
            <Card title="Your Ranking" className="mb-6">
              <View className="flex-row justify-between mt-3">
                <View className="flex-1 items-center">
                  <Text className="text-gray-600 text-sm">Rank</Text>
                  <Text className="text-2xl font-bold text-blue-800 mt-1">
                    #{' '}
                    {leaderboard.find((u) => isCurrentUser(u))?.rank ||
                      'N/A'}
                  </Text>
                </View>
                <View className="flex-1 items-center border-l border-r border-gray-200">
                  <Text className="text-gray-600 text-sm">Total Score</Text>
                  <Text className="text-2xl font-bold text-blue-800 mt-1">
                    {currentUser.totalScore || 0}
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-gray-600 text-sm">Users</Text>
                  <Text className="text-2xl font-bold text-blue-800 mt-1">
                    {leaderboard.length}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Leaderboard List */}
          <FlatList
            data={leaderboard}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />

          {/* Back Button */}
          <View className="absolute bottom-6 left-6 right-6">
            <Button
              title="← Back to Dashboard"
              onPress={() => navigation.goBack()}
              variant="secondary"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default LeaderboardScreen;
