import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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

// Base component for calendar days
const CalendarDay = React.memo(({ containerClasses, textClasses, textContent, wateringDay, onPress }: BaseCalendarDayProps) => {
    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        <TouchableOpacity 
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            className={`${containerClasses} w-[14.28%] py-4 px-2 flex justify-start items-center relative ${isPressed ? 'opacity-70' : ''}`}
            activeOpacity={0.7}
        >
            <Text className={textClasses}>{textContent}</Text>
            {wateringDay && wateringDay.plants.length > 0 && (
                <View className={`absolute bottom-[2px] w-full flex-1 rounded-xl border-[1px] border-primary-deep
                    ${wateringDay.plants.some(p => p.isLate) ? 'bg-danger' : 'bg-secondary-deep'}`}>
                    <Text 
                        className="text-xs text-center text-accent"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {wateringDay.plants.length === 1 
                            ? `${wateringDay.plants[0].nickname}${wateringDay.plants[0].isLate ? ' (Late)' : ''}`
                            : `${wateringDay.plants.length} Plants${wateringDay.plants.some(p => p.isLate) ? ' (Late)' : ''}`
                        }
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    )
});

// Current month weekday/weekend logic
export const CurrentMonthWeekday = React.memo(({ dayKey, day, isToday, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    // Weekday: Monday (1) through Friday (5)
    return (
        <CalendarDay
            key={dayKey}
            containerClasses={`border border-text-primary ${isSelected ? 'bg-primary-deep' : isToday ? 'bg-accent' : ''}`}
            textClasses={`${isSelected ? 'text-white' : isToday ? 'text-black' : 'text-text-primary'}`}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
});

export const CurrentMonthWeekend = React.memo(({ dayKey, day, isToday, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    // Weekend: Saturday (6) and Sunday (0)
    return (
        <CalendarDay
            key={dayKey}
            containerClasses={`border border-text-primary ${isSelected ? 'bg-primary-deep' : isToday ? 'bg-accent' : ''}`}
            textClasses={`${isSelected ? 'text-white' : 'text-text-secondary'}`}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
});

// Previous month day
export const PreviousMonthDay = React.memo(({ dayKey, day, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    return (
        <CalendarDay
            key={dayKey}
            containerClasses={`border border-text-secondary ${isSelected ? 'bg-primary-deep' : ''}`}
            textClasses={`${isSelected ? 'text-white' : 'text-text-secondary'}`}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
});

// Next month day
export const NextMonthDay = React.memo(({ dayKey, day, isSelected, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    return (
        <CalendarDay
            key={dayKey}
            containerClasses={`border border-text-secondary ${isSelected ? 'bg-primary-deep' : ''}`}
            textClasses={`${isSelected ? 'text-white' : 'text-text-secondary'}`}
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
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