import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, TextInput, Platform, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import colors from '@/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface PlantFormData {
  nickname: string;
  lastWatered: Date;
  dateAdded: Date;
}

interface AddPlantModalPropss {
    visible: boolean;
    onClose: () => void;
    onSave: (data: PlantFormData) => void;
    plantName: string;
}

export default function AddPlantModal({visible, onClose, onSave, plantName}: AddPlantModalPropss) {
    
  const [ nickname, setNickname ] = useState(plantName);
  const [ lastWatered, setLastWatered ] = useState(new Date());
  const [ datePickerVisible, setDatePickerVisible ] = useState(false);
  
  const dismissKeyboard = () => {
      Keyboard.dismiss();
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setDatePickerVisible(Platform.OS === "ios");

    if(selectedDate) {
      setLastWatered(selectedDate)
    }
  };

  const handleSave = () => {
    const plantData: PlantFormData = {
      nickname: nickname.trim() || plantName.trim(),
      lastWatered: lastWatered,
      dateAdded: new Date()
    };

    if(!plantData.lastWatered) {
      plantData.lastWatered = new Date();
    };

    onSave(plantData);

    setNickname('');
    setLastWatered(new Date());
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType='slide'
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className='bg-background-primary px-6 py-4'>
          <View className='flex-col justify-start h-full'>
            {/* Header */}
            <View className='items-center'>
              <Text className='text-text-primary text-3xl font-bold mb-2 text-center'>
                Let's add your new plant to Your Garden
              </Text>
              <Text className='text-text-secondary text-lg text-center'>
                First, we just need some information
              </Text>
            </View>
            {/* Form Fields */}
            <View className='flex-1 justify-center h-2/6'>
              <View className=''>
                <Text className='text-text-primary text-xl text-center mb-2'>Name your plant</Text>
                <TextInput
                  placeholder="Enter the plant's name"
                  placeholderTextColor={colors.text.secondary}
                  value={nickname}
                  onChangeText={setNickname}
                  className='text-text-primary text-center text-lg p-4 rounded-xl bg-background-surface border border-primary-medium'
                />
              </View>

              <View className='mt-6'>
                <Text className='text-text-primary text-xl mb-2 text-center'>Last watered</Text>
                <TouchableOpacity
                  onPress={() => setDatePickerVisible(true)}
                  className='p-4 rounded-xl bg-background-surface border border-primary-medium'
                >
                  <Text className='text-text-primary text-lg text-center'>
                    {lastWatered.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                {datePickerVisible && (
                  <DateTimePicker
                    value={lastWatered}
                    mode='date'
                    display='calendar'
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View className='mt-4'>
              <TouchableOpacity 
                onPress={handleSave}
                className='bg-secondary-deep p-4 rounded-xl'
              >
                <Text className='text-text-primary text-xl text-center font-bold'>
                  Add Plant
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={onClose}
                className='bg-background-surface p-4 rounded-xl border border-danger'
              >
                <Text className='text-danger text-xl text-center font-bold'>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}