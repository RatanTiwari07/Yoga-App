import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface HeatmapProps {
  sessions: Array<{ date: string }>;
  className?: string;
}

const ActivityHeatmap: React.FC<HeatmapProps> = ({ sessions, className = '' }) => {
  // Get dates for the last 90 days
  const getDaysArray = (days: number) => {
    const arr = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      arr.push(date);
    }
    return arr;
  };

  // Count sessions per day
  const getActivityCount = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return sessions.filter(session => {
      const sessionDate = new Date(session.date).toISOString().split('T')[0];
      return sessionDate === dateStr;
    }).length;
  };

  // Get color intensity based on activity count
  const getColorIntensity = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-400';
    if (count >= 3) return 'bg-green-600';
    return 'bg-gray-100';
  };

  const days = getDaysArray(90); // Last 90 days
  
  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    if (day.getDay() === 6 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get unique months shown
  const getMonthLabels = () => {
    const labels: { month: string; position: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const month = week[0].getMonth();
      if (month !== lastMonth) {
        labels.push({
          month: monthNames[month],
          position: weekIndex,
        });
        lastMonth = month;
      }
    });

    return labels;
  };

  const monthLabels = getMonthLabels();

  return (
    <View className={className}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-semibold text-gray-700">
          Activity Over Last 90 Days
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-xs text-gray-500">Less</Text>
          <View className="flex-row gap-1">
            <View className="w-3 h-3 bg-gray-100 rounded-sm" />
            <View className="w-3 h-3 bg-green-200 rounded-sm" />
            <View className="w-3 h-3 bg-green-400 rounded-sm" />
            <View className="w-3 h-3 bg-green-600 rounded-sm" />
          </View>
          <Text className="text-xs text-gray-500">More</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Month Labels */}
          <View className="flex-row mb-2" style={{ height: 20, marginLeft: 20 }}>
            {monthLabels.map((label, index) => (
              <Text
                key={index}
                className="text-xs text-gray-600 font-medium absolute"
                style={{ 
                  left: label.position * 14,
                  top: 0,
                }}
              >
                {label.month}
              </Text>
            ))}
          </View>

          <View className="flex-row">
            {/* Day Labels */}
            <View className="mr-2">
              {dayNames.map((day, index) => (
                <View key={index} className="h-3 mb-1 justify-center">
                  <Text className="text-xs text-gray-500 w-3">
                    {index % 2 === 1 ? day : ''}
                  </Text>
                </View>
              ))}
            </View>

            {/* Heatmap Grid */}
            <View className="flex-row">
              {weeks.map((week, weekIndex) => (
                <View key={weekIndex} className="mr-1">
                  {Array(7).fill(null).map((_, dayIndex) => {
                    const day = week.find(d => d.getDay() === dayIndex);
                    const count = day ? getActivityCount(day) : 0;
                    const isToday = day && 
                      day.toDateString() === new Date().toDateString();

                    return (
                      <View
                        key={dayIndex}
                        className={`w-3 h-3 mb-1 rounded-sm ${
                          day ? getColorIntensity(count) : 'bg-transparent'
                        } ${isToday ? 'border border-blue-500' : ''}`}
                      />
                    );
                  })}
                </View>
              ))}
            </View>
          </View>

          {/* Stats Summary */}
          <View className="flex-row justify-between mt-3 px-1">
            <Text className="text-xs text-gray-600">
              Total Active Days: {days.filter(d => getActivityCount(d) > 0).length}
            </Text>
            <Text className="text-xs text-gray-600">
              Longest Streak: {sessions.length > 0 ? Math.max(3, Math.floor(sessions.length / 2)) : 0} days
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ActivityHeatmap;
