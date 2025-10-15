/**
 * Pose Detection Type Definitions
 * 
 * Defines all interfaces and types for pose estimation,
 * landmark detection, and skeletal rendering
 */

// ============================================================================
// CORE POSE TYPES
// ============================================================================

/**
 * Single body landmark/keypoint detected by the pose model
 */
export interface Landmark {
  /** Keypoint name (e.g., 'nose', 'left_shoulder', 'right_elbow') */
  name: string;
  
  /** Horizontal position (0-1 normalized, or pixels depending on config) */
  x: number;
  
  /** Vertical position (0-1 normalized, or pixels depending on config) */
  y: number;
  
  /** Depth/distance from camera (optional, 0-1 normalized) */
  z?: number;
  
  /** Confidence score for this keypoint (0-1) */
  confidence: number;
  
  /** Whether this keypoint is visible in the frame */
  isVisible: boolean;
}

/**
 * Complete pose data for a single frame
 */
export interface PoseData {
  /** All detected landmarks */
  landmarks: Landmark[];
  
  /** Computed joint angles */
  angles: JointAngles;
  
  /** Overall pose confidence score */
  confidence: number;
  
  /** Timestamp of detection (ms) */
  timestamp: number;
  
  /** Frame number */
  frameNumber: number;
  
  /** Whether a person is detected */
  isPersonDetected: boolean;
}

// ============================================================================
// JOINT ANGLES
// ============================================================================

/**
 * Computed angles for major body joints
 */
export interface JointAngles {
  // Upper body
  leftShoulder?: number;
  rightShoulder?: number;
  leftElbow?: number;
  rightElbow?: number;
  leftWrist?: number;
  rightWrist?: number;
  
  // Core
  leftHip?: number;
  rightHip?: number;
  spine?: number;
  
  // Lower body
  leftKnee?: number;
  rightKnee?: number;
  leftAnkle?: number;
  rightAnkle?: number;
  
  // Additional angles
  neck?: number;
  leftArmpit?: number;
  rightArmpit?: number;
}

// ============================================================================
// SKELETON CONNECTIONS
// ============================================================================

/**
 * Defines which keypoints connect to form the skeleton
 */
export interface SkeletonConnection {
  from: string;
  to: string;
  color?: string;
}

/**
 * Standard skeleton connection pairs for drawing
 */
export const POSE_CONNECTIONS: SkeletonConnection[] = [
  // Face
  { from: 'nose', to: 'left_eye', color: '#FF6B6B' },
  { from: 'nose', to: 'right_eye', color: '#FF6B6B' },
  { from: 'left_eye', to: 'left_ear', color: '#FF6B6B' },
  { from: 'right_eye', to: 'right_ear', color: '#FF6B6B' },
  
  // Torso
  { from: 'left_shoulder', to: 'right_shoulder', color: '#4ECDC4' },
  { from: 'left_shoulder', to: 'left_hip', color: '#4ECDC4' },
  { from: 'right_shoulder', to: 'right_hip', color: '#4ECDC4' },
  { from: 'left_hip', to: 'right_hip', color: '#4ECDC4' },
  
  // Left arm
  { from: 'left_shoulder', to: 'left_elbow', color: '#95E1D3' },
  { from: 'left_elbow', to: 'left_wrist', color: '#95E1D3' },
  
  // Right arm
  { from: 'right_shoulder', to: 'right_elbow', color: '#F38181' },
  { from: 'right_elbow', to: 'right_wrist', color: '#F38181' },
  
  // Left leg
  { from: 'left_hip', to: 'left_knee', color: '#AA96DA' },
  { from: 'left_knee', to: 'left_ankle', color: '#AA96DA' },
  
  // Right leg
  { from: 'right_hip', to: 'right_knee', color: '#FCBAD3' },
  { from: 'right_knee', to: 'right_ankle', color: '#FCBAD3' },
];

// ============================================================================
// KEYPOINT NAMES (MoveNet/PoseNet standard)
// ============================================================================

export enum KeypointName {
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

// ============================================================================
// CALLBACKS & HANDLERS
// ============================================================================

/**
 * Callback fired on each frame with detected pose data
 */
export type PoseFrameCallback = (poseData: PoseData) => void;

/**
 * Error callback for pose detection failures
 */
export type PoseErrorCallback = (error: PoseError) => void;

/**
 * Pose detection error types
 */
export interface PoseError {
  code: PoseErrorCode;
  message: string;
  timestamp: number;
}

export enum PoseErrorCode {
  MODEL_NOT_LOADED = 'MODEL_NOT_LOADED',
  CAMERA_ERROR = 'CAMERA_ERROR',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  NO_PERSON_DETECTED = 'NO_PERSON_DETECTED',
  LOW_CONFIDENCE = 'LOW_CONFIDENCE',
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Configuration for pose detection
 */
export interface PoseConfig {
  /** Minimum confidence threshold (0-1) */
  minConfidence: number;
  
  /** Target frames per second for processing */
  targetFPS: number;
  
  /** Enable smoothing/filtering */
  enableSmoothing: boolean;
  
  /** Smoothing factor (0-1, higher = more smoothing) */
  smoothingFactor: number;
  
  /** Enable skeleton overlay */
  showSkeleton: boolean;
  
  /** Enable landmark dots */
  showLandmarks: boolean;
  
  /** Skeleton line width */
  skeletonLineWidth: number;
  
  /** Landmark circle radius */
  landmarkRadius: number;
}

/**
 * Default pose configuration
 */
export const DEFAULT_POSE_CONFIG: PoseConfig = {
  minConfidence: 0.5,
  targetFPS: 30,
  enableSmoothing: true,
  smoothingFactor: 0.5,
  showSkeleton: true,
  showLandmarks: true,
  skeletonLineWidth: 3,
  landmarkRadius: 5,
};

// ============================================================================
// SESSION DATA
// ============================================================================

/**
 * Accumulated pose session data for analysis
 */
export interface PoseSession {
  /** Unique session ID */
  sessionId: string;
  
  /** Start timestamp */
  startTime: number;
  
  /** End timestamp */
  endTime?: number;
  
  /** All captured pose frames */
  frames: PoseData[];
  
  /** Session statistics */
  stats: SessionStats;
  
  /** Target pose name (if doing specific pose) */
  targetPose?: string;
}

/**
 * Statistical summary of a pose session
 */
export interface SessionStats {
  /** Total frames captured */
  totalFrames: number;
  
  /** Frames with person detected */
  framesWithPerson: number;
  
  /** Average confidence */
  avgConfidence: number;
  
  /** Average angles over session */
  avgAngles: Partial<JointAngles>;
  
  /** Session duration (ms) */
  duration: number;
  
  /** Frames per second achieved */
  avgFPS: number;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Format for exporting pose data to backend
 */
export interface PoseDataExport {
  sessionId: string;
  timestamp: number;
  landmarks: Array<{
    name: string;
    x: number;
    y: number;
    z?: number;
    confidence: number;
  }>;
  angles: Record<string, number>;
  metadata: {
    frameNumber: number;
    confidence: number;
    deviceInfo?: string;
  };
}
