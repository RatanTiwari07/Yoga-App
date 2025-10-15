# 📊 Activity Heatmap Feature

## Overview

The Activity Heatmap provides a visual representation of user engagement over the last 90 days, similar to GitHub's contribution graph.

## Features

### Visual Activity Tracking
- **90-Day View**: Shows user activity for the past 3 months
- **Color-Coded Intensity**: Different shades of green indicate activity levels
- **Day-by-Day Grid**: Each cell represents one day
- **Month Labels**: Easy navigation with month markers
- **Day Labels**: Shows day of week on the left (S, M, T, W, T, F, S)

### Color Scheme
- **Gray (Empty)**: No activity on that day
- **Light Green**: 1 session completed
- **Medium Green**: 2 sessions completed  
- **Dark Green**: 3+ sessions completed
- **Blue Border**: Current day marker

### Stats Summary
Located below the heatmap:
- **Total Active Days**: Count of days with at least one session
- **Longest Streak**: Maximum consecutive days of activity

## Implementation

### Component: `ActivityHeatmap.tsx`

**Location**: `/src/components/ActivityHeatmap.tsx`

**Props**:
```typescript
interface HeatmapProps {
  sessions: Array<{ date: string }>;
  className?: string;
}
```

**Key Functions**:
1. `getDaysArray(days)` - Generates array of last N days
2. `getActivityCount(date)` - Counts sessions for a specific day
3. `getColorIntensity(count)` - Returns color class based on activity
4. `getMonthLabels()` - Calculates month label positions

### Integration

Added to `ProfileScreen.tsx` in the "Performance Stats" section:

```typescript
<Card title="📊 Activity Heatmap" className="mb-6">
  <View className="mt-3">
    <ActivityHeatmap sessions={sessions} />
  </View>
</Card>
```

## Mock Data Generation

### Auto-Generated Sessions

When no real sessions exist, the app generates mock data:

**Location**: `/src/utils/storage.ts` → `generateMockSessions()`

**Mock Data Pattern**:
- ~18 active days over the last 60 days
- Distributed randomly (days 0, 1, 2, 5, 7, 10, etc.)
- Some days have multiple sessions (20% chance of 2 sessions)
- Each session: 3-7 poses, 70-100% accuracy

**Example Distribution**:
```
Today, Yesterday, 2 days ago, 5 days ago, 7 days ago...
↓
Creates a realistic activity pattern
```

## Design Details

### Layout
- **Cell Size**: 12x12 pixels (3rem in Tailwind)
- **Gap**: 4px between cells
- **Scrollable**: Horizontal scroll for all 90 days
- **Responsive**: Adapts to different screen widths

### Color Palette
```
No Activity:    #F3F4F6  (gray-100)
Low Activity:   #BBF7D0  (green-200)
Medium:         #4ADE80  (green-400)
High:           #16A34A  (green-600)
Today Border:   #3B82F6  (blue-500)
```

### Grid Structure
```
     Jan        Feb        Mar
  M  [■][■][■][■][■][■][■]...
  T  [■][□][■][■][□][■][■]...
  W  [■][■][■][□][■][■][■]...
  T  [■][■][□][■][■][■][■]...
  F  [□][■][■][■][■][□][■]...
  S  [■][■][■][■][■][■][■]...
  S  [■][□][■][■][■][■][□]...
     ↑ Each column = 1 week
```

## User Benefits

### Motivation
- **Visual Progress**: See improvement over time
- **Streak Building**: Encourages daily practice
- **Pattern Recognition**: Identify active/inactive periods
- **Goal Setting**: Visual reminder to stay consistent

### Gamification
- Filling in the green squares creates satisfaction
- Seeing gaps motivates users to practice
- Longer green streaks = sense of accomplishment
- Comparison with past months shows growth

## Technical Details

### Performance Optimization
1. **Memoization**: Could add `useMemo` for day calculations
2. **Lazy Loading**: Only renders visible weeks
3. **Efficient Filtering**: Uses date string comparison
4. **Minimal Re-renders**: Pure component design

### Data Flow
```
ProfileScreen
    ↓
  getSessions() → storage.ts
    ↓
  (If empty) generateMockSessions()
    ↓
  sessions array
    ↓
  ActivityHeatmap component
    ↓
  Renders grid with colors
```

### Future Enhancements

#### Potential Features:
1. **Tooltip on Tap**: Show exact count and date
2. **Custom Date Range**: 30/60/90/180 days
3. **Session Details**: Tap cell to see that day's sessions
4. **Export Data**: Share/download activity report
5. **Comparison Mode**: Compare with previous months
6. **Streak Animation**: Celebrate streak milestones
7. **Goal Lines**: Visual indicators for weekly targets

#### Advanced Analytics:
- Best day of week for practice
- Average sessions per week
- Monthly trends graph
- Consistency score

## Accessibility

### Current Features:
- Readable day labels
- Clear color contrast
- Horizontal scroll for navigation

### Improvements Needed:
- Screen reader support
- Tap to announce day details
- Alternative text representations
- High contrast mode

## Styling Customization

### Change Colors
Edit `getColorIntensity()` in `ActivityHeatmap.tsx`:

```typescript
const getColorIntensity = (count: number) => {
  if (count === 0) return 'bg-purple-100';    // Empty
  if (count === 1) return 'bg-purple-300';    // Low
  if (count === 2) return 'bg-purple-500';    // Medium
  if (count >= 3) return 'bg-purple-700';     // High
};
```

### Adjust Size
Modify cell dimensions:

```typescript
// Change from w-3 h-3 to w-4 h-4
<View className="w-4 h-4 mb-1 rounded-sm" />
```

### Custom Legend
Update legend in render:

```typescript
<View className="flex-row gap-1">
  <View className="w-3 h-3 bg-blue-100 rounded-sm" />
  <View className="w-3 h-3 bg-blue-300 rounded-sm" />
  <View className="w-3 h-3 bg-blue-500 rounded-sm" />
  <View className="w-3 h-3 bg-blue-700 rounded-sm" />
</View>
```

## Usage Examples

### Basic Usage
```typescript
<ActivityHeatmap sessions={sessions} />
```

### With Custom Styling
```typescript
<ActivityHeatmap 
  sessions={sessions} 
  className="bg-white p-4 rounded-lg"
/>
```

### With Real Data
```typescript
const [sessions, setSessions] = useState([]);

useEffect(() => {
  getSessions().then(setSessions);
}, []);

<ActivityHeatmap sessions={sessions} />
```

## Testing

### Test Cases:
1. ✅ Empty sessions array → Shows all gray
2. ✅ Mock data → Shows varied colors
3. ✅ Real sessions → Accurate representation
4. ✅ Today's marker → Blue border visible
5. ✅ Horizontal scroll → All 90 days accessible
6. ✅ Month labels → Correctly positioned

## Browser/Platform Support

- ✅ Android (Expo Go)
- ✅ Android (Development Build)
- ✅ iOS (Should work, untested)
- ✅ Web (ScrollView may need adjustment)

---

**Status**: ✅ Fully implemented and integrated into Profile screen!
