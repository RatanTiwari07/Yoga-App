# 🤖 AI Pose Detection Integration Guide

## Current Implementation

The app currently uses **mock pose detection** for demonstration purposes. This works perfectly in Expo Go and doesn't require any additional setup.

## Real Pose Detection Options

### Option 1: TensorFlow.js with MoveNet (Recommended for React Native)

**Status**: ✅ Dependencies installed, code structure ready

**Packages Installed**:
- `@tensorflow/tfjs`
- `@tensorflow/tfjs-react-native`
- `@tensorflow-models/pose-detection`
- `expo-gl`

**Why MoveNet**:
- Optimized for mobile devices
- Fast inference time
- Good accuracy
- Works with TensorFlow.js React Native

**Limitations with Expo Go**:
- TensorFlow.js requires native modules
- Need to create a **development build** (not compatible with Expo Go)
- Requires additional setup for camera frame processing

### Option 2: MediaPipe Pose (Web-based)

**Status**: ❌ Not compatible with React Native

**Why Not**:
- MediaPipe is designed for web browsers
- Uses WebAssembly which doesn't work in React Native
- Would require WebView wrapper (poor performance)

### Option 3: Cloud-based AI (Firebase ML Kit, AWS, Google Cloud)

**Status**: 💡 Alternative option

**Pros**:
- Works with Expo Go
- No heavy processing on device
- Always up-to-date models

**Cons**:
- Requires internet connection
- API costs
- Latency issues
- Privacy concerns

## 🚀 How to Enable Real Pose Detection

### Prerequisites

1. **Create Development Build** (Cannot use Expo Go):
   ```bash
   # Install EAS CLI
   npm install -g eas-cli
   
   # Login to Expo
   eas login
   
   # Configure project
   eas build:configure
   
   # Build for Android
   eas build --platform android --profile development
   ```

2. **Install Additional Dependencies**:
   ```bash
   npm install expo-camera-web
   npm install react-native-fs
   ```

3. **Update app.json** to include:
   ```json
   {
     "expo": {
       "plugins": [
         "expo-camera",
         [
           "@tensorflow/tfjs-react-native",
           {
             "enableProfiling": false
           }
         ]
       ]
     }
   }
   ```

### Code Implementation

The pose detection utility is already created in `/src/utils/poseDetection.ts`.

To activate it in PoseScreen.tsx:

1. **Import the utility**:
   ```typescript
   import { initPoseDetector, detectPose, checkPoseAlignment } from '../utils/poseDetection';
   ```

2. **Initialize on component mount**:
   ```typescript
   useEffect(() => {
     if (useRealPoseDetection) {
       initPoseDetector().then(() => {
         setPoseDetectorReady(true);
       });
     }
   }, [useRealPoseDetection]);
   ```

3. **Process camera frames**:
   ```typescript
   // This requires converting CameraView frames to tensor
   // Complex implementation - needs development build
   ```

### Current Toggle

The app includes a **toggle switch** in the Pose Info Card:
- **OFF** (Default): Uses mock detection (works in Expo Go)
- **ON**: Attempts real detection (requires dev build)

## 📊 Accuracy Calculation Methods

### Mock Detection (Current)
- Random scores between 60-100%
- Simulates realistic variations
- Voice feedback based on threshold

### Real Detection (When Implemented)
- Based on keypoint confidence scores
- Validates pose alignment
- Angle calculations between joints
- Real-time feedback

## 🎯 Pose Validation Logic

The `poseDetection.ts` utility includes:

1. **Keypoint Detection**: Identifies 17 body points
2. **Confidence Scores**: Each point has accuracy rating
3. **Angle Calculation**: Measures joint angles
4. **Pose Matching**: Compares to ideal pose (future feature)

### Keypoints Detected:
- Nose, Eyes, Ears
- Shoulders, Elbows, Wrists
- Hips, Knees, Ankles

## ⚡ Performance Considerations

### Mock Detection:
- ✅ Zero latency
- ✅ Works offline
- ✅ No battery drain
- ✅ Compatible with Expo Go

### Real Detection:
- ⚠️ ~30-60ms inference time
- ⚠️ Requires GPU acceleration
- ⚠️ Higher battery usage
- ⚠️ Need development build

## 🔄 Migration Path

### Phase 1: Demo (Current) ✅
- Mock pose detection
- Works in Expo Go
- Perfect for prototyping

### Phase 2: Development Build
1. Create EAS development build
2. Test TensorFlow.js integration
3. Implement frame processing
4. Validate accuracy

### Phase 3: Production
1. Optimize model performance
2. Add pose-specific validation
3. Create pose library
4. Fine-tune accuracy thresholds

## 💡 Alternative: Hybrid Approach

Combine both methods:

```typescript
const getAccuracyScore = async () => {
  if (useRealPoseDetection && poseDetectorReady) {
    // Use real AI detection
    const poses = await detectPose(cameraFrame);
    const result = checkPoseAlignment(poses, currentPose.name);
    return result.accuracy;
  } else {
    // Use mock detection
    return generateAccuracyScore();
  }
};
```

## 🔧 Troubleshooting

### "Detector not initialized"
- Ensure TensorFlow.js is properly loaded
- Check if running in development build
- Verify expo-gl is installed

### "Cannot process camera frames"
- Camera frame processing requires native code
- Use development build, not Expo Go
- Check camera permissions

### Poor Performance
- Use MoveNet Lightning model (faster)
- Reduce camera resolution
- Throttle detection frequency

## 📚 Additional Resources

- [TensorFlow.js React Native](https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native)
- [Pose Detection Models](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
- [Expo Development Builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [MoveNet Documentation](https://www.tensorflow.org/hub/tutorials/movenet)

## 🎓 Next Steps

1. **Test with Development Build**: Create and test a dev build
2. **Implement Frame Processing**: Add camera frame to tensor conversion
3. **Create Pose Library**: Define ideal poses with keypoint positions
4. **Add Visual Feedback**: Draw skeleton overlay on camera
5. **Optimize Performance**: Profile and optimize inference speed

---

**Current Status**: App is fully functional with mock detection. Real AI detection infrastructure is in place but requires development build to activate.
