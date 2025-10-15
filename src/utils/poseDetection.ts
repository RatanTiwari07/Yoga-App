import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';

let detector: poseDetection.PoseDetector | null = null;

// Initialize pose detector
export const initPoseDetector = async () => {
  try {
    // Wait for TensorFlow to be ready
    await tf.ready();
    
    // Create detector with MoveNet model (works well on mobile)
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
    };
    
    detector = await poseDetection.createDetector(model, detectorConfig);
    console.log('Pose detector initialized successfully');
    return detector;
  } catch (error) {
    console.error('Error initializing pose detector:', error);
    return null;
  }
};

// Detect poses from image
export const detectPose = async (imageData: any) => {
  if (!detector) {
    console.warn('Detector not initialized');
    return null;
  }

  try {
    const poses = await detector.estimatePoses(imageData);
    return poses;
  } catch (error) {
    console.error('Error detecting pose:', error);
    return null;
  }
};

// Calculate pose accuracy based on keypoints confidence
export const calculatePoseAccuracy = (poses: any[]) => {
  if (!poses || poses.length === 0) {
    return 0;
  }

  const pose = poses[0];
  if (!pose.keypoints) {
    return 0;
  }

  // Calculate average confidence of all keypoints
  const totalConfidence = pose.keypoints.reduce(
    (sum: number, kp: any) => sum + (kp.score || 0),
    0
  );
  
  const avgConfidence = totalConfidence / pose.keypoints.length;
  
  // Convert to percentage (0-100)
  return Math.round(avgConfidence * 100);
};

// Check if specific pose is detected (basic implementation)
export const checkPoseAlignment = (poses: any[], targetPose: string) => {
  if (!poses || poses.length === 0) {
    return {
      isCorrect: false,
      accuracy: 0,
      feedback: 'No pose detected',
    };
  }

  const pose = poses[0];
  const accuracy = calculatePoseAccuracy(poses);
  
  // Basic feedback based on accuracy
  let feedback = '';
  let isCorrect = false;

  if (accuracy >= 90) {
    feedback = 'Perfect form! Excellent!';
    isCorrect = true;
  } else if (accuracy >= 80) {
    feedback = 'Good posture!';
    isCorrect = true;
  } else if (accuracy >= 70) {
    feedback = 'Almost there, slight adjustment needed';
    isCorrect = false;
  } else if (accuracy >= 60) {
    feedback = 'Adjust your position';
    isCorrect = false;
  } else {
    feedback = 'Position yourself in frame';
    isCorrect = false;
  }

  return {
    isCorrect,
    accuracy,
    feedback,
    keypoints: pose.keypoints,
  };
};

// Get keypoint by name
export const getKeypoint = (keypoints: any[], name: string) => {
  return keypoints.find((kp) => kp.name === name);
};

// Calculate angle between three points (useful for pose validation)
export const calculateAngle = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
  point3: { x: number; y: number }
) => {
  const radians =
    Math.atan2(point3.y - point2.y, point3.x - point2.x) -
    Math.atan2(point1.y - point2.y, point1.x - point2.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  
  if (angle > 180) {
    angle = 360 - angle;
  }
  
  return angle;
};

export default {
  initPoseDetector,
  detectPose,
  calculatePoseAccuracy,
  checkPoseAlignment,
  getKeypoint,
  calculateAngle,
};
