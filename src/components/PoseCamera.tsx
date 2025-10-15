/**
 * PoseCamera Component
 * 
 * Integrated camera + pose detection + skeleton overlay
 * 
 * NOTE: Full pose detection requires a development build (not Expo Go).
 * This component provides mock mode for testing in Expo Go and real detection
 * structure for production builds.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { SkeletonOverlay } from './SkeletonOverlay';
import type {
  Landmark,
  PoseData,
  PoseFrameCallback,
  PoseErrorCallback,
  PoseConfig,
  KeypointName,
} from '../types/poseTypes';
import { DEFAULT_POSE_CONFIG } from '../types/poseTypes';
import {
  calculateJointAngles,
  applySmoothing,
  calculatePoseConfidence,
  isPersonFullyVisible,
} from '../utils/poseProcessing';

interface PoseCameraProps {
  /** Callback fired on each frame with pose data */
  onPoseFrame?: PoseFrameCallback;
  
  /** Error callback */
  onError?: PoseErrorCallback;
  
  /** Pose detection configuration */
  config?: Partial<PoseConfig>;
  
  /** Camera facing direction */
  facing?: 'front' | 'back';
  
  /** Whether to use mock detection (for Expo Go testing) */
  useMockDetection?: boolean;
  
  /** Component style */
  style?: any;
}

/**
 * Main PoseCamera component
 */
export const PoseCamera: React.FC<PoseCameraProps> = ({
  onPoseFrame,
  onError,
  config: userConfig,
  facing = 'front',
  useMockDetection = true, // Default to mock for Expo Go compatibility
  style,
}) => {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [cameraSize, setCameraSize] = useState({ width: 0, height: 0 });
  const frameCountRef = useRef(0);
  
  const config: PoseConfig = { ...DEFAULT_POSE_CONFIG, ...userConfig };
  const device = useCameraDevice(facing);
  const { hasPermission, requestPermission } = useCameraPermission();

  // Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  // Mock pose detection (for Expo Go testing)
  useEffect(() => {
    if (!useMockDetection) return;

    const interval = setInterval(() => {
      const mockLandmarks = generateMockLandmarks();
      setLandmarks(mockLandmarks);

      if (onPoseFrame) {
        const poseData = createPoseData(mockLandmarks, config);
        onPoseFrame(poseData);
      }
    }, 1000 / config.targetFPS);

    return () => clearInterval(interval);
  }, [useMockDetection, config, onPoseFrame]);

  /**
   * Frame processor (runs on worklet thread)
   * 
   * NOTE: This requires Vision Camera v3 with frame processor plugin.
   * Won't work in Expo Go - needs development build with native modules.
   * 
   * For production:
   * 1. Create development build
   * 2. Install vision-camera-pose-detection plugin (or custom)
   * 3. Uncomment and configure below
   */
  
  /* 
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    
    try {
      // Call native pose detection module
      // const poses = detectPose(frame);
      
      // Convert to Landmark array
      // const landmarks = convertToLandmarks(poses);
      
      // Apply smoothing
      // const smoothed = applySmoothing(landmarks, config);
      
      // Calculate angles
      // const angles = calculateJointAngles(smoothed);
      
      // Create pose data
      // const poseData: PoseData = {
      //   landmarks: smoothed,
      //   angles,
      //   confidence: calculatePoseConfidence(smoothed),
      //   timestamp: Date.now(),
      //   frameNumber: frameCountRef.current++,
      //   isPersonDetected: isPersonFullyVisible(smoothed),
      // };
      
      // Update UI (via runOnJS)
      // runOnJS(setLandmarks)(smoothed);
      // runOnJS(onPoseFrame)?.(poseData);
    } catch (error) {
      // runOnJS(onError)?.(error);
    }
  }, [config, onPoseFrame, onError]);
  */

  const handleLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setCameraSize({ width, height });
  }, []);

  if (!hasPermission) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.permissionText}>
          Camera permission required for pose detection
        </Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>Camera device not available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} onLayout={handleLayout}>
      {/* Camera View */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        // frameProcessor={frameProcessor} // Uncomment for production
      />

      {/* Skeleton Overlay */}
      {landmarks.length > 0 && cameraSize.width > 0 && (
        <SkeletonOverlay
          landmarks={landmarks}
          width={cameraSize.width}
          height={cameraSize.height}
          config={config}
        />
      )}

      {/* Mock mode indicator */}
      {useMockDetection && (
        <View style={styles.mockIndicator}>
          <Text style={styles.mockText}>🎲 Mock Mode</Text>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate mock landmarks for testing
 */
function generateMockLandmarks(): Landmark[] {
  const baseKeypoints = [
    'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
    'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
    'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
    'left_knee', 'right_knee', 'left_ankle', 'right_ankle',
  ];

  // Simulated person standing in center of frame
  const landmarks: Landmark[] = [];
  
  baseKeypoints.forEach((name, index) => {
    // Create rough humanoid position
    let x = 0.5; // Center
    let y = 0.15 + (index / baseKeypoints.length) * 0.7; // Top to bottom
    
    // Add horizontal offset for left/right
    if (name.includes('left')) x = 0.4;
    if (name.includes('right')) x = 0.6;
    
    // Add slight random jitter
    x += (Math.random() - 0.5) * 0.05;
    y += (Math.random() - 0.5) * 0.05;

    landmarks.push({
      name,
      x,
      y,
      z: 0.5,
      confidence: 0.7 + Math.random() * 0.3,
      isVisible: Math.random() > 0.1, // 90% visible
    });
  });

  return landmarks;
}

/**
 * Create PoseData object from landmarks
 */
function createPoseData(landmarks: Landmark[], config: PoseConfig): PoseData {
  const smoothedLandmarks = config.enableSmoothing 
    ? applySmoothing(landmarks, config) 
    : landmarks;
  const angles = calculateJointAngles(smoothedLandmarks);
  const confidence = calculatePoseConfidence(smoothedLandmarks);
  const isPersonDetected = isPersonFullyVisible(smoothedLandmarks);

  return {
    landmarks: smoothedLandmarks,
    angles,
    confidence,
    timestamp: Date.now(),
    frameNumber: Math.floor(Math.random() * 1000),
    isPersonDetected,
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  mockIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 193, 7, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  mockText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PoseCamera;
