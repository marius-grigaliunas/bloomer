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
import { UserMessageType } from '@/interfaces/interfaces';

interface ContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (userMessage: UserMessageType) => void;
  userEmail?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({
  visible,
  onClose,
  onSubmit,
  userEmail = '',
}) => {
  const [formData, setFormData] = useState({
    email: userEmail,
    message: '',
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
    if (!formData.email.trim() || !formData.message.trim()) {
      Alert.alert('Required Fields', 'Please fill in both email and message fields.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      // Reset form after successful submission
      setFormData({
        email: userEmail,
        message: '',
      });
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: userEmail,
      message: '',
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
              <View className="w-10 h-10 bg-info rounded-full items-center justify-center mr-3">
                <AntDesign name="mail" size={20} color="white" />
              </View>
              <Text className="text-xl font-semibold text-text-primary">Contact Us</Text>
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
                Have a question, suggestion, or feedback? We'd love to hear from you! 
                Send us a message and we'll get back to you as soon as possible.
              </Text>

              {/* Email Field */}
              <View className="mb-4">
                <Text className="text-text-primary font-medium mb-2">
                  Email Address <Text className="text-danger">*</Text>
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Message Field */}
              <View className="mb-6">
                <Text className="text-text-primary font-medium mb-2">
                  Message <Text className="text-danger">*</Text>
                </Text>
                <TextInput
                  className="bg-background-surface p-4 rounded-xl text-text-primary border border-gray-200"
                  value={formData.message}
                  onChangeText={(text) => handleInputChange('message', text)}
                  placeholder="Tell us what's on your mind..."
                  placeholderTextColor={colors.text.secondary}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  maxLength={1000}
                />
                <Text className="text-text-secondary text-sm mt-2 text-right">
                  {formData.message.length}/1000 characters
                </Text>
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
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={handleSubmit}
                className="flex-1 bg-info p-4 rounded-xl"
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
                    <AntDesign name="loading1" size={20} color="white" className="mr-2" />
                  ) : (
                    <AntDesign name="arrowright" size={20} color="white" className="mr-2" />
                  )}
                  <Text className="text-white text-center text-lg font-semibold ml-2">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
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

export default ContactModal;
