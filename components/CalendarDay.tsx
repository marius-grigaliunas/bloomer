import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useMemo, useCallback } from 'react'
import { WateringDay } from '@/lib/services/dateService'

interface CalendarDayProps {
    dayKey: string;
    day: number;
    isToday?: boolean;
    isSelected?: boolean;
    month: number;
    year: number;
    wateringDay?: WateringDay;
    onPress?: (date: Date) => void;
}

interface BaseCalendarDayProps {
    containerClasses: string;
    textClasses: string;
    textContent: string;
    wateringDay?: WateringDay;
    onPress?: () => void;
}

interface HeaderDayProps {
    day: string;
}

// Memoized watering day indicator component
const WateringDayIndicator = React.memo(({ wateringDay }: { wateringDay: WateringDay }) => {
    const hasLatePlants = useMemo(() => {
        return wateringDay.plants.some(p => p.isLate);
    }, [wateringDay.plants]);

    const backgroundColor = useMemo(() => {
        return hasLatePlants ? 'bg-danger' : 'bg-success';
    }, [hasLatePlants]);

    return (
        <View className={`absolute bottom-1 w-2 h-2 rounded-full ${backgroundColor}`} />
    );
});

// Base component for calendar days with optimized re-renders
const CalendarDay = React.memo(({ containerClasses, textClasses, textContent, wateringDay, onPress }: BaseCalendarDayProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = useCallback(() => {
        setIsPressed(true);
    }, []);

    const handlePressOut = useCallback(() => {
        setIsPressed(false);
    }, []);

    const containerStyle = useMemo(() => {
        return `${containerClasses} w-[14.28%] py-3 px-1 flex justify-center items-center relative ${isPressed ? 'opacity-70' : ''}`;
    }, [containerClasses, isPressed]);

    return (
        <TouchableOpacity 
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className={containerStyle}
            activeOpacity={0.7}
        >
            <Text className={textClasses}>{textContent}</Text>
            {wateringDay && wateringDay.plants.length > 0 && (
                <WateringDayIndicator wateringDay={wateringDay} />
            )}
        </TouchableOpacity>
    )
});

// Memoized date creation to avoid unnecessary Date object creation
const createDate = (year: number, month: number, day: number): Date => {
    return new Date(year, month, day);
};

// Current month weekday/weekend logic
export const CurrentMonthWeekday = React.memo(({ dayKey, day, isToday, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = useMemo(() => createDate(year, month, day), [year, month, day]);
    
    const containerClasses = useMemo(() => {
        if (isSelected) {
            return 'bg-accent rounded-lg';
        }
        if (isToday) {
            return 'bg-primary-medium rounded-lg';
        }
        return '';
    }, [isSelected, isToday]);

    const textClasses = useMemo(() => {
        if (isSelected) {
            return 'text-text-primary font-semibold text-lg';
        }
        if (isToday) {
            return 'text-background-surface font-semibold text-lg';
        }
        return 'text-text-primary text-lg';
    }, [isSelected, isToday]);

    const handlePress = useCallback(() => {
        if (onPress) onPress(date);
    }, [onPress, date]);

    return (
        <CalendarDay
            key={dayKey}
            containerClasses={containerClasses}
            textClasses={textClasses}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={handlePress}
        />
    );
});

export const CurrentMonthWeekend = React.memo(({ dayKey, day, isToday, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = useMemo(() => createDate(year, month, day), [year, month, day]);
    
    const containerClasses = useMemo(() => {
        if (isSelected) {
            return 'bg-accent rounded-lg';
        }
        if (isToday) {
            return 'bg-primary-medium rounded-lg';
        }
        return '';
    }, [isSelected, isToday]);

    const textClasses = useMemo(() => {
        if (isSelected) {
            return 'text-text-primary font-semibold text-lg';
        }
        if (isToday) {
            return 'text-background-surface font-semibold text-lg';
        }
        return 'text-text-secondary text-lg';
    }, [isSelected, isToday]);

    const handlePress = useCallback(() => {
        if (onPress) onPress(date);
    }, [onPress, date]);

    return (
        <CalendarDay
            key={dayKey}
            containerClasses={containerClasses}
            textClasses={textClasses}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={handlePress}
        />
    );
});

// Previous month day
export const PreviousMonthDay = React.memo(({ dayKey, day, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = useMemo(() => createDate(year, month, day), [year, month, day]);
    
    const containerClasses = useMemo(() => {
        return isSelected ? 'bg-accent rounded-lg' : '';
    }, [isSelected]);

    const textClasses = useMemo(() => {
        return isSelected ? 'text-text-primary font-semibold text-lg' : 'text-text-secondary text-lg';
    }, [isSelected]);

    const handlePress = useCallback(() => {
        if (onPress) onPress(date);
    }, [onPress, date]);

    return (
        <CalendarDay
            key={dayKey}
            containerClasses={containerClasses}
            textClasses={textClasses}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={handlePress}
        />
    );
});

// Next month day
export const NextMonthDay = React.memo(({ dayKey, day, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = useMemo(() => createDate(year, month, day), [year, month, day]);
    
    const containerClasses = useMemo(() => {
        return isSelected ? 'bg-accent rounded-lg' : '';
    }, [isSelected]);

    const textClasses = useMemo(() => {
        return isSelected ? 'text-text-primary font-semibold text-lg' : 'text-text-secondary text-lg';
    }, [isSelected]);

    const handlePress = useCallback(() => {
        if (onPress) onPress(date);
    }, [onPress, date]);

    return (
        <CalendarDay
            key={dayKey}
            containerClasses={containerClasses}
            textClasses={textClasses}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={handlePress}
        />
    );
});

// Header day component
export const HeaderDay = React.memo(({ day }: HeaderDayProps) => (
    <CalendarDay
        key={day}
        containerClasses=""
        textClasses="text-text-secondary font-medium text-sm"
        textContent={day}
    />
));

export type { CalendarDayProps, HeaderDayProps }