import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Button from '../components/Button';
import { saveUser } from '../utils/storage';
import type { User } from '../utils/storage';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    if (!isLogin && !name) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(async () => {
      const userName = isLogin ? email.split('@')[0] : name;
      const user: User = {
        email,
        name: userName,
        totalScore: 0,
      };

      await saveUser(user);
      setLoading(false);
      navigation.replace('Dashboard');
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-mint-50">
      <LinearGradient
        colors={['#EBF4FF', '#E0F2F7', '#F0FDF4']}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            className="flex-1"
          >
            <View className="flex-1 justify-center px-6 py-12">
              {/* Header */}
              <View className="mb-10">
                <Text className="text-4xl font-bold text-blue-800 text-center">
                  🧘‍♀️ Yoga AI
                </Text>
                <Text className="text-gray-600 text-center mt-2 text-lg">
                  Your Personal Yoga Instructor
                </Text>
              </View>

              {/* Form Card */}
              <View className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl shadow-blue-200">
                <Text className="text-2xl font-bold text-blue-800 mb-6 text-center">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </Text>

                {!isLogin && (
                  <Input
                    label="Full Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                  />
                )}

                <Input
                  label="Email"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  placeholder="your.email@example.com"
                  keyboardType="email-address"
                  error={emailError}
                />

                <Input
                  label="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  placeholder="Enter your password"
                  secureTextEntry
                  error={passwordError}
                />

                <Button
                  title={isLogin ? 'Login' : 'Sign Up'}
                  onPress={handleAuth}
                  loading={loading}
                  className="mt-4"
                />

                <View className="flex-row justify-center mt-6">
                  <Text className="text-gray-600">
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                  </Text>
                  <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                    <Text className="text-blue-600 font-bold">
                      {isLogin ? 'Sign Up' : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Footer */}
              <Text className="text-gray-500 text-center mt-8 text-sm">
                Build your practice, one pose at a time
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;
