# 🧘‍♀️ AI-Powered Yoga Instructor

A modern, frontend-only React Native Android app that simulates an AI-driven yoga companion with pose detection, voice feedback, and progress tracking.

## 📱 Features

- **Mock Authentication**: Simple login/signup with local storage
- **Dashboard**: View daily yoga poses and quick access to features
- **Pose Detection Simulation**: Camera preview mockup with randomly generated accuracy scores
- **Voice Feedback**: Text-to-speech prompts using expo-speech
- **Leaderboard**: Track your ranking against other users
- **Profile & Stats**: View session history, streaks, and achievements
- **Smooth Animations**: Fade-in effects and pulse animations

## 🛠️ Tech Stack

- **React Native** (Expo)
- **TypeScript**
- **NativeWind** (Tailwind CSS for React Native)
- **React Navigation** (Stack Navigator)
- **AsyncStorage** (Local persistence)
- **expo-speech** (Voice feedback)
- **expo-linear-gradient** (Gradient backgrounds)

## 📂 Project Structure

```
/src
 ├── components/
 │    ├── Button.tsx          # Reusable button component
 │    ├── Card.tsx            # Reusable card component
 │    ├── Input.tsx           # Reusable input component
 ├── screens/
 │    ├── LoginScreen.tsx     # Login/Signup screen
 │    ├── DashboardScreen.tsx # Main dashboard
 │    ├── PoseScreen.tsx      # Pose detection simulator
 │    ├── LeaderboardScreen.tsx # Rankings
 │    ├── ProfileScreen.tsx   # User profile & stats
 ├── navigation/
 │    ├── AppNavigator.tsx    # Navigation setup
 ├── utils/
 │    ├── mockData.ts         # Mock poses & leaderboard
 │    ├── storage.ts          # AsyncStorage helpers
 ├── App.tsx                   # Main app entry
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android emulator) or physical Android device

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on Android**:
   ```bash
   npm run android
   ```

   Or scan the QR code with the Expo Go app on your Android device.

## 🎨 UI/UX Design

- **Color Palette**: Calm blues, mint greens, and off-white
- **Typography**: Bold headings in blue-800, gray-600 for subtexts
- **Components**: Rounded cards and buttons with subtle shadows
- **Animations**: Smooth fade-in transitions and pulse effects

## 📝 Mock Data

### Yoga Poses
The app includes 10 pre-defined yoga poses:
- Tree Pose
- Downward Dog
- Warrior I & II
- Triangle Pose
- Child's Pose
- Cobra Pose
- Plank Pose
- Bridge Pose
- Lotus Pose

### Leaderboard
Mock leaderboard with 10 users. Your user will be added dynamically.

### Voice Feedback
- Score > 80%: "Good posture!"
- Score ≤ 80%: "Adjust your position slightly."

## 📊 Local Storage

The app uses AsyncStorage to persist:
- User credentials (mock)
- Session history
- Streak count
- Best score

## 🎯 Key Features Explained

### Login/Signup
- Email validation
- Password minimum length (6 characters)
- Mock authentication (no real backend)
- Stores user info locally

### Dashboard
- Welcome message with username
- List of 10 yoga poses
- Quick action buttons for sessions, leaderboard, and profile
- Fade-in animation on mount

### Pose Detection Screen
- Camera preview mockup (no actual camera)
- Randomly generated accuracy scores (60-100%)
- Real-time voice feedback via expo-speech
- Session timer
- Ability to cycle through poses or end session

### Leaderboard
- Top 10 users (mock data)
- Your ranking highlighted
- Medal icons for top 3 (🥇🥈🥉)

### Profile
- Session statistics
- Current streak
- Best score
- Recent session history
- Achievement badges
- Logout functionality

## 🚫 Exclusions

- ❌ No real backend or API
- ❌ No actual camera integration
- ❌ No real pose detection (Mediapipe)
- ❌ No iOS or tablet optimization
- ❌ No complex responsive design

## 🎨 Styling

All styling is done with **NativeWind** (Tailwind CSS):
- Utility-first approach
- Custom color extensions for mint palette
- Consistent spacing and shadows
- No external CSS files (except global.css for setup)

## 📱 Android Only

This app is optimized for Android devices in portrait mode. iOS compatibility is not guaranteed.

## 🐛 Troubleshooting

### Clear Cache
```bash
npx expo start -c
```

### Reset Project
```bash
npm install
npx expo start -c
```

### Android Build Issues
Make sure you have Android Studio installed and properly configured.

## 📄 License

This is a frontend demo project for educational purposes.

## 🙏 Acknowledgments

Built with ❤️ using React Native, Expo, and NativeWind.

---

**Note**: This is a mock application without real AI or pose detection. All features are simulated for demonstration purposes.