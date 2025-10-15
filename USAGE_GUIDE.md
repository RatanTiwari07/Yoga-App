# 📖 Usage Guide - AI-Powered Yoga Instructor

## 🎬 Getting Started

### First Time Setup

1. **Start the Development Server**
   ```bash
   npm start
   ```

2. **Run on Android**
   - Option 1: Press `a` in the terminal to open in Android emulator
   - Option 2: Scan the QR code with Expo Go app on your Android device
   - Option 3: Run `npm run android`

## 🔐 Authentication Flow

### Login/Signup
1. **First Time Users (Signup)**:
   - Tap "Sign Up" at the bottom
   - Enter your full name
   - Enter a valid email (e.g., `user@example.com`)
   - Enter a password (minimum 6 characters)
   - Tap "Sign Up"

2. **Returning Users (Login)**:
   - Enter your email
   - Enter your password
   - Tap "Login"

**Note**: This is mock authentication. Any valid email/password combo will work!

## 🏠 Dashboard

After logging in, you'll see:

### Quick Actions
- **🧘 Start Session**: Begin a guided yoga session
- **🏆 Leaderboard**: View rankings
- **👤 Profile**: Check your stats

### Today's Poses
- Scroll through 10 yoga poses
- Each card shows:
  - Pose name
  - Description
  - Difficulty level
  - Duration
- Tap any pose card to start that specific pose

## 🧘 Pose Detection Session

### Starting a Session
1. From Dashboard, tap "Start Session" or tap any pose card
2. You'll see a camera preview placeholder
3. Tap "Start Session" to begin

### During a Session
- **Accuracy Score**: Updates every 2 seconds (60-100%)
- **Voice Feedback**: 
  - Score > 80%: "Good posture!"
  - Score ≤ 80%: "Adjust your position slightly."
- **Timer**: Tracks session duration
- **Session Progress**: Shows poses completed and average score

### Session Controls
- **Next Pose**: Move to the next yoga pose (if in full session)
- **End Session**: Complete and save your session
- Session data is automatically saved to your profile

## 🏆 Leaderboard

### Features
- View top 10 users
- Your ranking is highlighted in blue with a "YOU" badge
- Medal icons for top 3:
  - 🥇 1st place
  - 🥈 2nd place
  - 🥉 3rd place
- See total scores for each user

### Your Ranking Card
Displays:
- Your current rank
- Your total score
- Total number of users

## 👤 Profile

### Performance Stats
Four main metrics:
1. **Total Sessions**: Number of completed sessions
2. **Current Streak**: Consecutive days of practice 🔥
3. **Best Score**: Highest session score achieved
4. **Avg Accuracy**: Overall accuracy percentage

### Recent Sessions
View your last 5 sessions with:
- Session number
- Date
- Number of poses
- Average accuracy
- Total score

### Achievements
Unlock badges by:
- 🎯 **First Steps**: Complete your first session
- 🔥 **On Fire**: Maintain a 3-day streak
- 💪 **Dedicated**: Complete 10 sessions
- 🌟 **High Achiever**: Score over 500 points

### Logout
- Tap "Logout" button
- Confirm the action
- All local data will be cleared
- Returns to login screen

## 💡 Tips & Tricks

### Maximizing Your Score
- Stay in each pose for the full duration
- Watch for real-time accuracy feedback
- Listen to voice prompts
- Maintain consistent practice for better averages

### Building Your Streak
- Complete at least one session daily
- Check your profile to track streak progress
- Streaks increase with consecutive daily sessions

### Exploring Poses
- Try different difficulty levels:
  - **Beginner**: Tree Pose, Downward Dog, etc.
  - **Intermediate**: Warrior poses, Plank
  - **Advanced**: Lotus Pose
- Each pose has a recommended duration

## 🎨 UI Features

### Animations
- **Dashboard**: Fade-in effect on load
- **Pose Screen**: Pulse animation on accuracy score
- **Cards**: Smooth tap interactions

### Color Coding
- **Green**: Excellent accuracy (90%+)
- **Blue**: Good accuracy (75-89%)
- **Yellow**: Fair accuracy (60-74%)
- **Red**: Needs improvement (<60%)

## 📊 Understanding Scores

### How Scoring Works
1. **Accuracy Score**: Random 60-100% generated every 2 seconds
2. **Session Score**: (Average Accuracy × Number of Poses)
3. **Total Score**: Sum of all session scores

### Score Display
- Real-time accuracy shown during pose
- Session summary after completion
- Cumulative total in profile and leaderboard

## 🔄 Data Persistence

### What Gets Saved
- User credentials (email, name)
- Session history
- Current streak
- Best score

### What Doesn't Persist
- Active session state (ends on app close)
- Leaderboard data (mock data resets)

### Clearing Data
- Use the Logout function to clear all local data
- Or manually clear app data in Android settings

## ⚠️ Known Limitations

### Mock Features
- **No Real Camera**: Camera view is simulated
- **No Real Pose Detection**: Accuracy scores are random
- **No Backend**: All data is local
- **Leaderboard**: Other users are mock data

### Android Only
- Optimized for Android phones in portrait mode
- May not work properly on tablets or iOS

## 🐛 Troubleshooting

### App Won't Start
```bash
npx expo start -c
```

### Changes Not Reflecting
- Press `r` in the terminal to reload
- Or shake your device and tap "Reload"

### Build Errors
```bash
rm -rf node_modules
npm install
npx expo start -c
```

### Voice Not Working
- Ensure device volume is up
- Check that TTS is enabled in Android settings
- Some emulators may not support TTS

## 🎯 Best Practices

1. **Complete Full Sessions**: Don't just try single poses
2. **Daily Practice**: Build your streak
3. **Explore All Poses**: Try different difficulty levels
4. **Track Progress**: Regularly check your profile stats
5. **Compete**: Try to reach the top of the leaderboard

## 🚀 Next Steps

After mastering the app:
1. Check your achievements
2. Try to beat your best score
3. Maintain the longest streak possible
4. Explore all 10 yoga poses
5. Reach #1 on the leaderboard!

---

**Enjoy your yoga journey! 🧘‍♀️✨**
