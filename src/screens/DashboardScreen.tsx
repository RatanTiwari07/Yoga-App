import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '../components/Card';
import Button from '../components/Button';
import { getUser } from '../utils/storage';
import { yogaPoses } from '../utils/mockData';
import type { User } from '../utils/storage';

interface DashboardScreenProps {
  navigation: any;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<User | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadUser();
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadUser = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#EBF4FF', '#E0F2F7', '#F0FDF4']}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }} className="px-6 pt-12 pb-6">
            {/* Header */}
            <View className="mb-6">
              <Text className="text-3xl font-bold text-blue-800">
                Welcome back,
              </Text>
              <Text className="text-3xl font-bold text-blue-600">
                {user?.name || 'Yogi'} 🙏
              </Text>
              <Text className="text-gray-600 mt-2">
                Ready for your practice today?
              </Text>
            </View>

            {/* Quick Actions */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1">
                <Button
                  title="🧘 Start Session"
                  onPress={() => navigation.navigate('Pose')}
                  variant="primary"
                />
              </View>
            </View>

            <View className="flex-row gap-3 mb-8">
              <View className="flex-1">
                <Button
                  title="🏆 Leaderboard"
                  onPress={() => navigation.navigate('Leaderboard')}
                  variant="secondary"
                />
              </View>
              <View className="flex-1">
                <Button
                  title="👤 Profile"
                  onPress={() => navigation.navigate('Profile')}
                  variant="secondary"
                />
              </View>
            </View>

            {/* Daily Poses Section */}
            <View className="mb-4">
              <Text className="text-2xl font-bold text-blue-800 mb-4">
                Today's Poses
              </Text>
            </View>

            {/* Pose Cards */}
            <View className="gap-4">
              {yogaPoses.map((pose) => (
                <Card
                  key={pose.id}
                  title={pose.name}
                  description={pose.description}
                  badge={pose.difficulty}
                  onPress={() =>
                    navigation.navigate('Pose', { selectedPose: pose })
                  }
                >
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-gray-500 text-sm">
                      ⏱️ {pose.duration}s
                    </Text>
                    <View className="bg-blue-600 px-4 py-2 rounded-lg">
                      <Text className="text-white font-semibold">
                        Start →
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>

            {/* Bottom Spacing */}
            <View className="h-8" />
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default DashboardScreen;
