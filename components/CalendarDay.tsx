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
    const displayText = useMemo(() => {
        if (wateringDay.plants.length === 1) {
            const plant = wateringDay.plants[0];
            return `${plant.nickname}${plant.isLate ? ' (Late)' : ''}`;
        } else {
            const hasLatePlants = wateringDay.plants.some(p => p.isLate);
            return `${wateringDay.plants.length} Plants${hasLatePlants ? ' (Late)' : ''}`;
        }
    }, [wateringDay.plants]);

    const backgroundColor = useMemo(() => {
        return wateringDay.plants.some(p => p.isLate) ? 'bg-danger' : 'bg-secondary-deep';
    }, [wateringDay.plants]);

    return (
        <View className={`absolute bottom-[2px] w-full flex-1 rounded-xl border-[1px] border-primary-deep ${backgroundColor}`}>
            <Text 
                className="text-xs text-center text-accent"
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {displayText}
            </Text>
        </View>
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
        return `${containerClasses} w-[14.28%] py-4 px-2 flex justify-start items-center relative ${isPressed ? 'opacity-70' : ''}`;
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
        return `border border-text-primary ${isSelected ? 'bg-primary-deep' : isToday ? 'bg-accent' : ''}`;
    }, [isSelected, isToday]);

    const textClasses = useMemo(() => {
        return `${isSelected ? 'text-white' : isToday ? 'text-black' : 'text-text-primary'}`;
    }, [isSelected, isToday]);

    const handlePress = useCallback(() => {
        if (onPress) onPress(date);
    }, [onPress, date]);

    // Weekday: Monday (1) through Friday (5)
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
        return `border border-text-primary ${isSelected ? 'bg-primary-deep' : isToday ? 'bg-accent' : ''}`;
    }, [isSelected, isToday]);

    const textClasses = useMemo(() => {
        return `${isSelected ? 'text-white' : 'text-text-secondary'}`;
    }, [isSelected]);

    const handlePress = useCallback(() => {
        if (onPress) onPress(date);
    }, [onPress, date]);

    // Weekend: Saturday (6) and Sunday (0)
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
        return `border border-text-secondary ${isSelected ? 'bg-primary-deep' : ''}`;
    }, [isSelected]);

    const textClasses = useMemo(() => {
        return `${isSelected ? 'text-white' : 'text-text-secondary'}`;
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
        return `border border-text-secondary ${isSelected ? 'bg-primary-deep' : ''}`;
    }, [isSelected]);

    const textClasses = useMemo(() => {
        return `${isSelected ? 'text-white' : 'text-text-secondary'}`;
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
        containerClasses="border border-text-primary"
        textClasses="text-text-primary"
        textContent={day.slice(0, 2)}
    />
));

export type { CalendarDayProps, HeaderDayProps }