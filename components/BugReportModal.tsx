import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '@/constants/colors';
import AntDesign from '@expo/vector-icons/AntDesign';
import { BugReportType } from '@/interfaces/interfaces';
import { translate } from '@/lib/i18n/config';

interface BugReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (bugReport: BugReportType) => void;
}

const BugReportModal: React.FC<BugReportModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    deviceInfo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert(translate('bugReportModal.requiredFields'), translate('bugReportModal.fillTitleAndDescription'));
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        deviceInfo: '',
      });
      onClose();
    } catch (error) {
      Alert.alert(translate('bugReportModal.error'), translate('bugReportModal.failedToSubmit'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: '',
      deviceInfo: '',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="bg-background-primary flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-warning rounded-full items-center justify-center mr-3">
                <AntDesign name="exclamation-circle" size={20} color="white" />
              </View>
              <Text className="text-xl font-semibold text-text-primary">{translate('bugReportModal.title')}</Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className="w-8 h-8 items-center justify-center"
            >
              <AntDesign name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="p-4">
              <Text className="text-text-secondary text-base mb-6">
                {translate('bugReportModal.description')}
              </Text>

              {/* Title Field */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-2">
                  {translate('bugReportModal.bugTitleLabel')} <Text className="text-danger">*</Text>
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  placeholder={translate('bugReportModal.bugTitlePlaceholder')}
                  placeholderTextColor={colors.text.secondary}
                  maxLength={100}
                />
              </View>

              {/* Description Field */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-2">
                  {translate('bugReportModal.descriptionLabel')} <Text className="text-danger">*</Text>
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  placeholder={translate('bugReportModal.descriptionPlaceholder')}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Steps to Reproduce */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-2">
                  {translate('bugReportModal.stepsToReproduceLabel')}
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.stepsToReproduce}
                  onChangeText={(text) => handleInputChange('stepsToReproduce', text)}
                  placeholder={translate('bugReportModal.stepsToReproducePlaceholder')}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              {/* Expected Behavior */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-2">
                  {translate('bugReportModal.expectedBehaviorLabel')}
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.expectedBehavior}
                  onChangeText={(text) => handleInputChange('expectedBehavior', text)}
                  placeholder={translate('bugReportModal.expectedBehaviorPlaceholder')}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Actual Behavior */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-2">
                  {translate('bugReportModal.actualBehaviorLabel')}
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.actualBehavior}
                  onChangeText={(text) => handleInputChange('actualBehavior', text)}
                  placeholder={translate('bugReportModal.actualBehaviorPlaceholder')}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Device Info */}
              <View className="mb-6">
                <Text className="text-text-primary font-medium mb-2">
                  {translate('bugReportModal.deviceInfoLabel')}
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.deviceInfo}
                  onChangeText={(text) => handleInputChange('deviceInfo', text)}
                  placeholder={translate('bugReportModal.deviceInfoPlaceholder')}
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View className="p-4 border-t border-gray-200">
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleClose}
                className="flex-1 bg-background-surface p-4 rounded-xl border border-gray-200"
                disabled={isSubmitting}
              >
                <Text className="text-text-primary text-center text-lg font-medium">
                  {translate('bugReportModal.cancel')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-warning p-4 rounded-xl"
                disabled={isSubmitting}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center justify-center">
                  {isSubmitting ? (
                    <AntDesign name="loading" size={20} color="white" className="mr-2" />
                  ) : (
                    <AntDesign name="arrow-right" size={24} color="white" className="mr-2" />
                  )}
                  <Text className="text-white text-center text-lg font-semibold ml-2">
                    {isSubmitting ? translate('bugReportModal.submitting') : translate('bugReportModal.submitReport')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default BugReportModal;
