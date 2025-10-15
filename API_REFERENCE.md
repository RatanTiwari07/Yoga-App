# Pose Detection API Reference

Complete TypeScript API reference for the pose detection system.

## Table of Contents

- [Types](#types)
- [Components](#components)
- [Utilities](#utilities)
- [Hooks](#hooks)
- [Constants](#constants)

---

## Types

### `Landmark`

Represents a single body keypoint detected by the pose estimator.

```typescript
interface Landmark {
  /** Keypoint name (e.g., 'left_shoulder') */
  name: string;
  
  /** Normalized x coordinate (0-1) */
  x: number;
  
  /** Normalized y coordinate (0-1) */
  y: number;
  
  /** Normalized z coordinate (0-1, depth) */
  z: number;
  
  /** Detection confidence (0-1) */
  confidence: number;
  
  /** Whether landmark is visible (not occluded) */
  isVisible: boolean;
}
```

**Example:**
```typescript
const shoulder: Landmark = {
  name: 'left_shoulder',
  x: 0.45,
  y: 0.30,
  z: 0.5,
  confidence: 0.92,
  isVisible: true,
};
```

---

### `JointAngles`

Collection of 14 calculated joint angles in degrees.

```typescript
interface JointAngles {
  // Arms
  leftElbow: number;      // 0-180°
  rightElbow: number;
  leftShoulder: number;   // Arm raise angle
  rightShoulder: number;
  leftWrist: number;
  rightWrist: number;
  
  // Legs
  leftKnee: number;       // 0-180°
  rightKnee: number;
  leftHip: number;        // Leg raise angle
  rightHip: number;
  leftAnkle: number;
  rightAnkle: number;
  
  // Torso
  neckSpine: number;      // Head tilt
  spine: number;          // Torso bend
}
```

**Example:**
```typescript
const angles: JointAngles = {
  leftElbow: 145.2,
  rightElbow: 148.7,
  leftKnee: 170.3,
  rightKnee: 168.9,
  // ... other angles
};
```

---

### `PoseData`

Complete pose detection result for a single frame.

```typescript
interface PoseData {
  /** Array of 17 detected landmarks */
  landmarks: Landmark[];
  
  /** Calculated joint angles */
  angles: JointAngles;
  
  /** Overall pose confidence (0-1) */
  confidence: number;
  
  /** Timestamp in milliseconds */
  timestamp: number;
  
  /** Frame sequence number */
  frameNumber: number;
  
  /** Whether a person was detected */
  isPersonDetected: boolean;
}
```

**Example:**
```typescript
const poseData: PoseData = {
  landmarks: [...], // 17 landmarks
  angles: { leftElbow: 145, ... },
  confidence: 0.87,
  timestamp: 1704672000000,
  frameNumber: 1234,
  isPersonDetected: true,
};
```

---

### `PoseConfig`

Configuration options for pose detection.

```typescript
interface PoseConfig {
  /** Minimum confidence threshold (0-1) */
  minConfidence: number;
  
  /** Target frames per second for processing */
  targetFPS: number;
  
  /** Enable temporal smoothing */
  enableSmoothing: boolean;
  
  /** Smoothing factor (0-1, higher = more smoothing) */
  smoothingFactor: number;
  
  /** Show skeleton overlay */
  showSkeleton: boolean;
  
  /** Show landmark dots */
  showLandmarks: boolean;
  
  /** Skeleton line width in pixels */
  skeletonLineWidth: number;
  
  /** Landmark dot radius in pixels */
  landmarkRadius: number;
}
```

**Default Config:**
```typescript
const DEFAULT_POSE_CONFIG: PoseConfig = {
  minConfidence: 0.5,
  targetFPS: 30,
  enableSmoothing: true,
  smoothingFactor: 0.3,
  showSkeleton: true,
  showLandmarks: true,
  skeletonLineWidth: 3,
  landmarkRadius: 5,
};
```

---

### `KeypointName`

Enum of 17 body keypoint names.

```typescript
enum KeypointName {
  NOSE = 'nose',
  LEFT_EYE = 'left_eye',
  RIGHT_EYE = 'right_eye',
  LEFT_EAR = 'left_ear',
  RIGHT_EAR = 'right_ear',
  LEFT_SHOULDER = 'left_shoulder',
  RIGHT_SHOULDER = 'right_shoulder',
  LEFT_ELBOW = 'left_elbow',
  RIGHT_ELBOW = 'right_elbow',
  LEFT_WRIST = 'left_wrist',
  RIGHT_WRIST = 'right_wrist',
  LEFT_HIP = 'left_hip',
  RIGHT_HIP = 'right_hip',
  LEFT_KNEE = 'left_knee',
  RIGHT_KNEE = 'right_knee',
  LEFT_ANKLE = 'left_ankle',
  RIGHT_ANKLE = 'right_ankle',
}
```

**Usage:**
```typescript
import { KeypointName } from '../types/poseTypes';

const getLandmark = (landmarks: Landmark[], name: KeypointName) => {
  return landmarks.find(l => l.name === name);
};

const nose = getLandmark(landmarks, KeypointName.NOSE);
```

---

### `PoseFrameCallback`

Callback fired on each pose detection frame.

```typescript
type PoseFrameCallback = (poseData: PoseData) => void;
```

**Example:**
```typescript
const handlePoseFrame: PoseFrameCallback = (poseData) => {
  console.log(`Detected with ${poseData.confidence * 100}% confidence`);
  console.log(`Left elbow angle: ${poseData.angles.leftElbow}°`);
};
```

---

### `PoseErrorCallback`

Error handler for pose detection failures.

```typescript
type PoseErrorCallback = (error: Error) => void;
```

**Example:**
```typescript
const handleError: PoseErrorCallback = (error) => {
  if (error.message.includes('CAMERA')) {
    Alert.alert('Camera Error', 'Please grant camera permission');
  }
};
```

---

## Components

### `PoseCamera`

Main camera component with integrated pose detection.

```typescript
interface PoseCameraProps {
  onPoseFrame?: PoseFrameCallback;
  onError?: PoseErrorCallback;
  config?: Partial<PoseConfig>;
  facing?: 'front' | 'back';
  useMockDetection?: boolean;
  style?: StyleProp<ViewStyle>;
}
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onPoseFrame` | `PoseFrameCallback` | `undefined` | Called on each detection |
| `onError` | `PoseErrorCallback` | `undefined` | Error handler |
| `config` | `Partial<PoseConfig>` | `DEFAULT_POSE_CONFIG` | Detection config |
| `facing` | `'front' \| 'back'` | `'front'` | Camera direction |
| `useMockDetection` | `boolean` | `true` | Use mock data (for Expo Go) |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Component style |

**Example:**
```tsx
<PoseCamera
  facing="front"
  useMockDetection={false}
  onPoseFrame={(poseData) => {
    console.log('Pose detected:', poseData);
  }}
  onError={(error) => {
    console.error('Error:', error);
  }}
  config={{
    minConfidence: 0.6,
    targetFPS: 30,
    enableSmoothing: true,
  }}
  style={{ flex: 1 }}
/>
```

---

### `SkeletonOverlay`

Renders skeleton lines and landmark dots over camera view.

```typescript
interface SkeletonOverlayProps {
  landmarks: Landmark[];
  width: number;
  height: number;
  config?: Partial<PoseConfig>;
  style?: StyleProp<ViewStyle>;
}
```

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `landmarks` | `Landmark[]` | ✅ | Array of detected landmarks |
| `width` | `number` | ✅ | Canvas width in pixels |
| `height` | `number` | ✅ | Canvas height in pixels |
| `config` | `Partial<PoseConfig>` | ❌ | Rendering config |
| `style` | `StyleProp<ViewStyle>` | ❌ | Component style |

**Example:**
```tsx
<SkeletonOverlay
  landmarks={poseData.landmarks}
  width={640}
  height={480}
  config={{
    minConfidence: 0.5,
    skeletonLineWidth: 4,
    landmarkRadius: 6,
  }}
  style={{ position: 'absolute' }}
/>
```

---

### `SimpleSkeletonOverlay`

Performance-optimized skeleton overlay using Path batching.

Same props as `SkeletonOverlay`.

**When to use:**
- Lower-end devices
- Need higher FPS
- Simplified rendering acceptable

**Example:**
```tsx
<SimpleSkeletonOverlay
  landmarks={poseData.landmarks}
  width={640}
  height={480}
/>
```

---

## Utilities

### `calculateAngle()`

Calculate angle formed by three 3D points.

```typescript
function calculateAngle(
  p1: { x: number; y: number; z: number },
  p2: { x: number; y: number; z: number },
  p3: { x: number; y: number; z: number }
): number
```

**Parameters:**
- `p1`: First point (e.g., shoulder)
- `p2`: Vertex point (e.g., elbow)
- `p3`: Third point (e.g., wrist)

**Returns:** Angle in degrees (0-180)

**Example:**
```typescript
import { calculateAngle } from '../utils/poseProcessing';

const elbowAngle = calculateAngle(
  { x: 0.4, y: 0.3, z: 0.5 },  // Shoulder
  { x: 0.35, y: 0.5, z: 0.5 }, // Elbow
  { x: 0.3, y: 0.7, z: 0.5 }   // Wrist
);
console.log(`Elbow bend: ${elbowAngle.toFixed(1)}°`); // e.g., "145.2°"
```

---

### `calculateJointAngles()`

Calculate all 14 joint angles from landmarks.

```typescript
function calculateJointAngles(landmarks: Landmark[]): JointAngles
```

**Parameters:**
- `landmarks`: Array of 17 detected landmarks

**Returns:** `JointAngles` object with 14 angle values

**Example:**
```typescript
import { calculateJointAngles } from '../utils/poseProcessing';

const angles = calculateJointAngles(poseData.landmarks);
console.log(`Left knee: ${angles.leftKnee}°`);
console.log(`Right elbow: ${angles.rightElbow}°`);
```

---

### `applySmoothing()`

Apply temporal smoothing to reduce landmark jitter.

```typescript
function applySmoothing(
  landmarks: Landmark[],
  config: PoseConfig
): Landmark[]
```

**Parameters:**
- `landmarks`: Raw detected landmarks
- `config`: Configuration with `smoothingFactor`

**Returns:** Smoothed landmarks

**Example:**
```typescript
import { applySmoothing } from '../utils/poseProcessing';

const smoothed = applySmoothing(rawLandmarks, {
  enableSmoothing: true,
  smoothingFactor: 0.3, // 0 = no smoothing, 1 = max smoothing
});
```

---

### `LandmarkSmoother`

Class for managing temporal smoothing state.

```typescript
class LandmarkSmoother {
  constructor(alpha?: number)
  smooth(landmarks: Landmark[]): Landmark[]
  reset(): void
}
```

**Parameters:**
- `alpha`: Smoothing factor (0-1), default 0.3

**Methods:**
- `smooth(landmarks)`: Apply exponential moving average
- `reset()`: Clear smoothing history

**Example:**
```typescript
import { LandmarkSmoother } from '../utils/poseProcessing';

const smoother = new LandmarkSmoother(0.3);

// In frame loop:
const smoothed = smoother.smooth(rawLandmarks);

// Reset when session ends:
smoother.reset();
```

---

### `comparePoseAngles()`

Compare two poses and return similarity score.

```typescript
function comparePoseAngles(
  detectedAngles: JointAngles,
  referenceAngles: Partial<JointAngles>,
  toleranceDegrees?: number
): number
```

**Parameters:**
- `detectedAngles`: User's current pose angles
- `referenceAngles`: Ideal pose angles
- `toleranceDegrees`: Acceptable deviation (default 15°)

**Returns:** Similarity score (0-100)

**Example:**
```typescript
import { comparePoseAngles } from '../utils/poseProcessing';

const treePose = {
  leftKnee: 90,
  rightKnee: 180,
  leftHip: 90,
  rightHip: 180,
};

const similarity = comparePoseAngles(
  userAngles,
  treePose,
  20 // 20° tolerance
);

console.log(`Accuracy: ${similarity}%`); // e.g., "87%"
```

---

### `generatePoseFeedback()`

Generate correction suggestions for pose alignment.

```typescript
function generatePoseFeedback(
  detectedAngles: JointAngles,
  referenceAngles: Partial<JointAngles>,
  toleranceDegrees?: number
): string[]
```

**Parameters:**
- `detectedAngles`: User's current pose angles
- `referenceAngles`: Ideal pose angles
- `toleranceDegrees`: Threshold for feedback (default 15°)

**Returns:** Array of correction strings

**Example:**
```typescript
import { generatePoseFeedback } from '../utils/poseProcessing';

const feedback = generatePoseFeedback(userAngles, idealPose, 15);

feedback.forEach(suggestion => {
  console.log(`• ${suggestion}`);
});
// Output:
// • Bend your left elbow more
// • Straighten your right knee
```

---

### `calculatePoseConfidence()`

Calculate average confidence across all visible landmarks.

```typescript
function calculatePoseConfidence(landmarks: Landmark[]): number
```

**Parameters:**
- `landmarks`: Array of detected landmarks

**Returns:** Average confidence (0-1)

**Example:**
```typescript
import { calculatePoseConfidence } from '../utils/poseProcessing';

const confidence = calculatePoseConfidence(landmarks);
console.log(`Pose confidence: ${(confidence * 100).toFixed(0)}%`);
```

---

### `isPersonFullyVisible()`

Check if enough critical landmarks are visible.

```typescript
function isPersonFullyVisible(landmarks: Landmark[]): boolean
```

**Parameters:**
- `landmarks`: Array of detected landmarks

**Returns:** `true` if ≥70% of critical points visible

**Example:**
```typescript
import { isPersonFullyVisible } from '../utils/poseProcessing';

if (isPersonFullyVisible(landmarks)) {
  // Person is in frame, proceed with detection
} else {
  // Prompt user to move into frame
}
```

---

### `preparePoseDataForExport()`

Format pose data for backend export.

```typescript
function preparePoseDataForExport(
  poseData: PoseData,
  sessionId: string
): object
```

**Parameters:**
- `poseData`: Pose detection result
- `sessionId`: Session identifier

**Returns:** Backend-ready JSON object

**Example:**
```typescript
import { preparePoseDataForExport } from '../utils/poseProcessing';

const exportData = preparePoseDataForExport(poseData, 'session-123');

// Send to backend
fetch('/api/poses', {
  method: 'POST',
  body: JSON.stringify(exportData),
});
```

---

## Constants

### `POSE_CONNECTIONS`

Array of 15 skeleton connections with colors.

```typescript
const POSE_CONNECTIONS: SkeletonConnection[] = [
  // Face
  { from: 'nose', to: 'left_eye', color: '#9B59B6' },
  { from: 'nose', to: 'right_eye', color: '#9B59B6' },
  // ... 13 more connections
];
```

**Usage:**
```typescript
import { POSE_CONNECTIONS } from '../types/poseTypes';

POSE_CONNECTIONS.forEach(connection => {
  console.log(`${connection.from} → ${connection.to}: ${connection.color}`);
});
```

---

### `DEFAULT_POSE_CONFIG`

Default configuration object.

```typescript
const DEFAULT_POSE_CONFIG: PoseConfig = {
  minConfidence: 0.5,
  targetFPS: 30,
  enableSmoothing: true,
  smoothingFactor: 0.3,
  showSkeleton: true,
  showLandmarks: true,
  skeletonLineWidth: 3,
  landmarkRadius: 5,
};
```

**Usage:**
```typescript
import { DEFAULT_POSE_CONFIG } from '../types/poseTypes';

const myConfig = {
  ...DEFAULT_POSE_CONFIG,
  targetFPS: 15, // Override specific properties
};
```

---

## Common Patterns

### Pattern 1: Basic Pose Detection

```typescript
const MyComponent = () => {
  const handlePose = (poseData: PoseData) => {
    if (!poseData.isPersonDetected) return;
    
    console.log('Landmarks:', poseData.landmarks.length);
    console.log('Confidence:', poseData.confidence);
  };

  return <PoseCamera onPoseFrame={handlePose} />;
};
```

### Pattern 2: Pose Comparison with Feedback

```typescript
const YogaSession = () => {
  const [feedback, setFeedback] = useState<string[]>([]);
  
  const handlePose = (poseData: PoseData) => {
    const score = comparePoseAngles(
      poseData.angles,
      TREE_POSE_REFERENCE,
      15
    );
    
    if (score < 80) {
      const suggestions = generatePoseFeedback(
        poseData.angles,
        TREE_POSE_REFERENCE
      );
      setFeedback(suggestions);
    }
  };

  return (
    <>
      <PoseCamera onPoseFrame={handlePose} />
      {feedback.map((item, i) => (
        <Text key={i}>{item}</Text>
      ))}
    </>
  );
};
```

### Pattern 3: Export Pose Data

```typescript
const handlePose = (poseData: PoseData) => {
  const exportData = preparePoseDataForExport(poseData, sessionId);
  
  // Throttle exports (e.g., every 30 frames)
  if (poseData.frameNumber % 30 === 0) {
    saveToBackend(exportData);
  }
};
```

---

## TypeScript Tips

### Type Guards

```typescript
const isValidLandmark = (landmark: Landmark): boolean => {
  return (
    landmark.confidence >= 0.5 &&
    landmark.isVisible &&
    landmark.x >= 0 && landmark.x <= 1 &&
    landmark.y >= 0 && landmark.y <= 1
  );
};
```

### Partial Angles

```typescript
// Define only relevant angles for specific poses
const warriorPose: Partial<JointAngles> = {
  leftKnee: 90,
  rightKnee: 180,
  leftHip: 90,
  // Other angles not needed
};
```

---

## Version

**API Version:** 1.0.0  
**Last Updated:** January 2025  
**Compatibility:** React Native 0.73+, Expo SDK 50+
