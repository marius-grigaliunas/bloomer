import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import colors from '@/constants/colors';

interface RenamePlantModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    plantName: string;
}

export default function RenamePlantModal({visible, onClose, onSave, plantName}: RenamePlantModalProps) {
  const [ nickname, setNickname ] = useState(plantName);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }
  
  const handleSave = () => {
    onSave(nickname)

    setNickname("");
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
                Rename your plant
              </Text>
            </View>

            {/* Form Fields */}
            <View className='flex-1 justify-center'>
              <View>
                <Text className='text-text-primary text-xl text-center mb-2'>New name</Text>
                <TextInput
                  placeholder="Enter new name"
                  placeholderTextColor={colors.text.secondary}
                  value={nickname}
                  onChangeText={setNickname}
                  className='text-text-primary text-center text-lg p-4 rounded-xl bg-background-surface border border-primary-medium'
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View className='mt-4'>
              <TouchableOpacity 
                onPress={handleSave}
                className='bg-secondary-deep p-4 rounded-xl mb-2'
              >
                <Text className='text-text-primary text-xl text-center font-bold'>
                  Save
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