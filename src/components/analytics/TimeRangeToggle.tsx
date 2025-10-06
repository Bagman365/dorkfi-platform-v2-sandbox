import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'annual';

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const TimeRangeToggle = ({ value, onChange, className = '' }: TimeRangeToggleProps) => {
  return (
    <ToggleGroup 
      type="single" 
      value={value} 
      onValueChange={(val) => val && onChange(val as TimeRange)}
      className={`gap-1 ${className}`}
    >
      <ToggleGroupItem 
        value="daily" 
        aria-label="Daily view"
        className="text-xs px-3 py-1.5 data-[state=on]:bg-ocean-teal data-[state=on]:text-white"
      >
        Daily
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="weekly" 
        aria-label="Weekly view"
        className="text-xs px-3 py-1.5 data-[state=on]:bg-ocean-teal data-[state=on]:text-white"
      >
        Weekly
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="monthly" 
        aria-label="Monthly view"
        className="text-xs px-3 py-1.5 data-[state=on]:bg-ocean-teal data-[state=on]:text-white"
      >
        Monthly
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="annual" 
        aria-label="Annual view"
        className="text-xs px-3 py-1.5 data-[state=on]:bg-ocean-teal data-[state=on]:text-white"
      >
        Annual
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default TimeRangeToggle;
