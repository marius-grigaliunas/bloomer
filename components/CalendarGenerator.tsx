import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
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
}

const CalendarGenerator = ({ wateringDays, onDayPress }: CalendarGeneratorProps) => {
    const [calendarElements, setCalendarElements] = useState<ReactNode[]>([])
    
    const date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth = date.getMonth();
    const today = date.getDate();
    const todayDate = `${today}-${todayMonth}-${todayYear}`;
    
    const [selectedMonth, setSelectedMonth] = useState(todayMonth);
    const [selectedYear, setSelectedYear] = useState(todayYear);
    
    
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August",
                "September", "October", "November", "December"];    const getWateringDay = (date: Date): WateringDay | undefined => {
        // Normalize the date to midnight UTC
        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);
        
        // Format date key in YYYY-MM-DD format to match the wateringDays map
        const dateKey = `${normalizedDate.getFullYear()}-${String(normalizedDate.getMonth() + 1).padStart(2, '0')}-${String(normalizedDate.getDate()).padStart(2, '0')}`;
        return wateringDays.get(dateKey);
    }

    const generateCalendar = () => {
        const newElements: ReactNode[] = [];
    
        // Add header days
        days.slice(1).forEach(day => {
            newElements.push(<HeaderDay key={day} day={day} />);
        });
        newElements.push(<HeaderDay key={days[0]} day={days[0]} />);

        // Calendar generation logic using new components
        const dateLast_MonthPrev = new Date(selectedYear, selectedMonth, 0).getDate();
        const dateLast = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const dayFirst = new Date(selectedYear, selectedMonth, 1).getDay();
        const dayLast = new Date(selectedYear, selectedMonth, dateLast).getDay();

        // Previous month days
        if (dayFirst !== 1) {
            const lastMonthDate = dayFirst !== 0 
                ? dateLast_MonthPrev - dayFirst + 1 
                : dateLast_MonthPrev - 7 + 1;

            for (let j = 1; j < (dayFirst || 7); j++) {
                const prevMonthDate = new Date(
                    selectedMonth === 0 ? selectedYear - 1 : selectedYear,
                    selectedMonth === 0 ? 11 : selectedMonth - 1,
                    lastMonthDate + j
                );
                const wateringDay = getWateringDay(prevMonthDate);
                
                newElements.push(
                    <PreviousMonthDay
                        key={`prev-${j}`}
                        dayKey={`${lastMonthDate + j}-${selectedMonth === 0 ? 11 : selectedMonth-1}-${selectedMonth === 0 ? selectedYear-1 : selectedYear}`}
                        day={lastMonthDate + j}
                        month={selectedMonth === 0 ? 11 : selectedMonth-1}
                        year={selectedMonth === 0 ? selectedYear-1 : selectedYear}
                        wateringDay={wateringDay}
                        onPress={onDayPress}
                    />
                );
            }
        }

        // Current month days
        for (let i = 1; i <= dateLast; i++) {
            const currentDate = new Date(selectedYear, selectedMonth, i);
            const wateringDay = getWateringDay(currentDate);
            const day = currentDate.getDay();
            const isToday = i === today && selectedMonth.toString() === todayDate.split('-')[1] && selectedYear.toString() === todayDate.split('-')[2];
            
            // Separate key from other props
            const key = `current-${i}`;
            const dayProps = {
                dayKey: `${i}-${selectedMonth}-${selectedYear}`,
                day: i,
                isToday: isToday,
                month: selectedMonth,
                year: selectedYear,
                wateringDay,
                onPress: onDayPress ? () => onDayPress(currentDate) : undefined
            };

            if (day === 0 || day === 6) {
                newElements.push(<CurrentMonthWeekend key={key} {...dayProps} />);
            } else {
                newElements.push(<CurrentMonthWeekday key={key} {...dayProps} />);
            }
        }

        // Next month days
        if (dayLast !== 0) {
            for (let i = 1; i <= 7 - dayLast; i++) {
                const nextMonthDate = new Date(
                    selectedMonth === 11 ? selectedYear + 1 : selectedYear,
                    selectedMonth === 11 ? 0 : selectedMonth + 1,
                    i
                );
                const wateringDay = getWateringDay(nextMonthDate);
                
                const key = `next-${i}`;
                const dayProps = {
                    dayKey: `${i}-${selectedMonth === 11 ? 0 : selectedMonth+1}-${selectedMonth === 11 ? selectedYear+1 : selectedYear}`,
                    day: i,
                    month: selectedMonth === 11 ? 0 : selectedMonth+1,
                    year: selectedMonth === 11 ? selectedYear+1 : selectedYear,
                    wateringDay,
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

        setCalendarElements(newElements);
    };

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

    useEffect(() => {
        generateCalendar();
        return () => setCalendarElements([]);
    }, [selectedMonth, selectedYear, wateringDays]); // Add wateringDays to dependencies

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