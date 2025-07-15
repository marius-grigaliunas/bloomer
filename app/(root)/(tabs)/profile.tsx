import { View, Text, ScrollView, TouchableOpacity, Alert, Switch, TextInput, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logout, updatePreferences } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalProvider';
import { DatabaseUserType } from '@/interfaces/interfaces';
import { Picker } from '@react-native-picker/picker';
import colors from '@/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
const Profile: React.FC = () => {
  const { refetch, isLoggedIn, user: contextUser, databaseUser } = useGlobalContext();

  // Always normalize to HH:mm
  const extractTime = (value?: string) => {
    if (!value) return '';
    if (/^\d{2}:\d{2}$/.test(value)) return value;
    const isoMatch = value.match(/T(\d{2}):(\d{2})/);
    if (isoMatch) {
      return `${isoMatch[1]}:${isoMatch[2]}`;
    }
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  };

  const [userSettings, setUserSettings] = useState<Partial<DatabaseUserType>>({
    displayName: contextUser?.name || '',
    notificationsEnabled: databaseUser?.notificationsEnabled,
    notificationTime: extractTime(databaseUser?.notificationTime), // always normalized to HH:mm
    timezone: databaseUser?.timezone,
    reminderAdvanceTime: databaseUser?.reminderAdvanceTime,
    unitSystem: databaseUser?.unitSystem,
    mondayFirstDayOfWeek: databaseUser?.mondayFirstDayOfWeek,
    temperatureUnit: databaseUser?.temperatureUnit
  });

  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSettingChange = (setting: keyof DatabaseUserType, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      // Format as "HH:mm" and save only this string
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      handleSettingChange('notificationTime', `${hours}:${minutes}`);
    }
  };

  const pickerStyle = {
    color: Platform.select({
      ios: colors.text.primary,
      android: colors.text.primary
    }),
    backgroundColor: Platform.select({
      ios: colors.background.surface,
      android: 'transparent'
    })
  };

  const renderPersonalSection = () => (
    <View className="bg-background-surface p-4 rounded-xl mb-4">
      <Text className="text-lg text-text-primary mb-2">Personal Information</Text>
      <TextInput
        className="bg-background-primary p-2 rounded text-text-primary"
        value={userSettings.displayName}
        onChangeText={(text) => handleSettingChange('displayName', text)}
        placeholder="Display Name"
        placeholderTextColor={colors.text.secondary}
      />
    </View>
  );

  const renderNotificationSection = () => (
    <View className="bg-background-surface p-4 rounded-xl mb-4">
      <Text className="text-lg text-text-primary mb-2">Notifications</Text>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text-primary">Enable Notifications</Text>
        <Switch
          value={userSettings.notificationsEnabled}
          onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
        />
      </View>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text-primary">Notification Time</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          className="bg-background-primary p-2 rounded mb-2 w-1/6"
        >
          <Text className="text-text-primary text-right">
            {userSettings.notificationTime || "Set Time"}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={
              userSettings.notificationTime && /^\d{2}:\d{2}$/.test(userSettings.notificationTime)
                ? (() => {
                    const [h, m] = userSettings.notificationTime.split(':');
                    const d = new Date();
                    d.setHours(Number(h));
                    d.setMinutes(Number(m));
                    d.setSeconds(0);
                    d.setMilliseconds(0);
                    return d;
                  })()
                : new Date()
            }
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
      {/*
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-text-primary">Reminder before watering (hours)</Text>
        <TextInput
          className="bg-background-primary p-2 rounded text-text-primary w-1/6 text-right"
          value={String(userSettings.reminderAdvanceTime)}
          onChangeText={(text) => handleSettingChange('reminderAdvanceTime', parseInt(text))}
          placeholder="Reminder Hours in Advance"
          keyboardType="numeric"
          placeholderTextColor={colors.text.secondary}
        />
      </View>
      */}
    </View>
  );

  const renderPreferencesSection = () => (
    <View className="bg-background-surface p-4 rounded-xl mb-4">
      <Text className="text-lg text-text-primary mb-2">Preferences</Text>
      <View className="mb-2">
        <Text className="text-text-primary mb-1">Unit System</Text>
        <View className="bg-background-primary rounded">
          <Picker
            selectedValue={userSettings.unitSystem}
            onValueChange={(value) => handleSettingChange('unitSystem', value)}
            style={pickerStyle}
            dropdownIconColor={colors.text.primary}
            mode="dropdown"
          >
            <Picker.Item label="Metric" value="metric" />
            <Picker.Item label="Imperial" value="imperial" />
          </Picker>
        </View>
      </View>
      <View className="mb-2">
        <Text className="text-text-primary mb-1">Temperature Unit</Text>
        <View className="bg-background-primary rounded">
          <Picker
            selectedValue={userSettings.temperatureUnit}
            onValueChange={(value) => handleSettingChange('temperatureUnit', value)}
            style={pickerStyle}
            dropdownIconColor={colors.text.primary}
            mode="dropdown"
          >
            <Picker.Item label="Celsius" value="celsius" />
            <Picker.Item label="Fahrenheit" value="fahrenheit" />
          </Picker>
        </View>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-text-primary">Monday as First Day</Text>
        <Switch
          value={userSettings.mondayFirstDayOfWeek}
          onValueChange={(value) => handleSettingChange('mondayFirstDayOfWeek', value)}
        />
      </View>
    </View>
  );

  const handleSaveSettings = async () => {
    try {
      if (!contextUser) return;
      // Always save notificationTime as HH:mm string
      const settingsToSave = {
        ...userSettings,
        notificationTime: extractTime(userSettings.notificationTime)
      };
      const result = await updatePreferences(contextUser.$id, settingsToSave);
      if (result) {
        Alert.alert('Success', 'Settings saved successfully');
        refetch?.();
      } else {
        Alert.alert('Error', 'Failed to save settings, failed to update the database');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to save settings, ${error}`);
      console.log('Error', `Failed to save settings, ${error}`);
    }
  };

  const handleSignOut = async () => {
    const result = await logout();
    if (result) {
      console.log("SignOut Successful");
      refetch();
    } else {
      console.log("SignOut Failed");
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="bg-background-primary h-full">
        <View className="flex justify-center items-center h-full">
          <Text className="text-2xl text-text-primary text-center">
            Please sign in to access your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-background-primary h-full">
      <ScrollView className="p-4">
        {renderPersonalSection()}
        {renderNotificationSection()}
        {renderPreferencesSection()}
        
        <TouchableOpacity
          onPress={handleSaveSettings}
          className="bg-accent p-4 rounded-full mb-4"
        >
          <Text className="text-text-primary text-center text-lg">Save Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-danger p-4 rounded-full"
        >
          <Text className="text-text-primary text-center text-lg">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;