/**
 * Skeleton Overlay Component
 * 
 * Renders pose landmarks and skeleton using React Native Skia
 * for high-performance overlay drawing on camera preview
 */

import React from 'react';
import { Canvas, Circle, Line, Paint, Path } from '@shopify/react-native-skia';
import type { Landmark, SkeletonConnection, PoseConfig } from '../types/poseTypes';
import { POSE_CONNECTIONS } from '../types/poseTypes';

interface SkeletonOverlayProps {
  /** Array of detected landmarks */
  landmarks: Landmark[];
  
  /** Frame dimensions */
  width: number;
  height: number;
  
  /** Pose configuration */
  config?: Partial<PoseConfig>;
  
  /** Style overrides */
  style?: any;
}

/**
 * SkeletonOverlay - Draws pose landmarks and skeleton connections
 */
export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  landmarks,
  width,
  height,
  config = {},
  style,
}) => {
  const {
    showSkeleton = true,
    showLandmarks = true,
    skeletonLineWidth = 3,
    landmarkRadius = 5,
    minConfidence = 0.5,
  } = config;

  // Filter visible landmarks
  const visibleLandmarks = landmarks.filter(
    l => l.isVisible && l.confidence >= minConfidence
  );

  // Helper to get landmark by name
  const getLandmark = (name: string): Landmark | undefined =>
    visibleLandmarks.find(l => l.name === name);

  // Convert normalized coordinates to pixel coordinates
  const toPixelCoords = (landmark: Landmark) => ({
    x: landmark.x * width,
    y: landmark.y * height,
  });

  return (
    <Canvas style={[{ width, height, position: 'absolute' }, style]}>
      {/* Draw skeleton lines */}
      {showSkeleton && POSE_CONNECTIONS.map((connection, index) => {
        const fromLandmark = getLandmark(connection.from);
        const toLandmark = getLandmark(connection.to);

        if (!fromLandmark || !toLandmark) return null;

        const from = toPixelCoords(fromLandmark);
        const to = toPixelCoords(toLandmark);

        // Calculate average confidence for line opacity
        const avgConfidence = (fromLandmark.confidence + toLandmark.confidence) / 2;
        const opacity = avgConfidence;

        return (
          <Line
            key={`line-${index}`}
            p1={{ x: from.x, y: from.y }}
            p2={{ x: to.x, y: to.y }}
            color={connection.color || '#4ECDC4'}
            style="stroke"
            strokeWidth={skeletonLineWidth}
            opacity={opacity}
          />
        );
      })}

      {/* Draw landmark points */}
      {showLandmarks && visibleLandmarks.map((landmark, index) => {
        const pos = toPixelCoords(landmark);
        const opacity = landmark.confidence;

        return (
          <React.Fragment key={`landmark-${index}`}>
            {/* Outer circle (border) */}
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={landmarkRadius + 1}
              color="#FFFFFF"
              opacity={opacity}
            />
            
            {/* Inner circle (fill) */}
            <Circle
              cx={pos.x}
              cy={pos.y}
              r={landmarkRadius}
              color="#4ECDC4"
              opacity={opacity}
            />
          </React.Fragment>
        );
      })}

      {/* Optional: Draw confidence indicator for each landmark */}
      {showLandmarks && visibleLandmarks.map((landmark, index) => {
        const pos = toPixelCoords(landmark);
        
        // Only show for major keypoints
        const isMajorKeypoint = ['nose', 'left_shoulder', 'right_shoulder', 'left_hip', 'right_hip']
          .includes(landmark.name);
        
        if (!isMajorKeypoint) return null;

        return (
          <Circle
            key={`confidence-${index}`}
            cx={pos.x}
            cy={pos.y}
            r={landmarkRadius * 2}
            color={landmark.confidence > 0.8 ? '#00FF00' : '#FFFF00'}
            opacity={0.2}
          />
        );
      })}
    </Canvas>
  );
};

/**
 * Simplified overlay for lower-end devices (canvas-based)
 */
export const SimpleSkeletonOverlay: React.FC<SkeletonOverlayProps> = ({
  landmarks,
  width,
  height,
  config = {},
}) => {
  const {
    showSkeleton = true,
    showLandmarks = true,
    minConfidence = 0.5,
  } = config;

  const visibleLandmarks = landmarks.filter(
    l => l.isVisible && l.confidence >= minConfidence
  );

  const getLandmark = (name: string): Landmark | undefined =>
    visibleLandmarks.find(l => l.name === name);

  return (
    <Canvas style={{ width, height, position: 'absolute' }}>
      {/* Use path for batch rendering (more performant) */}
      {showSkeleton && (
        <Path
          path={createSkeletonPath(visibleLandmarks, width, height, getLandmark)}
          color="#4ECDC4"
          style="stroke"
          strokeWidth={3}
        />
      )}

      {/* Draw landmarks as circles */}
      {showLandmarks && visibleLandmarks.map((landmark, index) => (
        <Circle
          key={index}
          cx={landmark.x * width}
          cy={landmark.y * height}
          r={5}
          color="#FFFFFF"
        />
      ))}
    </Canvas>
  );
};

/**
 * Create SVG path for skeleton (for batch rendering)
 */
function createSkeletonPath(
  landmarks: Landmark[],
  width: number,
  height: number,
  getLandmark: (name: string) => Landmark | undefined
): string {
  let path = '';

  POSE_CONNECTIONS.forEach(connection => {
    const from = getLandmark(connection.from);
    const to = getLandmark(connection.to);

    if (from && to) {
      const x1 = from.x * width;
      const y1 = from.y * height;
      const x2 = to.x * width;
      const y2 = to.y * height;

      path += `M ${x1} ${y1} L ${x2} ${y2} `;
    }
  });

  return path;
}

export default SkeletonOverlay;
