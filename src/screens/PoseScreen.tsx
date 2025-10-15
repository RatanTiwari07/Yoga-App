import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, Animated, TouchableOpacity, Switch } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Speech from 'expo-speech';
import Button from '../components/Button';
import Card from '../components/Card';
import {
  yogaPoses,
  generateAccuracyScore,
  getVoiceFeedback,
} from '../utils/mockData';
import type { YogaPose } from '../utils/mockData';
import {
  saveSession,
  getStreak,
  saveStreak,
  saveBestScore,
  getUser,
} from '../utils/storage';
import type { Session, User } from '../utils/storage';

interface PoseScreenProps {
  navigation: any;
  route: any;
}

const PoseScreen: React.FC<PoseScreenProps> = ({ navigation, route }) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [accuracyScore, setAccuracyScore] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [useRealPoseDetection, setUseRealPoseDetection] = useState(false);
  const [poseDetectorReady, setPoseDetectorReady] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const selectedPose = route.params?.selectedPose;
  const currentPose: YogaPose =
    selectedPose || yogaPoses[currentPoseIndex];

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'front' ? 'back' : 'front'));
  };

  useEffect(() => {
    if (isSessionActive) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Generate new accuracy score every 2 seconds
      const scoreInterval = setInterval(() => {
        const newScore = generateAccuracyScore();
        setAccuracyScore(newScore);

        // Voice feedback
        const feedback = getVoiceFeedback(newScore);
        Speech.speak(feedback, {
          language: 'en-US',
          pitch: 1.0,
          rate: 0.9,
        });
      }, 2000);

      // Timer
      const timerInterval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

      // Initial score
      const initialScore = generateAccuracyScore();
      setAccuracyScore(initialScore);
      Speech.speak(`Starting ${currentPose.name}`, {
        language: 'en-US',
      });

      return () => {
        clearInterval(scoreInterval);
        clearInterval(timerInterval);
      };
    }
  }, [isSessionActive, currentPoseIndex]);

  const startSession = () => {
    setIsSessionActive(true);
    setTimer(0);
    setSessionScores([]);
  };

  const nextPose = () => {
    setSessionScores([...sessionScores, accuracyScore]);
    
    if (!selectedPose && currentPoseIndex < yogaPoses.length - 1) {
      setCurrentPoseIndex(currentPoseIndex + 1);
      setAccuracyScore(0);
      setTimer(0);
    } else {
      endSession();
    }
  };

  const endSession = async () => {
    const finalScores = [...sessionScores, accuracyScore];
    const avgAccuracy = Math.round(
      finalScores.reduce((a, b) => a + b, 0) / finalScores.length
    );
    const totalScore = avgAccuracy * finalScores.length;

    // Save session
    const session: Session = {
      date: new Date().toISOString(),
      poses: finalScores.length,
      avgAccuracy,
      score: totalScore,
    };

    await saveSession(session);

    // Update streak
    const currentStreak = await getStreak();
    await saveStreak(currentStreak + 1);

    // Update best score
    await saveBestScore(totalScore);

    Speech.speak('Great session! Well done.', {
      language: 'en-US',
    });

    setIsSessionActive(false);
    navigation.navigate('Dashboard');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-blue-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-mint-50">
      <ScrollView className="flex-1">
        <View className="px-6 pt-12 pb-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-blue-800">
              Pose Detection
            </Text>
            <Text className="text-gray-600 mt-1">
              {isSessionActive ? 'Session in progress' : 'Ready to begin'}
            </Text>
          </View>

          {/* Camera Placeholder */}
          <View className="bg-gray-800 rounded-3xl aspect-[3/4] mb-6 overflow-hidden shadow-xl shadow-gray-400">
            {permission?.granted ? (
              <View className="flex-1 relative">
                <CameraView 
                  style={{ flex: 1 }}
                  facing={facing}
                />
                {/* Camera Flip Button */}
                <View style={{ position: 'absolute', top: 24, right: 24 }}>
                  <TouchableOpacity
                    onPress={toggleCameraFacing}
                    className="bg-white/20 backdrop-blur-md rounded-full p-3"
                    activeOpacity={0.7}
                  >
                    <Text className="text-white text-2xl">🔄</Text>
                  </TouchableOpacity>
                </View>

                {/* Overlay Info */}
                {isSessionActive && (
                  <View style={{ position: 'absolute', top: 24, left: 24, right: 80 }}>
                    <View className="bg-black/60 backdrop-blur-md rounded-2xl p-4">
                      <Text className="text-white text-sm opacity-70">
                        Timer: {Math.floor(timer / 60)}:
                        {(timer % 60).toString().padStart(2, '0')}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Score Display */}
                {isSessionActive && (
                  <Animated.View
                    style={{ 
                      position: 'absolute', 
                      bottom: 24, 
                      left: 24, 
                      right: 24,
                      transform: [{ scale: pulseAnim }]
                    }}
                  >
                    <View className="bg-black/60 backdrop-blur-md rounded-2xl p-6">
                      <Text className="text-white text-center text-sm opacity-70 mb-2">
                        Pose Accuracy
                      </Text>
                      <Text
                        className={`text-center text-5xl font-bold ${
                          accuracyScore >= 80 ? 'text-green-400' : 'text-yellow-400'
                        }`}
                      >
                        {accuracyScore}%
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </View>
            ) : (
              <View className="flex-1 items-center justify-center bg-gray-800">
                <View className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-purple-900/50" />
                <Text className="text-white text-6xl mb-4">📷</Text>
                <Text className="text-white text-xl font-semibold text-center px-6">
                  {permission === null ? 'Requesting camera permission...' : 'Camera Permission Required'}
                </Text>
                {!permission?.granted && permission !== null && (
                  <Button 
                    title="Grant Camera Access" 
                    onPress={requestPermission}
                    className="mt-6"
                  />
                )}
              </View>
            )}
          </View>

          {/* Pose Info Card */}
          <Card title={currentPose.name} badge={currentPose.difficulty}>
            <Text className="text-gray-600 mt-2">{currentPose.description}</Text>
            
            {/* Pose Detection Toggle */}
            <View className="flex-row items-center justify-between mt-4 bg-blue-50 p-3 rounded-xl">
              <View className="flex-1">
                <Text className="text-blue-800 font-semibold">
                  AI Pose Detection
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {useRealPoseDetection 
                    ? '⚡ Real-time detection (Requires dev build)' 
                    : '🎲 Mock detection (Demo mode)'}
                </Text>
              </View>
              <Switch
                value={useRealPoseDetection}
                onValueChange={setUseRealPoseDetection}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor={useRealPoseDetection ? '#1D4ED8' : '#F3F4F6'}
                disabled={isSessionActive}
              />
            </View>

            <View className="flex-row justify-between mt-4">
              <View className="flex-row items-center">
                <Text className="text-gray-500">⏱️ Duration:</Text>
                <Text className="text-blue-800 font-bold ml-2">
                  {currentPose.duration}s
                </Text>
              </View>
              {isSessionActive && (
                <View
                  className={`px-4 py-2 rounded-full ${getScoreBgColor(
                    accuracyScore
                  )}`}
                >
                  <Text className={`font-bold ${getScoreColor(accuracyScore)}`}>
                    {accuracyScore >= 80 ? '✓ Good!' : '⚠ Adjust'}
                  </Text>
                </View>
              )}
            </View>
          </Card>

          {/* Controls */}
          <View className="mt-6 gap-3">
            {!isSessionActive ? (
              <Button title="Start Session" onPress={startSession} />
            ) : (
              <>
                <Button
                  title={
                    selectedPose || currentPoseIndex === yogaPoses.length - 1
                      ? 'End Session'
                      : 'Next Pose'
                  }
                  onPress={nextPose}
                />
                {!selectedPose && currentPoseIndex < yogaPoses.length - 1 && (
                  <Button
                    title="End Session Now"
                    onPress={endSession}
                    variant="danger"
                  />
                )}
              </>
            )}
            {!isSessionActive && (
              <Button
                title="← Back to Dashboard"
                onPress={() => navigation.goBack()}
                variant="secondary"
              />
            )}
          </View>

          {/* Session Progress */}
          {isSessionActive && !selectedPose && (
            <Card title="Session Progress" className="mt-6">
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Poses completed:</Text>
                <Text className="text-blue-800 font-bold">
                  {currentPoseIndex + 1} / {yogaPoses.length}
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Average score:</Text>
                <Text className="text-blue-800 font-bold">
                  {sessionScores.length > 0
                    ? Math.round(
                        sessionScores.reduce((a, b) => a + b, 0) /
                          sessionScores.length
                      )
                    : 0}
                  %
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PoseScreen;
