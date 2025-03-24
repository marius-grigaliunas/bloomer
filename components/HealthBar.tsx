import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '@/constants/colors';

const HealthBar = () => {
    const [healthStatus, setHealthStatus] = useState<string>("bad");
    const [healthColor, setHealthColor] = useState<string>(colors.secondary.deep);

    const numberOfPlants = 5;
    const plantsNeedCare = 4;

    useEffect(() => {
         const CalculateHealth = (numberOfPlants: number, plantsNeedCare: number) => {
            const result = plantsNeedCare / numberOfPlants;

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

         CalculateHealth(numberOfPlants, plantsNeedCare);
         CheckColor(healthStatus);

    }, [healthStatus, plantsNeedCare])

    return (
        <View className="h-20 rounded-xl p-4 " 
        style={{backgroundColor: `${healthColor}`}}
        >
            <View className="mx-4 h-20 flex flex-row justify-around items-center ">
                {
                    healthStatus === "bad" ? (
                        <Text className='text-3xl text-text-primary'>
                            Hey! {plantsNeedCare} Plants need your attention!  
                        </Text>
                    ) : healthStatus === "normal" ? (
                        <Text className='text-3xl text-text-primary'>
                            {plantsNeedCare} Plants need your attention.
                        </Text>
                    ) : plantsNeedCare > 0 ? (plantsNeedCare > 1) ? (
                        <Text className='text-3xl text-text-primary'>
                            Great! Only {plantsNeedCare} Plants need your attention.  
                        </Text>
                    ) : (
                        <Text className='text-3xl text-text-primary'>
                            Great! Only {plantsNeedCare} Plant need your attention.  
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