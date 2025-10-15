import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const baseClasses = 'py-3 px-6 rounded-xl items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 shadow-lg shadow-blue-300',
    secondary: 'bg-mint-500 shadow-lg shadow-mint-200',
    danger: 'bg-red-500 shadow-lg shadow-red-200',
  };

  const textClasses = {
    primary: 'text-white font-bold text-lg',
    secondary: 'text-blue-800 font-bold text-lg',
    danger: 'text-white font-bold text-lg',
  };

  const disabledClasses = disabled ? 'opacity-50' : 'opacity-100';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className={textClasses[variant]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
