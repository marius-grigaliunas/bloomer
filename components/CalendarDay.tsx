import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { WateringDay } from '@/lib/services/dateService'

interface CalendarDayProps {
    dayKey: string;
    day: number;
    isToday?: boolean;
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
const CalendarDay = ({ containerClasses, textClasses, textContent, wateringDay, onPress }: BaseCalendarDayProps) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            className={`${containerClasses} w-[14.28%] py-8 px-5 flex justify-start items-center`}
        >
            <Text className={textClasses}>{textContent}</Text>
            {wateringDay && (
                <View className="absolute bottom-2 flex flex-row gap-1">
                    {wateringDay.plants.map(plant => (
                        <View 
                            key={plant.plantId}
                            className={`w-2 h-2 rounded-full ${
                                plant.isNextWatering ? 'bg-secondary-medium' : 'bg-primary-medium'
                            }`}
                        />
                    ))}
                </View>
            )}
        </TouchableOpacity>
    )
}

// Current month weekday
export const CurrentMonthWeekday = ({ dayKey, day, isToday, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    return (
        <CalendarDay
            key={dayKey}
            containerClasses={`border border-text-primary ${isToday ? 'bg-accent' : ''}`}
            textClasses="text-text-primary"
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
}

// Current month weekend
export const CurrentMonthWeekend = ({ dayKey, day, isToday, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    return (
        <CalendarDay
            key={dayKey}
            containerClasses={`border border-text-primary ${isToday ? 'bg-accent' : ''}`}
            textClasses="text-text-secondary"
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
}

// Previous month day
export const PreviousMonthDay = ({ dayKey, day, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    return (
        <CalendarDay
            key={dayKey}
            containerClasses="border border-text-secondary"
            textClasses="text-text-secondary"
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
}

// Next month day
export const NextMonthDay = ({ dayKey, day, month, year, wateringDay, onPress }: CalendarDayProps) => {
    const date = new Date(year, month, day);
    return (
        <CalendarDay
            key={dayKey}
            containerClasses="border border-text-secondary"
            textClasses="text-text-secondary"
            textContent={`${day}`}
            wateringDay={wateringDay}
            onPress={onPress ? () => onPress(date) : undefined}
        />
    );
}

// Header day component
export const HeaderDay = ({ day }: HeaderDayProps) => (
    <CalendarDay
        key={day}
        containerClasses="border border-text-primary"
        textClasses="text-text-primary"
        textContent={day.slice(0, 2)}
    />
)

export type { CalendarDayProps, HeaderDayProps }