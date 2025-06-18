import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '@/constants/colors';

interface HealthBarProps {
    numberOfPlants: number;
    plantsThatNeedCare: number;
}

const HealthBar = ({numberOfPlants, plantsThatNeedCare}:HealthBarProps) => {
    const [healthStatus, setHealthStatus] = useState<string>("bad");
    const [healthColor, setHealthColor] = useState<string>(colors.secondary.deep);

    useEffect(() => {
        if (numberOfPlants === 0) return;

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

        const CheckColor = (health: string) => {
            switch(health) {
                case "good":
                    setHealthColor(colors.secondary.deep);
                    break;
                case "normal":
                    setHealthColor(colors.primary.deep);
                    break;
                case "bad":
                    setHealthColor(colors.danger);                
                    break;
            }
        }

        CalculateHealth(numberOfPlants, plantsThatNeedCare);
        CheckColor(healthStatus);
    }, [healthStatus, numberOfPlants, plantsThatNeedCare]);

    if(numberOfPlants === 0) {
        return null;
    }

    const getMessage = () => {
        if (healthStatus === "bad") {
            return `${plantsThatNeedCare} Plants need your attention!`;
        } else if (healthStatus === "normal") {
            return `${plantsThatNeedCare} Plants need your attention`;
        } else if (plantsThatNeedCare > 1) {
            return `Only ${plantsThatNeedCare} Plants need your attention`;
        } else if (plantsThatNeedCare === 1) {
            return `Only ${plantsThatNeedCare} Plant needs your attention`;
        } else {
            return "Your Plants are flourishing";
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: healthColor }]}>
            <View style={styles.contentContainer}>
                <Text style={styles.messageText}>
                    {getMessage()}
                </Text>
                <Text style={styles.countText}>
                    {plantsThatNeedCare}/{numberOfPlants}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    contentContainer: {
        marginHorizontal: 8,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    messageText: {
        fontSize: 24,
        color: colors.text.primary,
        flex: 1,
    },
    countText: {
        fontSize: 24,
        color: colors.text.primary,
        marginLeft: 12,
    }
});

export default HealthBar;