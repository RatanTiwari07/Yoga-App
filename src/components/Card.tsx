import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title: string;
  description?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  className?: string;
  badge?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  onPress,
  children,
  className = '',
  badge,
}) => {
  const content = (
    <View className={`bg-white rounded-2xl p-4 shadow-md shadow-gray-300 ${className}`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-xl font-bold text-blue-800">{title}</Text>
          {description && (
            <Text className="text-gray-600 mt-1">{description}</Text>
          )}
        </View>
        {badge && (
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-700 text-xs font-semibold">{badge}</Text>
          </View>
        )}
      </View>
      {children && <View className="mt-3">{children}</View>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default Card;
