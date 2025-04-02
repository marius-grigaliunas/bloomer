import { Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'
import { 
    CurrentMonthWeekday, 
    CurrentMonthWeekend, 
    PreviousMonthDay, 
    NextMonthDay,
    HeaderDay 
} from './CalendarDay'

const CalendarGenerator = () => {
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
                "September", "October", "November", "December"];

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
                newElements.push(
                    <PreviousMonthDay
                        key={`prev-${j}`}
                        dayKey={`${lastMonthDate + j}-${selectedMonth === 0 ? 11 : selectedMonth-1}-${selectedMonth === 0 ? selectedYear-1 : selectedYear}`}
                        day={lastMonthDate + j}
                        month={selectedMonth === 0 ? 11 : selectedMonth-1}
                        year={selectedMonth === 0 ? selectedYear-1 : selectedYear}
                    />
                );
            }
        }

        // Current month days
        for (let i = 1; i <= dateLast; i++) {
            const day = new Date(selectedYear, selectedMonth, i).getDay();
            const isToday = i === today && selectedMonth.toString() === todayDate.split('-')[1] && selectedYear.toString() === todayDate.split('-')[2];
            
            if (day === 0 || day === 6) {
                newElements.push(
                    <CurrentMonthWeekend
                        key={`current-${i}`}
                        dayKey={`${i}-${selectedMonth}-${selectedYear}`}
                        day={i}
                        isToday={isToday}
                        month={selectedMonth}
                        year={selectedYear}
                    />
                );
            } else {
                newElements.push(
                    <CurrentMonthWeekday
                        key={`current-${i}`}
                        dayKey={`${i}-${selectedMonth}-${selectedYear}`}
                        day={i}
                        isToday={isToday}
                        month={selectedMonth}
                        year={selectedYear}
                    />
                );
            }
        }

        // Next month days
        if (dayLast !== 0) {
            for (let i = 1; i <= 7 - dayLast; i++) {
                newElements.push(
                    <NextMonthDay
                        key={`next-${i}`}
                        dayKey={`${i}-${selectedMonth === 11 ? 0 : selectedMonth+1}-${selectedMonth === 11 ? selectedYear+1 : selectedYear}`}
                        day={i}
                        month={selectedMonth === 11 ? 0 : selectedMonth+1}
                        year={selectedMonth === 11 ? selectedYear+1 : selectedYear}
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
    }, [selectedMonth, selectedYear]);

    return (
        <View>
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