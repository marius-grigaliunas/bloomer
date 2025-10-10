import { View, Text, Modal, TouchableWithoutFeedback, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';

interface RenamePlantModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    plantName: string;
}

export default function RenamePlantModal({visible, onClose, onSave, plantName}: RenamePlantModalProps) {
  const [ nickname, setNickname ] = useState(plantName);

  // Reset nickname when modal opens with new plant name
  useEffect(() => {
    if (visible) {
      setNickname(plantName);
    }
  }, [visible, plantName]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }
  
  const handleSave = () => {
    if (nickname.trim()) {
      onSave(nickname.trim());
      setNickname("");
    }
  }

  const handleClose = () => {
    setNickname(plantName); // Reset to original name
    onClose();
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType='fade'
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View 
            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-lg"
            onStartShouldSetResponder={() => true}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-primary-medium/10 items-center justify-center mr-3">
                    <Ionicons name="create-outline" size={20} color="#4F772D" />
                  </View>
                  <Text className="text-text-primary text-xl font-semibold">
                    Rename Plant
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Ionicons name="close" size={16} color="#666666" />
                </TouchableOpacity>
              </View>

              {/* Current Name Display */}
              <View className="mb-4">
                <Text className="text-text-secondary text-sm font-medium mb-2">
                  Current name
                </Text>
                <View className="bg-gray-50 rounded-xl p-3">
                  <Text className="text-text-primary text-base font-medium">
                    {plantName}
                  </Text>
                </View>
              </View>

              {/* New Name Input */}
              <View className="mb-6">
                <Text className="text-text-secondary text-sm font-medium mb-2">
                  New name
                </Text>
                <TextInput
                  placeholder="Enter new name"
                  placeholderTextColor="#999999"
                  value={nickname}
                  onChangeText={setNickname}
                  className="text-text-primary text-base p-4 rounded-xl bg-background-surface border border-gray-200 focus:border-primary-medium"
                  autoFocus={true}
                  returnKeyType="done"
                  onSubmitEditing={handleSave}
                />
              </View>

              {/* Action Buttons */}
              <View className="space-y-3">
                <TouchableOpacity 
                  onPress={handleSave}
                  disabled={!nickname.trim() || nickname.trim() === plantName}
                  className={`p-4 rounded-xl items-center ${
                    nickname.trim() && nickname.trim() !== plantName 
                      ? 'bg-primary-medium' 
                      : 'bg-gray-300'
                  }`}
                >
                  <Text className={`text-lg font-semibold ${
                    nickname.trim() && nickname.trim() !== plantName 
                      ? 'text-white' 
                      : 'text-gray-500'
                  }`}>
                    Save Changes
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleClose}
                  className="p-4 rounded-xl items-center border border-gray-200"
                >
                  <Text className="text-text-secondary text-lg font-medium">
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