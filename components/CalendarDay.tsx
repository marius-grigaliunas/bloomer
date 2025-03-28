import { View, Text } from 'react-native'
import React from 'react'

interface CalendarDayProps {
    dayKey: string;
    day: number;
    isToday?: boolean;
    month: number;
    year: number;
}

interface BaseCalendarDayProps {
    containerClasses: string;
    textClasses: string;
    textContent: string;
}

interface HeaderDayProps {
    day: string;
}

// Base component for calendar days
const CalendarDay = ({ containerClasses, textClasses, textContent }: BaseCalendarDayProps) => {
    return (
        <View className={`${containerClasses} w-[14.28%] py-8 px-5 flex justify-start items-center`}>
            <Text className={textClasses}>{textContent}</Text>    
        </View>
    )
}

// Current month weekday
export const CurrentMonthWeekday = ({ dayKey, day, isToday }: CalendarDayProps) => (
    <CalendarDay
        key={dayKey}
        containerClasses={`border border-text-primary ${isToday ? 'bg-accent' : ''}`}
        textClasses="text-text-primary"
        textContent={`${day}`}
    />
)

// Current month weekend
export const CurrentMonthWeekend = ({ dayKey, day, isToday }: CalendarDayProps) => (
    <CalendarDay
        key={dayKey}
        containerClasses={`border border-text-primary ${isToday ? 'bg-accent' : ''}`}
        textClasses="text-text-secondary"
        textContent={`${day}`}
    />
)

// Previous month day
export const PreviousMonthDay = ({ dayKey, day }: CalendarDayProps) => (
    <CalendarDay
        key={dayKey}
        containerClasses="border border-text-secondary"
        textClasses="text-text-secondary"
        textContent={`${day}`}
    />
)

// Next month day
export const NextMonthDay = ({ dayKey, day }: CalendarDayProps) => (
    <CalendarDay
        key={dayKey}
        containerClasses="border border-text-secondary"
        textClasses="text-text-secondary"
        textContent={`${day}`}
    />
)

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