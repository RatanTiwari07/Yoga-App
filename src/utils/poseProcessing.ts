/**
 * Pose Processing Engine
 * 
 * Core logic for:
 * - Calculating joint angles from landmarks
 * - Smoothing/filtering landmark data
 * - Analyzing pose quality
 * - Comparing against reference poses
 */

import type {
  Landmark,
  JointAngles,
  PoseData,
  PoseConfig,
} from '../types/poseTypes';

import { KeypointName } from '../types/poseTypes';

// ============================================================================
// GEOMETRIC CALCULATIONS
// ============================================================================

/**
 * Calculate angle between three points (in degrees)
 * @param p1 First point (e.g., shoulder)
 * @param p2 Middle point/vertex (e.g., elbow)
 * @param p3 Third point (e.g., wrist)
 * @returns Angle in degrees (0-180)
 */
export function calculateAngle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
): number {
  const radians =
    Math.atan2(p3.y - p2.y, p3.x - p2.x) -
    Math.atan2(p1.y - p2.y, p1.x - p2.x);
    
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return Math.round(angle);
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Normalize coordinates to 0-1 range based on frame dimensions
 */
export function normalizeCoordinates(
  x: number,
  y: number,
  frameWidth: number,
  frameHeight: number
): { x: number; y: number } {
  return {
    x: x / frameWidth,
    y: y / frameHeight,
  };
}

// ============================================================================
// JOINT ANGLE CALCULATIONS
// ============================================================================

/**
 * Calculate all major joint angles from landmarks
 */
export function calculateJointAngles(landmarks: Landmark[]): JointAngles {
  const angles: JointAngles = {};
  
  // Helper to find landmark by name
  const getLandmark = (name: string): Landmark | undefined =>
    landmarks.find(l => l.name === name && l.isVisible && l.confidence > 0.5);
  
  // Left elbow angle
  const leftShoulder = getLandmark(KeypointName.LEFT_SHOULDER);
  const leftElbow = getLandmark(KeypointName.LEFT_ELBOW);
  const leftWrist = getLandmark(KeypointName.LEFT_WRIST);
  
  if (leftShoulder && leftElbow && leftWrist) {
    angles.leftElbow = calculateAngle(leftShoulder, leftElbow, leftWrist);
  }
  
  // Right elbow angle
  const rightShoulder = getLandmark(KeypointName.RIGHT_SHOULDER);
  const rightElbow = getLandmark(KeypointName.RIGHT_ELBOW);
  const rightWrist = getLandmark(KeypointName.RIGHT_WRIST);
  
  if (rightShoulder && rightElbow && rightWrist) {
    angles.rightElbow = calculateAngle(rightShoulder, rightElbow, rightWrist);
  }
  
  // Left shoulder angle
  const leftHip = getLandmark(KeypointName.LEFT_HIP);
  
  if (leftElbow && leftShoulder && leftHip) {
    angles.leftShoulder = calculateAngle(leftElbow, leftShoulder, leftHip);
  }
  
  // Right shoulder angle
  const rightHip = getLandmark(KeypointName.RIGHT_HIP);
  
  if (rightElbow && rightShoulder && rightHip) {
    angles.rightShoulder = calculateAngle(rightElbow, rightShoulder, rightHip);
  }
  
  // Left knee angle
  const leftKnee = getLandmark(KeypointName.LEFT_KNEE);
  const leftAnkle = getLandmark(KeypointName.LEFT_ANKLE);
  
  if (leftHip && leftKnee && leftAnkle) {
    angles.leftKnee = calculateAngle(leftHip, leftKnee, leftAnkle);
  }
  
  // Right knee angle
  const rightKnee = getLandmark(KeypointName.RIGHT_KNEE);
  const rightAnkle = getLandmark(KeypointName.RIGHT_ANKLE);
  
  if (rightHip && rightKnee && rightAnkle) {
    angles.rightKnee = calculateAngle(rightHip, rightKnee, rightAnkle);
  }
  
  // Left hip angle
  if (leftShoulder && leftHip && leftKnee) {
    angles.leftHip = calculateAngle(leftShoulder, leftHip, leftKnee);
  }
  
  // Right hip angle
  if (rightShoulder && rightHip && rightKnee) {
    angles.rightHip = calculateAngle(rightShoulder, rightHip, rightKnee);
  }
  
  // Spine angle (approximation using shoulders and hips)
  if (leftShoulder && rightShoulder && leftHip && rightHip) {
    const shoulderMid = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2,
    };
    const hipMid = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2,
    };
    
    // Calculate spine angle relative to vertical
    const verticalRef = { x: shoulderMid.x, y: 0 };
    angles.spine = calculateAngle(verticalRef, shoulderMid, hipMid);
  }
  
  return angles;
}

// ============================================================================
// SMOOTHING & FILTERING
// ============================================================================

/**
 * Exponential moving average for landmark smoothing
 */
class LandmarkSmoother {
  private previousLandmarks: Map<string, Landmark> = new Map();
  private alpha: number; // Smoothing factor (0-1)
  
  constructor(alpha: number = 0.5) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }
  
  /**
   * Apply exponential smoothing to landmarks
   */
  smooth(currentLandmarks: Landmark[]): Landmark[] {
    const smoothed: Landmark[] = [];
    
    for (const current of currentLandmarks) {
      const previous = this.previousLandmarks.get(current.name);
      
      if (!previous) {
        // First occurrence, no smoothing
        smoothed.push({ ...current });
        this.previousLandmarks.set(current.name, { ...current });
        continue;
      }
      
      // Apply exponential moving average
      const smoothedLandmark: Landmark = {
        ...current,
        x: this.alpha * current.x + (1 - this.alpha) * previous.x,
        y: this.alpha * current.y + (1 - this.alpha) * previous.y,
        z: current.z !== undefined && previous.z !== undefined
          ? this.alpha * current.z + (1 - this.alpha) * previous.z
          : current.z,
      };
      
      smoothed.push(smoothedLandmark);
      this.previousLandmarks.set(current.name, smoothedLandmark);
    }
    
    return smoothed;
  }
  
  /**
   * Reset smoother state
   */
  reset(): void {
    this.previousLandmarks.clear();
  }
}

// Singleton instance
let smootherInstance: LandmarkSmoother | null = null;
let currentAlpha: number = 0.5;

export function getSmoother(alpha: number = 0.5): LandmarkSmoother {
  if (!smootherInstance || currentAlpha !== alpha) {
    smootherInstance = new LandmarkSmoother(alpha);
    currentAlpha = alpha;
  }
  return smootherInstance;
}

/**
 * Apply smoothing to landmarks if enabled
 */
export function applySmoothing(
  landmarks: Landmark[],
  config: PoseConfig
): Landmark[] {
  if (!config.enableSmoothing) {
    return landmarks;
  }
  
  const smoother = getSmoother(config.smoothingFactor);
  return smoother.smooth(landmarks);
}

// ============================================================================
// POSE QUALITY ANALYSIS
// ============================================================================

/**
 * Calculate overall pose confidence from landmarks
 */
export function calculatePoseConfidence(landmarks: Landmark[]): number {
  if (landmarks.length === 0) return 0;
  
  const visibleLandmarks = landmarks.filter(l => l.isVisible);
  if (visibleLandmarks.length === 0) return 0;
  
  const totalConfidence = visibleLandmarks.reduce(
    (sum, l) => sum + l.confidence,
    0
  );
  
  return totalConfidence / visibleLandmarks.length;
}

/**
 * Check if person is fully visible in frame
 */
export function isPersonFullyVisible(landmarks: Landmark[]): boolean {
  const criticalPoints = [
    KeypointName.NOSE,
    KeypointName.LEFT_SHOULDER,
    KeypointName.RIGHT_SHOULDER,
    KeypointName.LEFT_HIP,
    KeypointName.RIGHT_HIP,
    KeypointName.LEFT_KNEE,
    KeypointName.RIGHT_KNEE,
  ];
  
  const visibleCriticalPoints = landmarks.filter(
    l => criticalPoints.includes(l.name as KeypointName) && l.isVisible && l.confidence > 0.5
  );
  
  return visibleCriticalPoints.length >= criticalPoints.length * 0.7; // 70% threshold
}

/**
 * Check if specific body part is visible
 */
export function isBodyPartVisible(
  landmarks: Landmark[],
  bodyPart: 'head' | 'torso' | 'arms' | 'legs'
): boolean {
  const bodyPartKeypoints: Record<string, KeypointName[]> = {
    head: [KeypointName.NOSE, KeypointName.LEFT_EYE, KeypointName.RIGHT_EYE],
    torso: [KeypointName.LEFT_SHOULDER, KeypointName.RIGHT_SHOULDER, KeypointName.LEFT_HIP, KeypointName.RIGHT_HIP],
    arms: [KeypointName.LEFT_ELBOW, KeypointName.RIGHT_ELBOW, KeypointName.LEFT_WRIST, KeypointName.RIGHT_WRIST],
    legs: [KeypointName.LEFT_KNEE, KeypointName.RIGHT_KNEE, KeypointName.LEFT_ANKLE, KeypointName.RIGHT_ANKLE],
  };
  
  const relevantPoints = bodyPartKeypoints[bodyPart] || [];
  const visiblePoints = landmarks.filter(
    l => relevantPoints.includes(l.name as KeypointName) && l.isVisible && l.confidence > 0.5
  );
  
  return visiblePoints.length >= relevantPoints.length * 0.5;
}

// ============================================================================
// POSE COMPARISON (for yoga pose validation)
// ============================================================================

/**
 * Compare detected angles with reference pose angles
 * Returns similarity score 0-100
 */
export function comparePoseAngles(
  detectedAngles: JointAngles,
  referenceAngles: JointAngles,
  tolerance: number = 15 // degrees
): number {
  const angleKeys = Object.keys(referenceAngles) as Array<keyof JointAngles>;
  let matchCount = 0;
  let totalCount = 0;
  
  for (const key of angleKeys) {
    const refAngle = referenceAngles[key];
    const detAngle = detectedAngles[key];
    
    if (refAngle === undefined) continue;
    
    totalCount++;
    
    if (detAngle === undefined) continue;
    
    const difference = Math.abs(refAngle - detAngle);
    
    if (difference <= tolerance) {
      matchCount++;
    } else {
      // Partial credit for close matches
      const partialCredit = Math.max(0, 1 - (difference - tolerance) / tolerance);
      matchCount += partialCredit;
    }
  }
  
  return totalCount > 0 ? Math.round((matchCount / totalCount) * 100) : 0;
}

/**
 * Generate feedback for pose correction
 */
export function generatePoseFeedback(
  detectedAngles: JointAngles,
  referenceAngles: JointAngles,
  tolerance: number = 15
): string[] {
  const feedback: string[] = [];
  const angleKeys = Object.keys(referenceAngles) as Array<keyof JointAngles>;
  
  for (const key of angleKeys) {
    const refAngle = referenceAngles[key];
    const detAngle = detectedAngles[key];
    
    if (refAngle === undefined || detAngle === undefined) continue;
    
    const difference = detAngle - refAngle;
    
    if (Math.abs(difference) > tolerance) {
      const jointName = key.replace(/([A-Z])/g, ' $1').trim();
      
      if (difference > 0) {
        feedback.push(`${jointName}: Reduce angle by ~${Math.round(Math.abs(difference))}°`);
      } else {
        feedback.push(`${jointName}: Increase angle by ~${Math.round(Math.abs(difference))}°`);
      }
    }
  }
  
  return feedback;
}

// ============================================================================
// DATA EXPORT HELPERS
// ============================================================================

/**
 * Convert pose data to backend-ready format
 */
export function preparePoseDataForExport(poseData: PoseData, sessionId: string) {
  return {
    sessionId,
    timestamp: poseData.timestamp,
    landmarks: poseData.landmarks.map(l => ({
      name: l.name,
      x: l.x,
      y: l.y,
      z: l.z,
      confidence: l.confidence,
    })),
    angles: poseData.angles,
    metadata: {
      frameNumber: poseData.frameNumber,
      confidence: poseData.confidence,
    },
  };
}

/**
 * Batch export multiple frames
 */
export function batchExportPoseData(
  poseDataArray: PoseData[],
  sessionId: string
) {
  return poseDataArray.map(pd => preparePoseDataForExport(pd, sessionId));
}

export default {
  calculateAngle,
  calculateDistance,
  normalizeCoordinates,
  calculateJointAngles,
  applySmoothing,
  calculatePoseConfidence,
  isPersonFullyVisible,
  isBodyPartVisible,
  comparePoseAngles,
  generatePoseFeedback,
  preparePoseDataForExport,
  batchExportPoseData,
};
