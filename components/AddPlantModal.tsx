import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, TextInput, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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
        <View>
          <View>
            <Text className='text-text-primary'>Add to Your Garden</Text>
            
            <View>
              <Text className='text-text-primary'>Name your plant</Text>
              <TextInput
                placeholder="Enter the plant's name"
                placeholderTextColor={colors.text.secondary}
                value='nickname'
                onChangeText={setNickname}
                className='text-text-primary'
              />
            </View>

            <View>
              <Text className='text-text-primary'>When was the last time the plant was watered</Text>

              <TouchableOpacity
                onPress={() => setDatePickerVisible(true)}  
              >
                <Text className='text-text-primary'>
                  {lastWatered.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              {datePickerVisible && (
                <DateTimePicker
                  value={lastWatered}
                  mode='date'
                  display='default'
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  className='text-text-primary'
                />
              )}
            </View>

            <View>
              <TouchableOpacity 
                onPress={onClose}
              >
                <Text className='text-danger'>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={handleSave}
              >
                <Text className='text-secondary-medium'>Add Plant</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}