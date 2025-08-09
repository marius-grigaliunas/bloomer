import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useEffect, useState, useMemo, useCallback } from 'react'
import { WateringDay } from '@/lib/services/dateService'
import { 
    CurrentMonthWeekday, 
    CurrentMonthWeekend, 
    PreviousMonthDay, 
    NextMonthDay,
    HeaderDay 
} from './CalendarDay'
import { SafeAreaView } from 'react-native-safe-area-context';

interface CalendarGeneratorProps {
    wateringDays: Map<string, WateringDay>;
    onDayPress?: (date: Date) => void;
    mondayFirstDayOfWeek?: boolean;
    selectedDate?: Date | null;
    initialMonth?: number;
    initialYear?: number;
}

const CalendarGenerator = ({ wateringDays, onDayPress, mondayFirstDayOfWeek = false, selectedDate, initialMonth, initialYear }: CalendarGeneratorProps) => {
    // Memoize today's date calculation to avoid recalculation on every render
    const todayInfo = useMemo(() => {
        const date = new Date();
        const todayYear = date.getFullYear();
        const todayMonth = date.getMonth();
        const today = date.getDate();
        const todayDate = `${today}-${todayMonth}-${todayYear}`;
        return { todayYear, todayMonth, today, todayDate };
    }, []);
    
    const [selectedMonth, setSelectedMonth] = useState(initialMonth ?? todayInfo.todayMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear ?? todayInfo.todayYear);
    
    // Current calendar elements
    const [calendarElements, setCalendarElements] = useState<ReactNode[]>([]);
    
    // Memoize static arrays to prevent recreation on every render
    const days = useMemo(() => mondayFirstDayOfWeek
        ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    , [mondayFirstDayOfWeek]);
    
    const months = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"], []);    // Inline getWateringDay function to avoid callback recreation
    const getWateringDay = (date: Date): WateringDay | undefined => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const dateKey = `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
        return wateringDays.get(dateKey);
    };

    // Optimize date comparison to avoid creating new Date objects
    const isDateSelected = useCallback((date: Date): boolean => {
        if (!selectedDate) return false;
        
        return (
            date.getFullYear() === selectedDate.getFullYear() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getDate() === selectedDate.getDate()
        );
    }, [selectedDate]);

    // Function to generate calendar elements for a specific month
    const generateCalendarForMonth = useCallback((year: number, month: number): ReactNode[] => {
        const newElements: ReactNode[] = [];

        // Always add header days for each month
        days.forEach(day => {
            newElements.push(<HeaderDay key={`${day}-${year}-${month}`} day={day} />);
        });

        // Calculate calendar metadata for the specific month
        const dateLast_MonthPrev = new Date(year, month, 0).getDate();
        const dateLast = new Date(year, month + 1, 0).getDate();

        let dayFirst = new Date(year, month, 1).getDay();
        let dayLast = new Date(year, month, dateLast).getDay();

        if (mondayFirstDayOfWeek) {
            dayFirst = (dayFirst === 0) ? 6 : dayFirst - 1;
            dayLast = (dayLast === 0) ? 6 : dayLast - 1;
        }

        // Previous month days
        if (dayFirst !== 0) {
            const lastMonthDate = dateLast_MonthPrev - dayFirst + 1;
            for (let j = 1; j <= dayFirst; j++) {
                const prevMonthDate = new Date(
                    month === 0 ? year - 1 : year,
                    month === 0 ? 11 : month - 1,
                    lastMonthDate + j - 1
                );
                const wateringDay = getWateringDay(prevMonthDate);
                const isSelected = isDateSelected(prevMonthDate);

                newElements.push(
                    <PreviousMonthDay
                        key={`prev-${j}-${year}-${month}`}
                        dayKey={`${lastMonthDate + j - 1}-${month === 0 ? 11 : month-1}-${month === 0 ? year-1 : year}`}
                        day={lastMonthDate + j - 1}
                        month={month === 0 ? 11 : month-1}
                        year={month === 0 ? year-1 : year}
                        wateringDay={wateringDay}
                        isSelected={isSelected}
                        onPress={onDayPress}
                    />
                );
            }
        }

        // Current month days
        for (let i = 1; i <= dateLast; i++) {
            const currentDate = new Date(year, month, i);
            const wateringDay = getWateringDay(currentDate);
            const jsDay = currentDate.getDay();
            const isToday = i === todayInfo.today && month === todayInfo.todayMonth && year === todayInfo.todayYear;
            const isSelected = isDateSelected(currentDate);

            const key = `current-${i}-${year}-${month}`;
            const dayProps = {
                dayKey: `${i}-${month}-${year}`,
                day: i,
                isToday: isToday,
                isSelected: isSelected,
                month: month,
                year: year,
                wateringDay,
                onPress: onDayPress ? () => onDayPress(currentDate) : undefined
            };

            if (jsDay === 0 || jsDay === 6) {
                newElements.push(<CurrentMonthWeekend key={key} {...dayProps} />);
            } else {
                newElements.push(<CurrentMonthWeekday key={key} {...dayProps} />);
            }
        }

        // Next month days
        if (dayLast !== 6) {
            for (let i = 1; i <= 6 - dayLast; i++) {
                const nextMonthDate = new Date(
                    month === 11 ? year + 1 : year,
                    month === 11 ? 0 : month + 1,
                    i
                );
                const wateringDay = getWateringDay(nextMonthDate);
                const isSelected = isDateSelected(nextMonthDate);

                const key = `next-${i}-${year}-${month}`;
                const dayProps = {
                    dayKey: `${i}-${month === 11 ? 0 : month+1}-${month === 11 ? year+1 : year}`,
                    day: i,
                    month: month === 11 ? 0 : month+1,
                    year: month === 11 ? year+1 : year,
                    wateringDay,
                    isSelected: isSelected,
                    onPress: onDayPress
                };
                newElements.push(
                    <NextMonthDay
                        key={key}
                        {...dayProps}
                    />
                );
            }
        }

        return newElements;
    }, [wateringDays, isDateSelected, onDayPress, days, todayInfo, mondayFirstDayOfWeek]);

    // Generate calendar for current month
    const generateCurrentCalendar = useCallback(() => {
        console.log('Generating calendar for:', selectedYear, selectedMonth);
        console.log('Watering days size:', wateringDays.size);
        const elements = generateCalendarForMonth(selectedYear, selectedMonth);
        console.log('Generated elements count:', elements.length);
        setCalendarElements(elements);
    }, [selectedYear, selectedMonth, generateCalendarForMonth, wateringDays]);

    const NextMonth = () => {
        if(selectedMonth === 11) {
            setSelectedMonth(0);
            setSelectedYear(prev => prev+1);
        } else {
            setSelectedMonth(prev => prev+1);
        }
    }

    const PreviousMonth = () => {
        if(selectedMonth === 0) {
            setSelectedMonth(11);
            setSelectedYear(prev => prev-1);
        } else {
            setSelectedMonth(prev => prev-1);
        }
    }

    // Effect to generate calendar when month/year/data changes
    useEffect(() => {
        generateCurrentCalendar();
    }, [generateCurrentCalendar]);

    // Update calendar state when initial values change (for navigation restoration)
    useEffect(() => {
        if (initialMonth !== undefined && initialMonth !== selectedMonth) {
            setSelectedMonth(initialMonth);
        }
        if (initialYear !== undefined && initialYear !== selectedYear) {
            setSelectedYear(initialYear);
        }
    }, [initialMonth, initialYear]);

    return (
                <View className=''>
                    <View className="flex flex-row justify-center w-screen h-16 rounded-2xl items-center bg-background-surface mt-2 " 
                    >
                        <TouchableOpacity
                            onPress={PreviousMonth}
                            onLongPress={PreviousMonth}
                            className='bg-primary-deep w-10 h-10 rounded-full flex justify-center items-center'
                        >
                            <Text className='text-3xl text-text-primary'
                            >
                                {"<"}
                            </Text>
                        </TouchableOpacity>
                        <View className='w-64 flex flex-row justify-center'>
                            <Text className='w-8/12 text-4xl text-text-primary text-center' >{months[selectedMonth]}</Text>
                            <Text className='w-4/12 text-4xl text-text-primary text-center ' >{selectedYear}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={NextMonth}
                            className='bg-primary-deep w-10 h-10 rounded-full flex justify-center items-center'
                        >
                            <Text className='text-3xl text-text-primary'
                            >
                                {">"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className='flex flex-row flex-wrap w-full mt-2'>
                        {calendarElements}
                    </View>
                </View>
    );
}

export default CalendarGenerator