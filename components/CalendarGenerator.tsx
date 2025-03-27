import { View, Text } from 'react-native'
import React, { ReactNode, useEffect, useState } from 'react'

const CalendarGenerator = () => {

    const [calendarElements, setCalendarElements] = useState<ReactNode[]>([])

    const date = new Date();
  
    let year = date.getFullYear();
    let month = date.getMonth();
    let today = date.getDate();
          
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
          "September", "October", "November", "December"];
        
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        
    const dateDate = `${today}-${month}-${year}`;
    let selectedDate = `${today}-${month}-${year}`;

  
      
      const generateCalendar = () => {
          const newElements: ReactNode[] = [];
  
  
          //get the last date of the previous month
          let dateLast_MonthPrev = new Date(year, month, 0).getDate();
          //get the last date of the month
          let dateLast = new Date(year, month+1, 0).getDate();
          
          // get the name of the first day of the month. 0 - sunday, 1- monday ...
          let dayFirst = new Date(year, month, 1).getDay();
          //get the name of the last day of the month
          let dayLast = new Date(year, month, dateLast).getDay();
  
          days.slice(1).map(day => {
              const element = (
                  <View key={day}
                      className='border border-text-primary text-text-primary p-1 w-[14.28%]'
                  >
                      <Text className='text-text-primary'>
                          {day.slice(0, 2)}
                      </Text>    
                  </View>
              );
  
              newElements.push(element);
          })
  
          const elementSun = (
              <View key={days[0]}
                  className='border border-text-primary text-text-primary p-1 w-[14.28%]'
              >
                  <Text className='text-text-primary'>
                      {days[0].slice(0, 2)}
                  </Text>    
              </View>
          );
  
          newElements.push(elementSun);
  
          for(let i = 1; i <= dateLast; i++) {
                  let day = new Date(year, month, i).getDay();
              
              // if first day of the months isn't monday fill it with the last month's dates
              if(i === 1 && day !== 1) {
                  let lastMonthDate;
              
                  if(day !== 0) {
                      lastMonthDate = dateLast_MonthPrev - day + 1;
                  } else {
                      lastMonthDate = dateLast_MonthPrev - 7 + 1;
                      dayFirst = 7;
                  }
              
                  for(let j = 1; j < dayFirst; j++) {
                      if(j === 6) {
                          //calendar.insertAdjacentHTML('beforeend', `
                          // <div id="${lastMonthDate + j}-${month === 0 ? 11 : month-1}-${month === 0? year-- : year}" 
                          //  class="day weekend last-month"
                          // >
                          // ${lastMonthDate + j}
                          // </div>`); 
                          const element = (
                              <View key={`${lastMonthDate + j}-${month === 0 ? 11 : month-1}-${month === 0? year-- : year}`}
                                  className='border border-text-secondary text-text-secondary p-1 w-[14.28%]'
                              >
                                  <Text className='text-text-secondary'>
                                      {lastMonthDate + j}
                                  </Text>    
                              </View>
                          )
                          newElements.push(element);
                      } else {
                          //calendar.insertAdjacentHTML('beforeend', `
                          // <div 
                          //  id="${lastMonthDate + j}-${month === 0 ? 11 : month-1}-${month === 0? year-- : year}"  
                          //  class="day workday last-month"
                          // >
                          //  ${lastMonthDate + j}
                          // </div>`);
                          const element = (
                              <View key={`${lastMonthDate + j}-${month === 0 ? 11 : month-1}-${month === 0? year-- : year}`}
                                  className='border border-text-primary p-1 w-[14.28%]'
                              >
                                  <Text className='text-text-secondary'>
                                      {lastMonthDate + j}
                                  </Text>
                              </View>
                          )
  
                          newElements.push(element);
                      }        
                  }
              
              }
  
          // if day is weekend day name different classes for coloring
              if(day === 0 || day === 6) {
                  if(i === today && month.toString() == dateDate.split('-')[1]) {
                      //calendar.insertAdjacentHTML('beforeend', `
                      // <div id="${i}-${month}-${year}" 
                      //  class="day today weekend"
                      // >
                      // ${i}
                      // </div>`);
                      const element = (
                          <View key={`${i}-${month}-${year}`}
                              className='border border-text-primary p-1 w-[14.28%]'
                          >
                              <Text className='text-text-primary'>
                                  {i}
                              </Text>
                          </View>
                      )
                      newElements.push(element);
                  } else {
                      //calendar.insertAdjacentHTML('beforeend', `<div id="${i}-${month}-${year}" class="day weekend">${i}</div>`);
                      const element = (    
                          <View key={`${i}-${month}-${year}`}
                              className='border border-text-primary p-1 w-[14.28%]'
                          >
                              <Text className='text-text-secondary'>
                                  {i}
                              </Text>
                          </View>
                      )
                      newElements.push(element);
                  } 
              } else {
                  if(i === today && month.toString() == dateDate.split('-')[1]) {
                      //calendar.insertAdjacentHTML('beforeend', `<div id="${i}-${month}-${year}" class="day today workday">${i}</div>`);
                      
                      const element = (
                          <View key={`${i}-${month}-${year}`}
                              className='border border-text-primary bg-accent p-1 w-[14.28%]'
                          >
                              <Text className='text-text-primary'>
                                  {i}
                              </Text>
                          </View>
                      )
                      newElements.push(element)
                  } else {
                      //calendar.insertAdjacentHTML('beforeend', `<div id="${i}-${month}-${year}" class="day workday">${i}</div>`);
                  const element = (
                      <View key={`${i}-${month}-${year}`}
                          className='border border-text-primary p-1 w-[14.28%]'
                          >
                          <Text className='text-text-primary'>
                              {i}
                          </Text>
                      </View>
                  )
                  newElements.push(element);
                  
                  }
              }
          }
      
          //if the last day of the month isn't sunday, fill the rest of the week with the next month dates 
          if(dayLast !== 0) {
              for(let i = dayLast + 1; i <= 7; i++) {
                  if(i === 6 || i === 7) {
                      //calendar.insertAdjacentHTML('beforeend', `<div id="${i}-${month === 11 ? 0 : month+1}-${month === 11 ? year+1 : year}" class="day weekend next-month">${i - dayLast}</div>`); 
                      const element = (
                          <View key={`${i}-${month === 11 ? 0 : month+1}-${month === 11 ? year+1 : year}`}
                              className='border border-text-secondary text-text-secondary p-1 w-[14.28%]'
                          >
                              <Text className='text-text-secondary'>
                                  {i - dayLast}
                              </Text>    
                          </View>
                      )
                      newElements.push(element);
                  } else {
                      //calendar.insertAdjacentHTML('beforeend', `<div id="${i}-${month === 11 ? 0 : month+1}-${month === 11 ? year+1 : year}" class="day workday next-month">${i - dayLast}</div>`);
                      const element = (
                          <View key={`${i}-${month === 11 ? 0 : month+1}-${month === 11 ? year+1 : year}`}
                              className='border border-text-secondary text-text-secondary p-1 w-[14.28%]'
                          >
                              <Text className='text-text-secondary'>
                                  {i - dayLast}
                              </Text>    
                          </View>
                      )
                      newElements.push(element);
                  }
              }
          }
  
          setCalendarElements(newElements);
      };
  
    
      useEffect(() => {
          generateCalendar();
  
          return () => setCalendarElements([]);
      }, [])
  
      

  return (
    <View className='flex flex-1 flex-row w-full flex-wrap items-center justify-center'>
        {calendarElements}
    </View>
  )
}

export default CalendarGenerator