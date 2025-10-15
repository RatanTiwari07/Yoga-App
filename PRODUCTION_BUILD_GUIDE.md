# Production Build Setup Guide

This guide explains how to create a development/production build with full pose detection capabilities.

## Overview

The AI-Powered Yoga Instructor app uses native modules that are **not available in Expo Go**:
- `react-native-vision-camera` (camera frame processing)
- `react-native-worklets-core` (native threading)
- `@shopify/react-native-skia` (hardware-accelerated graphics)
- `@tensorflow/tfjs-react-native` (ML inference)

To enable real-time pose detection, you must create a **development build** or **production build**.

## Quick Start

### Option 1: Development Build (EAS Build)

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to Expo
eas login

# 3. Configure project
eas build:configure

# 4. Create development build for Android
eas build --profile development --platform android

# 5. Install on device
# Download the .apk from EAS dashboard and install
```

### Option 2: Local Development Build

```bash
# 1. Install Android Studio and set up Android SDK
# Follow: https://reactnative.dev/docs/environment-setup

# 2. Create local build
npx expo run:android

# 3. App will install and run on connected device/emulator
```

## Detailed Setup Instructions

### Prerequisites

1. **Node.js**: v18+ recommended
2. **Expo CLI**: Latest version
3. **Android Studio**: For local builds
4. **Physical Android Device**: Recommended for camera testing

### Step 1: Verify Dependencies

Check that all required packages are installed:

```bash
npm list react-native-vision-camera
npm list react-native-worklets-core
npm list @shopify/react-native-skia
npm list @tensorflow/tfjs-react-native
```

If missing, install with:

```bash
npm install --legacy-peer-deps \
  react-native-vision-camera \
  react-native-worklets-core \
  @shopify/react-native-skia \
  @tensorflow/tfjs-react-native
```

### Step 2: Configure Camera Permissions

#### `app.json`

Ensure camera permissions are configured:

```json
{
  "expo": {
    "name": "AI-Powered Yoga Instructor",
    "slug": "yoga-app",
    "android": {
      "permissions": [
        "CAMERA",
        "RECORD_AUDIO"
      ],
      "package": "com.yourcompany.yogaapp"
    },
    "plugins": [
      [
        "react-native-vision-camera",
        {
          "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera for pose detection.",
          "enableMicrophonePermission": false
        }
      ],
      "@react-native-firebase/app"
    ]
  }
}
```

### Step 3: Configure Babel for Worklets

#### `babel.config.js`

Add worklets plugin:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-worklets-core/plugin', // Add this
      'react-native-reanimated/plugin',
    ],
  };
};
```

### Step 4: Enable Real Pose Detection

#### Update `PoseScreen.tsx`

Change the PoseCamera configuration:

```typescript
{useRealPoseDetection ? (
  <PoseCamera
    facing={facing}
    useMockDetection={false} // ← Change to false
    onPoseFrame={handlePoseFrame}
    config={{
      minConfidence: 0.5,
      targetFPS: 30,
      enableSmoothing: true,
      smoothingFactor: 0.3,
    }}
  />
) : (
  <CameraView 
    style={{ flex: 1 }}
    facing={facing}
  />
)}
```

### Step 5: Implement Frame Processor

#### Update `PoseCamera.tsx`

Uncomment and implement the frame processor:

```typescript
import { useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-worklets-core';

// Inside PoseCamera component:
const frameProcessor = useFrameProcessor((frame) => {
  'worklet';
  
  try {
    // Call your pose detection plugin
    // Example: const poses = __detectPose(frame);
    
    // For now, you can use a placeholder
    // In production, integrate with TensorFlow Lite plugin
    
    // Convert results to Landmark array
    // Apply smoothing, calculate angles
    // Update UI via runOnJS
    
  } catch (error) {
    console.error('Frame processor error:', error);
  }
}, [config]);

// Apply to Camera:
<Camera
  style={StyleSheet.absoluteFill}
  device={device}
  isActive={true}
  frameProcessor={frameProcessor} // ← Enable this
/>
```

### Step 6: Integrate TensorFlow Lite

#### Option A: Use Pre-built Plugin (Recommended)

Search for existing plugins:
- `vision-camera-pose-detection`
- `vision-camera-tensorflow-lite`

```bash
npm install vision-camera-pose-detection
```

#### Option B: Custom Native Module

1. Create a Vision Camera plugin
2. Load TensorFlow Lite MoveNet model
3. Process frames and return keypoints
4. Follow Vision Camera plugin docs: https://react-native-vision-camera.com/docs/guides/frame-processors-plugins-overview

### Step 7: Build the App

#### EAS Build (Cloud)

```bash
# Development build
eas build --profile development --platform android

# Production build
eas build --profile production --platform android
```

#### Local Build

```bash
# Development
npx expo run:android

# Production (requires signing keys)
cd android
./gradlew assembleRelease
```

### Step 8: Test on Device

1. Install the .apk on your Android device
2. Grant camera permissions when prompted
3. Open the app and navigate to Pose Detection screen
4. Enable "AI Pose Detection" toggle
5. Start a session
6. Verify skeleton overlay appears
7. Check console logs for pose data

## Troubleshooting

### Issue: "Camera permission denied"

**Solution**:
```bash
# Check app.json has camera permission
# Reinstall app to reset permissions
adb uninstall com.yourcompany.yogaapp
npx expo run:android
```

### Issue: "Frame processor plugin not found"

**Solution**:
```bash
# Clean build cache
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Issue: "TensorFlow model not loading"

**Solution**:
```typescript
// Add model loading logic
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

useEffect(() => {
  const loadModel = async () => {
    await tf.ready();
    // Load MoveNet model
    const model = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet
    );
    setModel(model);
  };
  loadModel();
}, []);
```

### Issue: Low FPS / Performance

**Solution**:
1. Reduce `targetFPS` to 15
2. Use `SimpleSkeletonOverlay` instead of full overlay
3. Disable smoothing temporarily
4. Process every other frame:

```typescript
let frameCount = 0;
const frameProcessor = useFrameProcessor((frame) => {
  'worklet';
  frameCount++;
  if (frameCount % 2 === 0) return; // Process every 2nd frame
  
  // ... detection logic
}, []);
```

## Performance Optimization

### 1. Frame Rate Throttling

```typescript
config={{
  targetFPS: 15, // Lower FPS = better performance
}}
```

### 2. Resolution Scaling

```typescript
<Camera
  style={StyleSheet.absoluteFill}
  device={device}
  isActive={true}
  frameProcessor={frameProcessor}
  pixelFormat="yuv"
  fps={30}
  video={true}
  // Use lower resolution preset
  preset="medium" // or "low"
/>
```

### 3. Worklet Optimization

```typescript
// Avoid expensive operations in worklet
const frameProcessor = useFrameProcessor((frame) => {
  'worklet';
  
  // ✅ Fast: Direct frame processing
  const poses = __detectPose(frame);
  
  // ❌ Slow: Complex calculations
  // const result = heavyComputation(poses);
  
  // Move heavy work to JS thread
  runOnJS(processResults)(poses);
}, []);
```

## Build Profiles

### `eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Deployment Checklist

- [ ] Camera permissions configured in `app.json`
- [ ] Babel plugin for worklets added
- [ ] Frame processor implemented
- [ ] TensorFlow Lite model loading
- [ ] Error handling for camera/model failures
- [ ] Performance optimizations applied
- [ ] Testing on multiple devices
- [ ] Build signed APK/AAB for release
- [ ] Upload to Google Play Console

## Required Files Checklist

### Modified Files
- [x] `src/components/PoseCamera.tsx` - Enable frame processor
- [x] `src/screens/PoseScreen.tsx` - Set `useMockDetection={false}`
- [x] `babel.config.js` - Add worklets plugin
- [x] `app.json` - Camera permissions and plugins

### New Files (Optional)
- [ ] `android/app/src/main/cpp/` - Native TensorFlow Lite plugin
- [ ] `src/utils/modelLoader.ts` - Model initialization
- [ ] `src/hooks/usePoseDetection.ts` - Detection hook

## Resources

### Documentation
- **Expo Development Builds**: https://docs.expo.dev/development/introduction/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Vision Camera**: https://react-native-vision-camera.com/
- **TensorFlow Lite**: https://www.tensorflow.org/lite

### Plugins
- **Vision Camera Plugins**: https://github.com/topics/vision-camera-plugin
- **TensorFlow Lite Plugin**: https://github.com/tensorflow/tfjs/tree/master/tfjs-react-native

### Community
- **Expo Discord**: https://chat.expo.dev/
- **React Native Community**: https://reactnative.dev/community/overview

## Next Steps

After completing the build:

1. **Test thoroughly**: Try different poses, lighting, distances
2. **Optimize performance**: Profile FPS, CPU, memory usage
3. **Add pose templates**: Create reference angles for yoga poses
4. **Implement feedback**: Use `generatePoseFeedback()` for corrections
5. **Track progress**: Save pose accuracy data to backend
6. **Add animations**: Show pose transitions
7. **Social features**: Share achievements, compare with friends

## Support

For issues or questions:
- Check `POSE_DETECTION_ARCHITECTURE.md` for system details
- Review `TROUBLESHOOTING.md` for common issues
- Open an issue on GitHub
- Contact support@yogaapp.com
