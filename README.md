# 🧘‍♀️ AI-Powered Yoga Instructor

A modern React Native Android app with **real-time pose detection**, AI-powered feedback, and comprehensive progress tracking for yoga practice.

## ✨ Features

### Core Features
- **Real-time Pose Detection**: Computer vision using TensorFlow Lite + MoveNet
- **Skeleton Overlay**: Visual feedback with 17 keypoints and joint connections
- **Joint Angle Calculations**: Precise measurements for 14 body joints
- **Voice Feedback**: Real-time audio guidance using expo-speech
- **Activity Heatmap**: GitHub-style 90-day practice visualization
- **Progress Tracking**: Session history, streaks, achievements, and rankings

### Pose Detection Capabilities
- 17 body landmarks (nose, eyes, shoulders, elbows, wrists, hips, knees, ankles)
- 14 calculated joint angles (elbows, knees, hips, shoulders, etc.)
- Real-time pose comparison with reference poses
- Temporal smoothing to reduce jitter
- Confidence scoring and person detection
- TypeScript API for data export

### Two Modes
1. **Mock Mode** (Expo Go): Simulated pose detection for testing UI/UX
2. **Real Mode** (Dev Build): Actual computer vision with Vision Camera + TensorFlow

## 🛠️ Tech Stack

### Frontend
- **React Native** (~0.73) with Expo SDK ~54
- **TypeScript** for type safety
- **NativeWind** v4 (Tailwind CSS for React Native)
- **React Navigation** v7 (Stack Navigator)

### Pose Detection Stack
- **react-native-vision-camera** v3 - Camera frame processing
- **@shopify/react-native-skia** - Hardware-accelerated skeleton rendering
- **@tensorflow/tfjs-react-native** - ML inference
- **react-native-worklets-core** - Native-speed frame processors

### Storage & Utils
- **AsyncStorage** - Local data persistence
- **expo-speech** - Text-to-speech feedback
- **expo-linear-gradient** - UI gradients

## 📂 Project Structure

```
Yoga-App/
├── src/
│   ├── components/
│   │   ├── ActivityHeatmap.tsx     # 90-day practice heatmap
│   │   ├── Button.tsx              # Reusable button component
│   │   ├── Card.tsx                # Card container component
│   │   ├── Input.tsx               # Form input component
│   │   ├── PoseCamera.tsx          # Camera + pose detection wrapper
│   │   └── SkeletonOverlay.tsx     # Skia-based skeleton rendering
│   ├── screens/
│   │   ├── LoginScreen.tsx         # Authentication screen
│   │   ├── DashboardScreen.tsx     # Main dashboard with pose grid
│   │   ├── PoseScreen.tsx          # Pose detection + session mgmt
│   │   ├── LeaderboardScreen.tsx   # User rankings
│   │   └── ProfileScreen.tsx       # Stats, heatmap, achievements
│   ├── navigation/
│   │   └── AppNavigator.tsx        # Stack navigator setup
│   ├── types/
│   │   └── poseTypes.ts            # Complete pose detection types
│   └── utils/
│       ├── mockData.ts             # 10 yoga poses + leaderboard
│       ├── storage.ts              # AsyncStorage helpers
│       ├── poseDetection.ts        # TensorFlow integration
│       └── poseProcessing.ts       # Angle calc, smoothing, comparison
├── assets/                          # Images and icons
├── app.json                         # Expo configuration
├── package.json                     # Dependencies
├── tailwind.config.js              # NativeWind styling config
├── README.md                        # This file
├── DEV_BUILD_SETUP.md              # 🚀 Start here for pose detection!
├── POSE_DETECTION_ARCHITECTURE.md  # Technical architecture docs
├── PRODUCTION_BUILD_GUIDE.md       # Advanced setup guide
├── API_REFERENCE.md                # Complete TypeScript API
└── USAGE_GUIDE.md                  # Feature documentation
```

## 🚀 Getting Started

### Quick Start (Expo Go - Mock Mode Only)

```bash
# Install dependencies
npm install

# Start development server
npm start

# Press 'a' for Android or scan QR code
```

**Note**: This runs in **mock mode** with simulated pose detection. For real pose detection, see below.

---

### ⚠️ Getting Vision Camera Error?

If you see:
```
react-native-vision-camera is not supported in Expo Go!
```

**Solution**: You need a development build for real pose detection.

👉 **Follow the step-by-step guide**: [`DEV_BUILD_SETUP.md`](./DEV_BUILD_SETUP.md)

**Quick version**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create development build (~20 minutes)
eas build --profile development --platform android

# After installing APK on phone
npx expo start --dev-client
```

---

### Development Build vs Expo Go

| Feature | Expo Go | Development Build |
|---------|---------|-------------------|
| **Setup** | Instant | ~20 min (one-time) |
| **Pose Detection** | Mock only | Full computer vision |
| **Vision Camera** | ❌ Not supported | ✅ Supported |
| **TensorFlow** | ❌ Not supported | ✅ Supported |
| **Use Case** | UI/UX testing | Production features |

---

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