import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '@/constants/colors';

interface HealthBarProps {
    numberOfPlants: number;
    plantsThatNeedCare: number;
}

const HealthBar = ({numberOfPlants, plantsThatNeedCare}:HealthBarProps) => {
    const [healthStatus, setHealthStatus] = useState<string>("bad");
    const [healthColor, setHealthColor] = useState<string>(colors.secondary.deep);


    useEffect(() => {
         const CalculateHealth = (plantCount: number, plantsNeedCare: number) => {
            const result = plantsNeedCare / plantCount;

            if(result < 0.33) {
                setHealthStatus("good");
            } else if (result < 0.66) {
                setHealthStatus("normal");
            } else {
                setHealthStatus("bad");
            }
         }

         const CheckColor = (health: string) =>{
            switch(health) {
                case "good": {
                    setHealthColor(`${colors.secondary.deep}`);
                    break;
                }
                case "normal": {
                    setHealthColor(`${colors.primary.deep}`);
                    break;
                }
                case "bad": {
                    setHealthColor(`${colors.danger}`);                
                    break;
                }
            }
        }

         CalculateHealth(numberOfPlants, plantsThatNeedCare);
         CheckColor(healthStatus);

    }, [healthStatus, numberOfPlants, plantsThatNeedCare])

    return (
        <View className=" rounded-xl p-4 " 
        style={{backgroundColor: `${healthColor}`}}
        >
            <View className="mx-4 h-24 flex flex-row justify-around items-center ">
                {
                    healthStatus === "bad" ? (
                        <Text className='text-3xl text-text-primary'>
                            Hey! {plantsThatNeedCare} Plants need your attention!  
                        </Text>
                    ) : healthStatus === "normal" ? (
                        <Text className='text-3xl text-text-primary'>
                            {plantsThatNeedCare} Plants need your attention.
                        </Text>
                    ) : plantsThatNeedCare > 0 ? (plantsThatNeedCare > 1) ? (
                        <Text className='text-3xl text-text-primary'>
                            Great! Only {plantsThatNeedCare} Plants need your attention.  
                        </Text>
                    ) : (
                        <Text className='text-3xl text-text-primary'>
                            Great! Only {plantsThatNeedCare} Plant need your attention.  
                        </Text>
                    ) : (
                        <Text className='text-3xl text-text-primary'>
                            Perfect! Your Plants are flourishing.
                        </Text>
                    )
                }
            </View>
        </View>
    )
}

export default HealthBar