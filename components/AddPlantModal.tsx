import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, TextInput, Platform, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { translate } from '@/lib/i18n/config';

export interface PlantFormData {
  nickname: string;
  lastWatered: Date;
  dateAdded: Date;
}

interface AddPlantModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (data: PlantFormData) => void;
    plantName: string;
}

export default function AddPlantModal({visible, onClose, onSave, plantName}: AddPlantModalProps) {
    
  const [ nickname, setNickname ] = useState(plantName);
  const [ lastWatered, setLastWatered ] = useState(new Date());
  const [ datePickerVisible, setDatePickerVisible ] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (visible) {
      setNickname(plantName);
      setLastWatered(new Date());
    }
  }, [visible, plantName]);
  
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
    }

    onSave(plantData);
  }

  const handleClose = () => {
    setNickname(plantName);
    setLastWatered(new Date());
    onClose();
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-lg">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-primary-medium/10 items-center justify-center mr-3">
                    <Ionicons name="add-circle" size={20} color="#4F772D" />
                  </View>
                  <Text className="text-text-primary text-xl font-semibold">
                    {translate('addPlantModal.title')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={16} color="#666666" />
                </TouchableOpacity>
              </View>

              {/* Plant Name Input */}
              <View className="mb-6">
                <Text className="text-text-secondary text-sm font-medium mb-2">
                  {translate('addPlantModal.plantNameLabel')}
                </Text>
                <TextInput
                  placeholder={translate('addPlantModal.plantNamePlaceholder')}
                  placeholderTextColor="#999999"
                  value={nickname}
                  onChangeText={setNickname}
                  className="text-text-primary text-base p-4 rounded-xl bg-background-surface border border-gray-200 focus:border-primary-medium"
                  autoFocus={true}
                />
              </View>

              {/* Last Watered Date Picker */}
              <View className="mb-6">
                <Text className="text-text-secondary text-sm font-medium mb-2">
                  {translate('addPlantModal.lastWateredLabel')}
                </Text>
                <TouchableOpacity
                  onPress={() => setDatePickerVisible(true)}
                  className="p-4 rounded-xl bg-background-surface border border-gray-200"
                >
                  <View className="flex-row items-center justify-between">
                    <Text className="text-text-primary text-base">
                      {lastWatered.toLocaleDateString()}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color="#666666" />
                  </View>
                </TouchableOpacity>

                {datePickerVisible && (
                  <DateTimePicker
                    value={lastWatered}
                    mode='date'
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    maximumDate={new Date()}
                  />
                )}
              </View>

              {/* Action Buttons */}
              <View className="space-y-3">
                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={!nickname.trim()}
                  className={`p-4 rounded-xl items-center ${
                    nickname.trim() ? 'bg-primary-medium' : 'bg-gray-300'
                  }`}
                >
                  <Text className={`text-lg font-semibold ${
                    nickname.trim() ? 'text-white' : 'text-gray-500'
                  }`}>
                    {translate('addPlantModal.addButton')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleClose}
                  className="p-4 rounded-xl items-center border border-gray-200"
                >
                  <Text className="text-text-secondary text-lg font-medium">
                    {translate('common.cancel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}