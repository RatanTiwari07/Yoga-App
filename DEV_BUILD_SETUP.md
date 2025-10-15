# 🚀 Development Build Setup

**⚠️ IMPORTANT**: You're seeing this error because Vision Camera requires a development build!

```
react-native-vision-camera is not supported in Expo Go!
Use EAS/expo prebuild instead (expo run:android)
```

## Solution: Create Development Build

Follow these steps to fix the error and enable pose detection.

---

## 🎯 Recommended: EAS Build (Cloud - Easiest)

### Step 1: Install EAS CLI

Open PowerShell in your project directory:

```powershell
npm install -g eas-cli
```

### Step 2: Login to Expo

```powershell
eas login
```

- If you have an Expo account: enter credentials
- If not: create one at https://expo.dev/signup

### Step 3: Configure Project

```powershell
eas build:configure
```

- Select "All" when asked which platforms
- This creates `eas.json` file

### Step 4: Start Development Build

```powershell
eas build --profile development --platform android
```

**Wait Time**: ~15-20 minutes

**What's happening:**
1. Your code uploads to Expo servers ☁️
2. Build happens in the cloud ⚙️
3. You get a download link 📱

### Step 5: Install APK on Your Phone

1. Check your email for build completion notification
2. Or copy the link from terminal
3. Open link on your Android phone
4. Download the APK
5. Install it (you may need to allow "Install from unknown sources" in Settings)

### Step 6: Run Development Server

Back in PowerShell:

```powershell
npx expo start --dev-client
```

- Scan QR code with Expo Go app, OR
- Press `a` to open on connected device

**✅ DONE! No more Vision Camera errors!**

---

## ⚡ Alternative: Local Build (Faster, Needs Android Studio)

### Prerequisites

1. Install Android Studio from https://developer.android.com/studio
2. Install Android SDK (API 33 or higher)
3. Connect Android device via USB or start emulator

### Build Command

```powershell
npx expo run:android
```

This will:
- Create native Android project
- Build APK (~10 minutes first time)
- Install on device automatically
- Start Metro bundler

### After First Build

You only need to rebuild when adding new native packages. For daily development:

```powershell
npx expo start --dev-client
```

---

## 🧪 Test Pose Detection

After installing the development build:

1. Open the app
2. Login (any email/password)
3. Tap "Start Session" or select a pose
4. Toggle "AI Pose Detection" to **ON**
5. Grant camera permission when prompted
6. Tap "Start Session"

**Expected behavior:**
- ✅ Camera preview shows (no errors!)
- ✅ "🎲 Mock Mode" badge visible
- ✅ Skeleton overlay appears (simulated)
- ✅ Accuracy score updates

---

## 🔧 Troubleshooting

### Error: "eas command not found"

```powershell
# Reinstall EAS CLI
npm uninstall -g eas-cli
npm install -g eas-cli --force

# Verify installation
eas --version
```

### Error: "Not logged in"

```powershell
eas login

# Or logout and login again
eas logout
eas login
```

### Error: "No Expo account"

1. Go to https://expo.dev/signup
2. Create free account
3. Verify email
4. Run `eas login` again

### Build Takes Too Long

- Builds usually take 10-20 minutes
- First build is slowest
- Subsequent builds are cached and faster
- Check status: https://expo.dev/accounts/[your-username]/builds

### App Crashes After Install

1. Make sure you installed the **development** build (not production)
2. Check that camera permissions are granted
3. Verify `useMockDetection={true}` in PoseCamera component

---

## 📊 What Each Option Does

| Feature | EAS Build | Local Build |
|---------|-----------|-------------|
| **Setup Time** | 5 min | 30 min (first time) |
| **Build Time** | 15-20 min | 10 min |
| **Internet Required** | Yes (upload/download) | No |
| **Android Studio Needed** | No | Yes |
| **Recommended For** | Beginners | Experienced devs |

---

## ⏱️ Complete Timeline (EAS Build)

```
1. Install EAS CLI          →  2 minutes
2. Login to Expo            →  1 minute
3. Configure project        →  1 minute
4. Start build              →  2 minutes (upload)
5. Cloud build              → 15 minutes
6. Download APK             →  3 minutes
7. Install on phone         →  1 minute
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL:                      ~ 25 minutes
```

---

## 📋 Quick Commands

### First Time (EAS)

```powershell
npm install -g eas-cli
eas login
eas build:configure
eas build --profile development --platform android
# Wait for build, install APK on phone
npx expo start --dev-client
```

### First Time (Local)

```powershell
npx expo run:android
# Wait for build and auto-install
npx expo start --dev-client
```

### Daily Development

```powershell
npx expo start --dev-client
```

---

## 🎯 Current vs After Build

### Right Now (Expo Go)
- ❌ Vision Camera error
- ❌ Pose detection crashes
- ❌ Can't access camera frame processor

### After Development Build
- ✅ Vision Camera works
- ✅ Pose detection runs (mock mode)
- ✅ Skeleton overlay renders
- ✅ Ready for real pose detection

---

## 🚀 Next Steps

1. **Complete this guide** → Fix Vision Camera error
2. **Test mock mode** → Verify skeleton overlay works
3. **Read PRODUCTION_BUILD_GUIDE.md** → Learn about real pose detection
4. **Implement frame processor** → Connect TensorFlow Lite
5. **Deploy to Play Store** → Share your app!

---

## 📚 Additional Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Development Builds**: https://docs.expo.dev/develop/development-builds/introduction/
- **Expo Go vs Dev Build**: https://docs.expo.dev/archive/managed-vs-bare/
- **Vision Camera Setup**: https://react-native-vision-camera.com/docs/guides/
- **Get Help**: https://chat.expo.dev/

---

## ❓ FAQ

**Q: Can I still use Expo Go for other features?**  
A: Yes, but pose detection will only work in development build.

**Q: Do I need to rebuild every time I change code?**  
A: No! Only rebuild when you add new native modules. Code changes hot-reload.

**Q: Will this work on my friend's phone?**  
A: Yes, just send them the APK file.

**Q: Can I publish this to Play Store?**  
A: Yes, run `eas build --profile production --platform android` for release build.

**Q: Is EAS Build free?**  
A: Free tier includes builds, but limited. Upgrade for unlimited.

**Q: What if build fails?**  
A: Check the build logs on https://expo.dev, share error in Expo Discord.

---

**Ready to start?** Run the first command now! 👇

```powershell
npm install -g eas-cli
```
