# 🎯 Quick Start Guide

## 🚀 Launch App
```bash
npm start
# Then press 'a' for Android or scan QR code
```

## 📱 App Flow

```
Login/Signup → Dashboard → Choose Action
                    ↓
    ┌───────────────┼───────────────┐
    ↓               ↓               ↓
Start Session   Leaderboard     Profile
    ↓
Pose Detection
    ↓
End Session → Dashboard
```

## 🔑 Quick Tips

### First Login
- Email: `test@example.com`
- Password: `password123`
- Or create any account (mock auth)

### During Session
- **80%+ accuracy** = "Good posture!" 🎉
- **<80% accuracy** = "Adjust position" ⚠️
- Listen for voice feedback
- Watch the timer

### Scoring
- **Session Score** = Avg Accuracy × Poses Completed
- **Total Score** = Sum of all sessions
- Higher scores = Better leaderboard ranking

## 🏆 Achievements Unlocked At:
- 1 session = 🎯 First Steps
- 3-day streak = 🔥 On Fire
- 10 sessions = 💪 Dedicated
- 500+ points = 🌟 High Achiever

## 🎨 Color Guide
- 🟢 Green (90%+): Excellent
- 🔵 Blue (75-89%): Good
- 🟡 Yellow (60-74%): Fair
- 🔴 Red (<60%): Needs Work

## ⌨️ Dev Commands
| Command | Action |
|---------|--------|
| `npm start` | Start dev server |
| `npm run android` | Run on Android |
| `r` | Reload app |
| `Ctrl+C` | Stop server |

## 📂 Key Files
- `src/screens/*` - All screens
- `src/components/*` - Reusable UI
- `src/utils/mockData.ts` - Poses & leaderboard
- `src/utils/storage.ts` - AsyncStorage helpers

---

**Happy Coding! 🧘‍♀️**
