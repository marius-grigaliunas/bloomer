import { ScrollView, Text, TouchableOpacity, View, Animated, Dimensions, PanResponder } from 'react-native'
import React, { ReactNode, useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { WateringDay } from '@/lib/services/dateService'
import { 
    CurrentMonthWeekday, 
    CurrentMonthWeekend, 
    PreviousMonthDay, 
    NextMonthDay,
    HeaderDay 
} from './CalendarDay'
import { SafeAreaView } from 'react-native-safe-area-context'
import CalendarSkeleton from './CalendarSkeleton'


interface CalendarGeneratorProps {
    wateringDays: Map<string, WateringDay>;
    onDayPress?: (date: Date) => void;
    mondayFirstDayOfWeek?: boolean;
    selectedDate?: Date | null;
    initialMonth?: number;
    initialYear?: number;
}

// Enhanced cache with better key generation and LRU eviction
const calendarCache = new Map<string, ReactNode[]>();
const cacheOrder: string[] = [];
const MAX_CACHE_SIZE = 30;

// Function to clear calendar cache
export const clearCalendarCache = () => {
  calendarCache.clear();
  cacheOrder.length = 0;
};

// Optimized date key generation with proper padding to match dateService
const generateDateKey = (year: number, month: number, day: number): string => {
    // Add +1 to month to match dateService.ts which uses 1-12 instead of 0-11
    const adjustedMonth = month + 1;
    return `${year}-${adjustedMonth < 10 ? '0' : ''}${adjustedMonth}-${day < 10 ? '0' : ''}${day}`;
};

// Pre-calculated date objects for better performance
const createDateObject = (year: number, month: number, day: number): Date => {
    return new Date(year, month, day);
};

const { width: screenWidth } = Dimensions.get('window');

const CalendarGenerator = ({ wateringDays, onDayPress, mondayFirstDayOfWeek = false, selectedDate, initialMonth, initialYear }: CalendarGeneratorProps) => {
    // Memoize today's date calculation to avoid recalculation on every render
    const todayInfo = useMemo(() => {
        const date = new Date();
        const todayYear = date.getFullYear();
        const todayMonth = date.getMonth();
        const today = date.getDate();
        return { todayYear, todayMonth, today };
    }, []);
    
    const [selectedMonth, setSelectedMonth] = useState(initialMonth ?? todayInfo.todayMonth);
    const [selectedYear, setSelectedYear] = useState(initialYear ?? todayInfo.todayYear);
    
    // Animation values for sliding
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    
    // Current calendar elements with loading state
    const [calendarElements, setCalendarElements] = useState<ReactNode[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Ref to track if we're currently generating to prevent multiple simultaneous generations
    const generatingRef = useRef(false);
    
    // Animation state
    const [isAnimating, setIsAnimating] = useState(false);
    const [targetMonth, setTargetMonth] = useState<number | null>(null);
    const [targetYear, setTargetYear] = useState<number | null>(null);
    
    // Memoize static arrays to prevent recreation on every render
    const days = useMemo(() => mondayFirstDayOfWeek
        ? ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
        : ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    , [mondayFirstDayOfWeek]);
    
    const months = useMemo(() => ["January", "February", "March", "April", "May", "June", "July", "August",
        "September", "October", "November", "December"], []);

    // Optimized getWateringDay function with memoized date key generation
    const getWateringDay = useCallback((year: number, month: number, day: number): WateringDay | undefined => {
        const dateKey = generateDateKey(year, month, day);
        const wateringDay = wateringDays.get(dateKey);
        
        return wateringDay;
    }, [wateringDays]);

    // Optimize date comparison to avoid creating new Date objects
    const isDateSelected = useCallback((year: number, month: number, day: number): boolean => {
        if (!selectedDate) return false;
        
        return (
            year === selectedDate.getFullYear() &&
            month === selectedDate.getMonth() &&
            day === selectedDate.getDate()
        );
    }, [selectedDate]);

    // Generate cache key for calendar elements
    const getCacheKey = useCallback((year: number, month: number): string => {
        // Include watering days hash in cache key to ensure cache invalidation when watering days change
        const wateringDaysHash = Array.from(wateringDays.keys()).join('|');
        return `${year}-${month}-${mondayFirstDayOfWeek}-${selectedDate?.getTime() ?? 'null'}-${wateringDaysHash}`;
    }, [mondayFirstDayOfWeek, selectedDate, wateringDays]);

    // Enhanced cache management with LRU eviction
    const addToCache = useCallback((key: string, elements: ReactNode[]) => {
        if (calendarCache.has(key)) {
            // Move to end of order (most recently used)
            const index = cacheOrder.indexOf(key);
            if (index > -1) {
                cacheOrder.splice(index, 1);
            }
        }
        
        calendarCache.set(key, elements);
        cacheOrder.push(key);
        
        // LRU eviction
        if (cacheOrder.length > MAX_CACHE_SIZE) {
            const oldestKey = cacheOrder.shift();
            if (oldestKey) {
                calendarCache.delete(oldestKey);
            }
        }
    }, []);

    // Pre-generate header elements once
    const headerElements = useMemo(() => {
        return days.map(day => <HeaderDay key={day} day={day} />);
    }, [days]);

    // Function to generate calendar elements for a specific month with optimizations
    const generateCalendarForMonth = useCallback((year: number, month: number): ReactNode[] => {
        const cacheKey = getCacheKey(year, month);
        
        // Check cache first
        if (calendarCache.has(cacheKey)) {
            return calendarCache.get(cacheKey)!;
        }

        const newElements: ReactNode[] = [];

        // Add pre-generated header elements
        newElements.push(...headerElements);

        // Calculate calendar metadata for the specific month (optimized)
        const dateLast_MonthPrev = new Date(year, month, 0).getDate();
        const dateLast = new Date(year, month + 1, 0).getDate();

        let dayFirst = new Date(year, month, 1).getDay();
        let dayLast = new Date(year, month, dateLast).getDay();

        if (mondayFirstDayOfWeek) {
            dayFirst = (dayFirst === 0) ? 6 : dayFirst - 1;
            dayLast = (dayLast === 0) ? 6 : dayLast - 1;
        }

        // Previous month days (optimized)
        if (dayFirst !== 0) {
            const lastMonthDate = dateLast_MonthPrev - dayFirst + 1;
            const prevMonth = month === 0 ? 11 : month - 1;
            const prevYear = month === 0 ? year - 1 : year;
            
            for (let j = 1; j <= dayFirst; j++) {
                const day = lastMonthDate + j - 1;
                const wateringDay = getWateringDay(prevYear, prevMonth, day);
                const isSelected = isDateSelected(prevYear, prevMonth, day);

                newElements.push(
                    <PreviousMonthDay
                        key={`prev-${j}-${year}-${month}`}
                        dayKey={`${day}-${prevMonth}-${prevYear}`}
                        day={day}
                        month={prevMonth}
                        year={prevYear}
                        wateringDay={wateringDay}
                        isSelected={isSelected}
                        onPress={onDayPress}
                    />
                );
            }
        }

        // Current month days (optimized)
        for (let i = 1; i <= dateLast; i++) {
            const wateringDay = getWateringDay(year, month, i);
            const jsDay = new Date(year, month, i).getDay();
            const isToday = i === todayInfo.today && month === todayInfo.todayMonth && year === todayInfo.todayYear;
            const isSelected = isDateSelected(year, month, i);

            const key = `current-${i}-${year}-${month}`;
            const dayProps = {
                dayKey: `${i}-${month}-${year}`,
                day: i,
                isToday: isToday,
                isSelected: isSelected,
                month: month,
                year: year,
                wateringDay,
                onPress: onDayPress ? () => onDayPress(createDateObject(year, month, i)) : undefined
            };

            if (jsDay === 0 || jsDay === 6) {
                newElements.push(<CurrentMonthWeekend key={key} {...dayProps} />);
            } else {
                newElements.push(<CurrentMonthWeekday key={key} {...dayProps} />);
            }
        }

        // Next month days (optimized)
        if (dayLast !== 6) {
            const nextMonth = month === 11 ? 0 : month + 1;
            const nextYear = month === 11 ? year + 1 : year;
            
            for (let i = 1; i <= 6 - dayLast; i++) {
                const wateringDay = getWateringDay(nextYear, nextMonth, i);
                const isSelected = isDateSelected(nextYear, nextMonth, i);

                const key = `next-${i}-${year}-${month}`;
                const dayProps = {
                    dayKey: `${i}-${nextMonth}-${nextYear}`,
                    day: i,
                    month: nextMonth,
                    year: nextYear,
                    wateringDay,
                    isSelected: isSelected,
                    onPress: onDayPress ? () => onDayPress(createDateObject(nextYear, nextMonth, i)) : undefined
                };
                newElements.push(
                    <NextMonthDay
                        key={key}
                        {...dayProps}
                    />
                );
            }
        }

        // Add to cache with LRU management
        addToCache(cacheKey, newElements);

        return newElements;
    }, [wateringDays, isDateSelected, onDayPress, headerElements, todayInfo, mondayFirstDayOfWeek, getCacheKey, getWateringDay, addToCache]);

    // Generate calendar for current month with immediate UI update
    const generateCurrentCalendar = useCallback(async () => {
        if (generatingRef.current) return;
        
        generatingRef.current = true;
        setIsGenerating(true);
        
        try {
            // Immediate UI update with cached data if available
            const cacheKey = getCacheKey(selectedYear, selectedMonth);
            if (calendarCache.has(cacheKey)) {
                setCalendarElements(calendarCache.get(cacheKey)!);
                setIsGenerating(false);
                generatingRef.current = false;
                return;
            }

            // Use requestIdleCallback for better performance (fallback to setTimeout)
            const scheduleWork = (callback: () => void) => {
                if (typeof requestIdleCallback !== 'undefined') {
                    requestIdleCallback(callback, { timeout: 16 });
                } else {
                    setTimeout(callback, 0);
                }
            };

            scheduleWork(() => {
                const elements = generateCalendarForMonth(selectedYear, selectedMonth);
                setCalendarElements(elements);
                setIsGenerating(false);
                generatingRef.current = false;
            });
        } catch (error) {
            console.error('Error generating calendar:', error);
            setIsGenerating(false);
            generatingRef.current = false;
        }
    }, [selectedYear, selectedMonth, generateCalendarForMonth, getCacheKey]);

    // Pre-generate adjacent months for seamless transitions
    const pregenerateAdjacentMonths = useCallback(() => {
        // Pre-generate next month
        const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
        const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
        
        // Pre-generate previous month
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        
        // Generate immediately for better performance
        generateCalendarForMonth(nextYear, nextMonth);
        generateCalendarForMonth(prevYear, prevMonth);
    }, [selectedMonth, selectedYear, generateCalendarForMonth]);

    // Function to immediately update calendar content
    const updateCalendarContent = useCallback((newMonth: number, newYear: number) => {
        // Immediately generate calendar for the new month
        const cacheKey = getCacheKey(newYear, newMonth);
        if (!calendarCache.has(cacheKey)) {
            // Generate the calendar elements for the new month immediately
            const elements = generateCalendarForMonth(newYear, newMonth);
            setCalendarElements(elements);
        } else {
            // Use cached elements
            setCalendarElements(calendarCache.get(cacheKey)!);
        }
    }, [getCacheKey, generateCalendarForMonth]);

    // Animated month navigation functions
    const animateToNextMonth = useCallback(() => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        
        // Calculate target month and year
        const nextMonth = selectedMonth === 11 ? 0 : selectedMonth + 1;
        const nextYear = selectedMonth === 11 ? selectedYear + 1 : selectedYear;
        
        // Immediately update calendar content
        updateCalendarContent(nextMonth, nextYear);
        
        // Animate out to the left
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: -screenWidth,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Update month state
            setSelectedMonth(nextMonth);
            setSelectedYear(nextYear);
            
            // Reset animation values
            translateX.setValue(screenWidth);
            opacity.setValue(0.5);
            
            // Animate in from the right
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setIsAnimating(false);
            });
        });
    }, [selectedMonth, selectedYear, isAnimating, translateX, opacity, updateCalendarContent]);

    const animateToPreviousMonth = useCallback(() => {
        if (isAnimating) return;
        
        setIsAnimating(true);
        
        // Calculate target month and year
        const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1;
        const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear;
        
        // Immediately update calendar content
        updateCalendarContent(prevMonth, prevYear);
        
        // Animate out to the right
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: screenWidth,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0.5,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Update month state
            setSelectedMonth(prevMonth);
            setSelectedYear(prevYear);
            
            // Reset animation values
            translateX.setValue(-screenWidth);
            opacity.setValue(0.5);
            
            // Animate in from the left
            Animated.parallel([
                Animated.timing(translateX, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                })
            ]).start(() => {
                setIsAnimating(false);
            });
        });
    }, [selectedMonth, selectedYear, isAnimating, translateX, opacity, updateCalendarContent]);

    // PanResponder for swipe detection
    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            const { dx, dy } = gestureState;
            return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10;
        },
        onPanResponderGrant: () => {
            // Pan responder granted
        },
        onPanResponderMove: (evt, gestureState) => {
            const { dx } = gestureState;
            // Follow finger during drag with some resistance
            const resistance = 0.5;
            translateX.setValue(dx * resistance);
            
            // Add subtle opacity change during drag
            const opacityChange = Math.abs(dx) / screenWidth * 0.3;
            opacity.setValue(1 - opacityChange);
        },
        onPanResponderRelease: (evt, gestureState) => {
            const { dx, vx } = gestureState;
            const swipeThreshold = screenWidth * 0.15; // 15% of screen width
            
            if (Math.abs(dx) > swipeThreshold && !isAnimating) {
                if (dx > 0) {
                    animateToPreviousMonth();
                } else {
                    animateToNextMonth();
                }
            } else {
                // Snap back to center with spring animation
                Animated.parallel([
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 150,
                        friction: 6,
                    }),
                    Animated.timing(opacity, {
                        toValue: 1,
                        duration: 150,
                        useNativeDriver: true,
                    })
                ]).start();
            }
        },
        onPanResponderTerminate: () => {
            // Reset to center if gesture is terminated
            Animated.spring(translateX, {
                toValue: 0,
                useNativeDriver: true,
                tension: 150,
                friction: 6,
            }).start();
        },
    }), [translateX, opacity, screenWidth, isAnimating, animateToNextMonth, animateToPreviousMonth]);

    // Effect to generate calendar when month/year/data changes
    useEffect(() => {
        generateCurrentCalendar();
        pregenerateAdjacentMonths();
    }, [generateCurrentCalendar, pregenerateAdjacentMonths]);

    // Update calendar state when initial values change (for navigation restoration)
    useEffect(() => {
        if (initialMonth !== undefined && initialMonth !== selectedMonth) {
            setSelectedMonth(initialMonth);
        }
        if (initialYear !== undefined && initialYear !== selectedYear) {
            setSelectedYear(initialYear);
        }
    }, [initialMonth, initialYear]);

    // Clear cache and regenerate calendar when selectedDate changes to ensure proper highlighting
    useEffect(() => {
        if (selectedDate) {
            // Clear all cache to ensure proper highlighting across all months
            clearCalendarCache();
            
            // Regenerate calendar for the current month with a small delay to prevent rapid successive calls
            setTimeout(() => {
                generateCurrentCalendar();
            }, 50);
        }
    }, [selectedDate, generateCurrentCalendar]);

    // Optimized cache clearing - only clear when watering days actually change
    useEffect(() => {
        if (wateringDays.size > 0) {
            // Only clear cache if watering days have significantly changed
            // This prevents unnecessary cache clearing on minor updates
            const wateringDaysHash = Array.from(wateringDays.keys()).join('|');
            if (wateringDaysHash !== (wateringDays as any)._hash) {
                (wateringDays as any)._hash = wateringDaysHash;
                // Clear cache more selectively - only clear affected months
                // This is a simplified approach; in production you might want more sophisticated cache invalidation
            }
        }
    }, [wateringDays]);

    return (
        <View className=''>
            {/* Calendar Header */}
            <View className="flex flex-row justify-center items-center w-full h-16 mb-4">
                <TouchableOpacity
                    onPress={animateToPreviousMonth}
                    onLongPress={animateToPreviousMonth}
                    className='w-10 h-10 rounded-full flex justify-center items-center'
                    disabled={isAnimating}
                >
                    <Text className='text-2xl text-gray-600'>
                        {"<"}
                    </Text>
                </TouchableOpacity>
                <View className='flex-1 flex flex-row justify-center items-center'>
                    <Text className='text-2xl font-semibold text-gray-900 mr-2'>{months[selectedMonth]}</Text>
                    <Text className='text-2xl font-semibold text-gray-900'>{selectedYear}</Text>
                </View>
                <TouchableOpacity
                    onPress={animateToNextMonth}
                    className='w-10 h-10 rounded-full flex justify-center items-center'
                    disabled={isAnimating}
                >
                    <Text className='text-2xl text-gray-600'>
                        {">"}
                    </Text>
                </TouchableOpacity>
            </View>
            
            {/* Calendar Grid with Animation */}
            <Animated.View 
                className='flex flex-row flex-wrap w-full relative'
                style={{
                    transform: [{ translateX }],
                    opacity,
                }}
                {...panResponder.panHandlers}
            >
                {isGenerating && calendarElements.length === 0 ? (
                    <CalendarSkeleton />
                ) : (
                    calendarElements
                )}
                

            </Animated.View>
        </View>
    );
}

export default CalendarGenerator