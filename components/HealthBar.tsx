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

    if(numberOfPlants === 0) {
        return <View></View>;
    }

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
        <View className=" rounded-xl shadow-lg shadow-slate-50" 
        style={{backgroundColor: `${healthColor}`}}
        >
            <View className="mx-2 h-10 flex flex-row justify-start items-center ">
                {
                    healthStatus === "bad" ? (
                        <Text className='text-3xl text-text-primary'>
                            {plantsThatNeedCare} Plants need your attention!  
                        </Text>
                    ) : healthStatus === "normal" ? (
                        <Text className='text-3xl text-text-primary'>
                            {plantsThatNeedCare} Plants need your attention.
                        </Text>
                    ) : plantsThatNeedCare > 0 ? (plantsThatNeedCare > 1) ? (
                        <Text className='text-3xl text-text-primary'>
                            Only {plantsThatNeedCare} Plants need your attention.  
                        </Text>
                    ) : (
                        <Text className='text-3xl text-text-primary'>
                            Only {plantsThatNeedCare} Plant needs your attention.  
                        </Text>
                    ) : (
                        <Text className='text-3xl text-text-primary'>
                            Perfect! Your Plants are flourishing.
                        </Text>
                    )
                }
                <Text className='ml-3 text-3xl text-text-primary'>{plantsThatNeedCare}/{numberOfPlants}</Text>
            </View>
        </View>
    )
}

export default HealthBar