import { View, Text, ScrollView, TouchableOpacity, Alert, Switch, TextInput, Platform } from 'react-native';
import * as react from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteUser, logout, reportBug, updatePreferences, uploadUserMessage } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/globalProvider';
import { BugReportType, DatabaseUserType, UserMessageType } from '@/interfaces/interfaces';
import { Picker } from '@react-native-picker/picker';
import colors from '@/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from '@expo/vector-icons/AntDesign';
import BugReportModal from '@/components/BugReportModal';
import ContactModal from '@/components/ContactModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import LoadingScreen from '@/components/LoadingScreen';
import { User } from '../../../interfaces/interfaces';
import { usePlantStore } from '@/interfaces/plantStore';
import { useRouter } from 'expo-router';

const Profile: React.FC = () => {
  const { refetch, isLoggedIn, user: contextUser, databaseUser, isDeletingAccount, setDeletingAccount } = useGlobalContext();
  const { clearStore } = usePlantStore();
  const router = useRouter();

  // Helper function to create Date object from UTC ISO string for display
  const createLocalDateFromUTC = (utcString: string): Date => {
    return new Date(utcString);
  };

  // Helper function to convert UTC datetime to local HH:mm string for display
  const getLocalTimeFromUTC = (utcString: string): string => {
    const date = new Date(utcString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Helper function to convert HH:mm string to UTC ISO string
  const convertLocalTimeToUTC = (timeString: string): string => {
    const [h, m] = timeString.split(':');
    const date = new Date();
    date.setHours(Number(h), Number(m), 0, 0);
    return date.toISOString();
  };

  // Initialize notification time - handle both old HH:mm format and new UTC format
  const initializeNotificationTime = (value?: string): string => {
    if (!value) return '';
    
    // If it's already a UTC ISO string, return as is
    if (value.includes('T') && value.includes('Z')) {
      return value;
    }
    
    // If it's HH:mm format, convert to UTC
    if (/^\d{2}:\d{2}$/.test(value)) {
      return convertLocalTimeToUTC(value);
    }
    
    // Try to parse as date and convert to UTC
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    
    return '';
  };

  const [userSettings, setUserSettings] = react.useState<Partial<DatabaseUserType>>({
    displayName: databaseUser?.displayName || contextUser?.name || '',
    notificationsEnabled: databaseUser?.notificationsEnabled,
    notificationTime: initializeNotificationTime(databaseUser?.notificationTime),
    timezone: databaseUser?.timezone,
    reminderAdvanceTime: databaseUser?.reminderAdvanceTime,
    unitSystem: databaseUser?.unitSystem,
    mondayFirstDayOfWeek: databaseUser?.mondayFirstDayOfWeek,
    temperatureUnit: databaseUser?.temperatureUnit
  });

  const [showTimePicker, setShowTimePicker] = react.useState(false);
  const [showBugReportModal, setShowBugReportModal] = react.useState(false);
  const [showContactModal, setShowContactModal] = react.useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = react.useState(false);

  // Update userSettings when databaseUser changes
  react.useEffect(() => {
    if (databaseUser) {
      setUserSettings(prev => ({
        ...prev,
        displayName: databaseUser.displayName || contextUser?.name || '',
        notificationsEnabled: databaseUser.notificationsEnabled,
        notificationTime: initializeNotificationTime(databaseUser.notificationTime),
        timezone: databaseUser.timezone,
        reminderAdvanceTime: databaseUser.reminderAdvanceTime,
        unitSystem: databaseUser.unitSystem,
        mondayFirstDayOfWeek: databaseUser.mondayFirstDayOfWeek,
        temperatureUnit: databaseUser.temperatureUnit
      }));
    }
  }, [databaseUser, contextUser?.name]);

  const handleSettingChange = (setting: keyof DatabaseUserType, value: any) => {
    setUserSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date): void => {
    setShowTimePicker(false);
    if (selectedDate) {
      // Convert local time to UTC for storage
      const utcTime = selectedDate.toISOString();
      handleSettingChange('notificationTime', utcTime);
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
    <View className="bg-background-surface p-6 rounded-xl mb-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-primary-medium rounded-full items-center justify-center mr-3">
          <AntDesign name="user" size={20} color="white" />
        </View>
        <Text className="text-xl font-semibold text-text-primary">Personal Information</Text>
      </View>
      <TextInput
        className="bg-background-primary p-4 rounded-xl text-text-primary border border-gray-200"
        value={userSettings.displayName}
        onChangeText={(text) => handleSettingChange('displayName', text)}
        placeholder={databaseUser?.displayName || "Enter your display name"}
        placeholderTextColor={colors.text.secondary}
      />
    </View>
  );

  const renderNotificationSection = () => {
    // Get default notification time (today at 16:00) if no time is set
    const getDefaultTimeForPicker = () => {
      if (userSettings.notificationTime) {
        return createLocalDateFromUTC(userSettings.notificationTime);
      }
      // Default to today at 16:00
      const today = new Date();
      today.setHours(16, 0, 0, 0);
      return today;
    };

    return (
      <View className="bg-background-surface p-6 rounded-xl mb-6 shadow-sm border border-gray-100">
        <View className="flex-row items-center mb-4">
          <View className="w-10 h-10 bg-primary-medium rounded-full items-center justify-center mr-3">
            <AntDesign name="bells" size={20} color="white" />
          </View>
          <Text className="text-xl font-semibold text-text-primary">Notifications</Text>
        </View>
        
        <View>
          <View className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl mb-4">
            <View className="flex-1">
              <Text className="text-text-primary font-medium">Enable Notifications</Text>
              <Text className="text-text-secondary text-sm">Get reminded about watering tasks</Text>
            </View>
            <Switch
              value={userSettings.notificationsEnabled}
              onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
              trackColor={{ false: '#E5E7EB', true: colors.primary.medium }}
              thumbColor={userSettings.notificationsEnabled ? 'white' : '#F3F4F6'}
            />
          </View>
          
          <View className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl">
            <View className="flex-1">
              <Text className="text-text-primary font-medium">Notification Time</Text>
              <Text className="text-text-secondary text-sm">Daily reminder time</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="bg-primary-medium px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-medium">
                {userSettings.notificationTime ? getLocalTimeFromUTC(userSettings.notificationTime) : "16:00"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {showTimePicker && (
          <DateTimePicker
            value={getDefaultTimeForPicker()}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    );
  };

  const renderPreferencesSection = () => (
    <View className="bg-background-surface p-6 rounded-xl mb-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-primary-medium rounded-full items-center justify-center mr-3">
          <AntDesign name="setting" size={20} color="white" />
        </View>
        <Text className="text-xl font-semibold text-text-primary">Preferences</Text>
      </View>
      
      <View>
        <View className="mb-4">
          <Text className="text-text-primary font-medium mb-2">Unit System</Text>
          <View className="bg-background-primary rounded-xl border border-gray-200">
            <Picker
              selectedValue={userSettings.unitSystem}
              onValueChange={(value) => handleSettingChange('unitSystem', value)}
              style={pickerStyle}
              dropdownIconColor={colors.text.primary}
              mode="dropdown"
            >
              <Picker.Item label="Metric (cm, kg)" value="metric" />
              <Picker.Item label="Imperial (in, lb)" value="imperial" />
            </Picker>
          </View>
        </View>
        
        <View className="mb-4">
          <Text className="text-text-primary font-medium mb-2">Temperature Unit</Text>
          <View className="bg-background-primary rounded-xl border border-gray-200">
            <Picker
              selectedValue={userSettings.temperatureUnit}
              onValueChange={(value) => handleSettingChange('temperatureUnit', value)}
              style={pickerStyle}
              dropdownIconColor={colors.text.primary}
              mode="dropdown"
            >
              <Picker.Item label="Celsius (°C)" value="celsius" />
              <Picker.Item label="Fahrenheit (°F)" value="fahrenheit" />
            </Picker>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl mb-4">
          <View className="flex-1">
            <Text className="text-text-primary font-medium">Monday as First Day</Text>
            <Text className="text-text-secondary text-sm">Start week on Monday</Text>
          </View>
          <Switch
            value={userSettings.mondayFirstDayOfWeek}
            onValueChange={(value) => handleSettingChange('mondayFirstDayOfWeek', value)}
            trackColor={{ false: '#E5E7EB', true: colors.primary.medium }}
            thumbColor={userSettings.mondayFirstDayOfWeek ? 'white' : '#F3F4F6'}
          />
        </View>
      
      </View>
    </View>
  );

  const renderContactSection = () => (
    <View className="bg-background-surface p-6 rounded-xl mb-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-info rounded-full items-center justify-center mr-3">
          <AntDesign name="mail" size={20} color="white" />
        </View>
        <Text className="text-xl font-semibold text-text-primary">Contact & Support</Text>
      </View>
      
      <View className="space">
        <TouchableOpacity
          onPress={() => setShowContactModal(true)}
          className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl"
        >
          <View className="flex-1">
            <Text className="text-text-primary font-medium">Contact Us</Text>
            <Text className="text-text-secondary text-sm">Send us a message or feedback</Text>
          </View>
          <AntDesign name="right" size={16} color={colors.text.secondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setShowBugReportModal(true)}
          className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl mt-2"
        >
          <View className="flex-1">
            <Text className="text-text-primary font-medium">Report a Bug</Text>
            <Text className="text-text-secondary text-sm">Help us improve the app</Text>
          </View>
          <AntDesign name="right" size={16} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  )

  const renderLegalSection = () => (
    <View className="bg-background-surface p-6 rounded-xl mb-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-gray-400 rounded-full items-center justify-center mr-3">
          <AntDesign name="filetext1" size={20} color="white" />
        </View>
        <Text className="text-xl font-semibold text-text-primary">Legal</Text>
      </View>
      
      <View className="space-y-2">
        <TouchableOpacity
          onPress={() => router.push('/privacy')}
          className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl"
        >
          <View className="flex-1">
            <Text className="text-text-primary font-medium">Privacy Policy</Text>
            <Text className="text-text-secondary text-sm">How we handle your data</Text>
          </View>
          <AntDesign name="right" size={16} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDeleteAccountSection = () => (
    <View className="bg-background-surface p-6 rounded-xl mb-6 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 bg-danger rounded-full items-center justify-center mr-3">
          <AntDesign name="delete" size={20} color="white" />
        </View>
        <Text className="text-text-primary font-medium">Delete Account</Text>
      </View>
      <Text className="text-text-primary font-bold my-4 text-center">Delete your account and all your data</Text>
      <TouchableOpacity
        onPress={() => setShowDeleteUserModal(true)}
        className="bg-danger p-4 rounded-xl shadow-sm"
      >
        <Text className="text-white text-center text-lg font-semibold ml-2">Delete Account</Text>
      </TouchableOpacity>
    </View>
  )

  const handleSaveSettings = async (): Promise<void> => {
    try {
      if (!contextUser) return;
      
      // userSettings.notificationTime is already UTC, ready for Appwrite storage
      const settingsToSave = {
        ...userSettings,
        notificationTime: userSettings.notificationTime // Already UTC ISO string
      };
      
      const result = await updatePreferences(contextUser.$id, settingsToSave);
      if (result) {
        Alert.alert('Success', 'Settings saved successfully');
        // Refresh the global context to update the display name across the app
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
    try {
      const result = await logout();
      if (result) {
        console.log("SignOut Successful");
        // Clear local state immediately
        setUserSettings({
          displayName: '',
          notificationsEnabled: false,
          notificationTime: '',
          timezone: '',
          reminderAdvanceTime: 24,
          unitSystem: 'metric',
          mondayFirstDayOfWeek: true,
          temperatureUnit: 'celsius'
        });
        clearStore();
        // Refetch to update global state
        await refetch();
      } else {
        console.log("SignOut Failed");
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const handleBugReportSubmit = async (bugReport: BugReportType) => {
    try {
      const result = await reportBug(bugReport);
      if (result) {
        Alert.alert('Success', 'Bug report submitted successfully! Thank you for helping us improve Bloomer.');
      } else {
        Alert.alert('Error', 'Failed to submit bug report, try again later');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to submit bug report, ${error}`);
    }
  };

  const handleContactSubmit = async (userMessage: UserMessageType) => {
    try {
      const result = await uploadUserMessage(userMessage);
      if (result) {
        Alert.alert('Success', 'Message sent successfully! Thank you for contacting us. We\'ll get back to you soon.');
      } else {
        Alert.alert('Error', 'Failed to send message, try again later');
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send message, ${error}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!contextUser) return;

    try {
      // Set deleting state to show loading screen
      setDeletingAccount(true);
      
      const result = await deleteUser(contextUser?.$id);
      if (result) {
        // Clear the plant store since the user account is deleted
        clearStore();
        Alert.alert('Success', "User deleted successfully! Thank you for using Bloomer. Please let us know your frustrations. We hope to see you again!");
      } else {
        Alert.alert('Error', "Failed to delete your account. Try again later, if the issue appears again, please contact us.");
        // Reset deleting state on failure
        setDeletingAccount(false);
      }
      await refetch();
    } catch (error) {
      Alert.alert("Error", `Failed to delete user, ${error}`);
      // Reset deleting state on error
      setDeletingAccount(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="bg-background-primary h-full">
        <View className="flex justify-center items-center h-full px-6">
          <View className="w-20 h-20 bg-primary-medium rounded-full items-center justify-center mb-6">
            <AntDesign name="user" size={40} color="white" />
          </View>
          <Text className="text-2xl font-bold text-text-primary text-center mb-2">
            Welcome to Bloomer
          </Text>
          <Text className="text-text-secondary text-center text-lg">
            Please sign in to access your profile and manage your plant care settings
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading screen during account deletion
  if (isDeletingAccount) {
    return <LoadingScreen message="Deleting your account and all data..." />;
  }

  return (
    <SafeAreaView className="bg-background-primary h-full">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="w-full px-4 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-text-primary text-3xl font-bold">
              Profile
            </Text>
            <View className="w-12 h-12 bg-primary-medium rounded-full items-center justify-center">
              <AntDesign name="user" size={24} color="white" />
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-lg">
              Manage your account settings
            </Text>
            <Text className="text-text-secondary text-lg">
              {databaseUser?.displayName || userSettings.displayName || 'User'}
            </Text>
          </View>
        </View>
        
        {/* Settings Sections */}
        <View className="px-4">
          {renderPersonalSection()}
          {renderNotificationSection()}
          {renderPreferencesSection()}
          
          {/* Action Buttons */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={handleSaveSettings}
              className="bg-primary-medium p-4 rounded-xl shadow-sm mb-4"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center justify-center">
                <AntDesign name="save" size={20} color="white" className="mr-2" />
                <Text className="text-white text-center text-lg font-semibold ml-2">
                  Save Settings
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleSignOut}
              className="bg-warning p-4 rounded-xl shadow-sm mb-6"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="flex-row items-center justify-center">
                <AntDesign name="logout" size={20} color="white" className="mr-2" />
                <Text className="text-white text-center text-lg font-semibold ml-2">
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {renderContactSection()}
          {renderLegalSection()}
          {renderDeleteAccountSection()}
        </View>
      </ScrollView>
      
      {/* Bug Report Modal */}
      <BugReportModal
        visible={showBugReportModal}
        onClose={() => setShowBugReportModal(false)}
        onSubmit={handleBugReportSubmit}
      />
      
      {/* Contact Modal */}
      <ContactModal
        visible={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSubmit={handleContactSubmit}
        userEmail={contextUser?.email || databaseUser?.email || ''}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteUserModal}
        onClose={() => setShowDeleteUserModal(false)}
        onDelete={handleDeleteAccount}
      />
      
    </SafeAreaView>
  );
};

export default Profile;