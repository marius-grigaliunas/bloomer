import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { translate } from '@/lib/i18n/config';

interface DeletePlantModalProps {
    visible: boolean;
    onClose: () => void;
    onDelete: () => void;
    plantName?: string;
}

export default function DeletePlantModal({ visible, onClose, onDelete, plantName }: DeletePlantModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  }

  const handleDelete = () => {
    setIsDeleting(true);
    onDelete();
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
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-lg">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-2xl bg-danger/10 items-center justify-center mr-3">
                    <Ionicons name="trash-outline" size={20} color="#E53935" />
                  </View>
                  <Text className="text-text-primary text-xl font-semibold">
                    {translate('deletePlantModal.title')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                  disabled={isDeleting}
                >
                  <Ionicons name="close" size={16} color="#666666" />
                </TouchableOpacity>
              </View>

              {/* Warning Message */}
              <View className="mb-6">
                <Text className="text-text-primary text-lg font-semibold mb-3 text-center">
                  {plantName ? translate('deletePlantModal.deletePlantName').replace('{name}', plantName) : translate('deletePlantModal.deleteThisPlant')}
                </Text>
                <Text className="text-text-secondary text-sm text-center leading-5">
                  {translate('deletePlantModal.confirmationMessage')}
                </Text>
              </View>

              {/* Action Buttons */}
              <View className="gap-3">
                <TouchableOpacity 
                  onPress={handleDelete}
                  disabled={isDeleting}
                  className="p-4 rounded-xl items-center bg-danger"
                >
                  <Text className="text-white text-lg font-semibold">
                    {isDeleting ? translate('deletePlantModal.deleting') : translate('deletePlantModal.deleteButton')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleClose}
                  className="p-4 rounded-xl items-center border border-gray-200"
                  disabled={isDeleting}
                >
                  <Text className="text-text-secondary text-lg font-medium">
                    {translate('deletePlantModal.cancel')}
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

