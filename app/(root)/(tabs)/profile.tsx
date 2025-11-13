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
import { translate, setLocale, SupportedLanguage } from '@/lib/i18n/config';

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
    temperatureUnit: databaseUser?.temperatureUnit,
    language: (databaseUser?.language as SupportedLanguage) || 'en',
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
        temperatureUnit: databaseUser.temperatureUnit,
        language: (databaseUser.language as SupportedLanguage) || 'en',
      }));
      if (databaseUser.language) {
        setLocale((databaseUser.language as SupportedLanguage) || 'en');
      }
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
        <Text className="text-xl font-semibold text-text-primary">{translate('profile.personalInformation')}</Text>
      </View>
      <TextInput
        className="bg-background-primary p-4 rounded-xl text-text-primary border border-gray-200"
        value={userSettings.displayName}
        onChangeText={(text) => handleSettingChange('displayName', text)}
        placeholder={databaseUser?.displayName || translate('profile.enterDisplayName')}
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
          <Text className="text-xl font-semibold text-text-primary">{translate('profile.notifications')}</Text>
        </View>
        
        <View>
          <View className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl mb-4">
            <View className="flex-1">
              <Text className="text-text-primary font-medium">{translate('profile.enableNotifications')}</Text>
              <Text className="text-text-secondary text-sm">{translate('profile.getRemindedAboutWatering')}</Text>
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
              <Text className="text-text-primary font-medium">{translate('profile.notificationTime')}</Text>
              <Text className="text-text-secondary text-sm">{translate('profile.dailyReminderTime')}</Text>
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
        <Text className="text-xl font-semibold text-text-primary">{translate('profile.preferences')}</Text>
      </View>
      
      <View>
        <View className="mb-4">
          <Text className="text-text-primary font-medium mb-2">{translate('profile.unitSystem')}</Text>
          <View className="bg-background-primary rounded-xl border border-gray-200">
            <Picker
              selectedValue={userSettings.unitSystem}
              onValueChange={(value) => handleSettingChange('unitSystem', value)}
              style={pickerStyle}
              dropdownIconColor={colors.text.primary}
              mode="dropdown"
            >
              <Picker.Item label={translate('profile.metric')} value="metric" />
              <Picker.Item label={translate('profile.imperial')} value="imperial" />
            </Picker>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-text-primary font-medium mb-1">
            {translate('profile.languageLabel')}
          </Text>
          <Text className="text-text-secondary text-sm mb-2">
            {translate('profile.languageDescription')}
          </Text>
          <View className="bg-background-primary rounded-xl border border-gray-200">
            <Picker
              selectedValue={userSettings.language || 'en'}
              onValueChange={(value: string) => {
                handleSettingChange('language', value as SupportedLanguage);
                setLocale((value as SupportedLanguage) || 'en');
              }}
              style={pickerStyle}
              dropdownIconColor={colors.text.primary}
              mode="dropdown"
            >
              <Picker.Item label={translate('profile.languageEnglish')} value="en" />
              <Picker.Item label={translate('profile.languageLithuanian')} value="lt" />
              <Picker.Item label={translate('profile.languageRomanian')} value="ro" />
            </Picker>
          </View>
        </View>
        
        <View className="mb-4">
          <Text className="text-text-primary font-medium mb-2">{translate('profile.temperatureUnit')}</Text>
          <View className="bg-background-primary rounded-xl border border-gray-200">
            <Picker
              selectedValue={userSettings.temperatureUnit}
              onValueChange={(value) => handleSettingChange('temperatureUnit', value)}
              style={pickerStyle}
              dropdownIconColor={colors.text.primary}
              mode="dropdown"
            >
              <Picker.Item label={translate('profile.celsius')} value="celsius" />
              <Picker.Item label={translate('profile.fahrenheit')} value="fahrenheit" />
            </Picker>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl mb-4">
          <View className="flex-1">
            <Text className="text-text-primary font-medium">{translate('profile.mondayAsFirstDay')}</Text>
            <Text className="text-text-secondary text-sm">{translate('profile.startWeekOnMonday')}</Text>
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
        <Text className="text-xl font-semibold text-text-primary">{translate('profile.contactSupport')}</Text>
      </View>
      
      <View className="space">
        <TouchableOpacity
          onPress={() => setShowContactModal(true)}
          className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl"
        >
          <View className="flex-1">
            <Text className="text-text-primary font-medium">{translate('profile.contactUs')}</Text>
            <Text className="text-text-secondary text-sm">{translate('profile.sendMessageOrFeedback')}</Text>
          </View>
          <AntDesign name="right" size={16} color={colors.text.secondary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setShowBugReportModal(true)}
          className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl mt-2"
        >
          <View className="flex-1">
            <Text className="text-text-primary font-medium">{translate('profile.reportBug')}</Text>
            <Text className="text-text-secondary text-sm">{translate('profile.helpUsImprove')}</Text>
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
        <Text className="text-xl font-semibold text-text-primary">{translate('profile.legal')}</Text>
      </View>
      
      <View className="space-y-2">
        <TouchableOpacity
          onPress={() => router.push('/privacy')}
          className="flex-row justify-between items-center p-4 bg-background-primary rounded-xl"
        >
          <View className="flex-1">
            <Text className="text-text-primary font-medium">{translate('profile.privacyPolicy')}</Text>
            <Text className="text-text-secondary text-sm">{translate('profile.howWeHandleData')}</Text>
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
        <Text className="text-text-primary font-medium">{translate('profile.deleteAccount')}</Text>
      </View>
      <Text className="text-text-primary font-bold my-4 text-center">{translate('profile.deleteAccountAndData')}</Text>
      <TouchableOpacity
        onPress={() => setShowDeleteUserModal(true)}
        className="bg-danger p-4 rounded-xl shadow-sm"
      >
        <Text className="text-white text-center text-lg font-semibold ml-2">{translate('profile.deleteAccount')}</Text>
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
        Alert.alert(translate('profile.success'), translate('profile.settingsSavedSuccessfully'));
        // Refresh the global context to update the display name across the app
        refetch?.();
        if (userSettings.language) {
          setLocale(userSettings.language as SupportedLanguage);
        }
      } else {
        Alert.alert(translate('profile.error'), translate('profile.failedToSaveSettings'));
      }
    } catch (error) {
      Alert.alert(translate('profile.error'), translate('profile.failedToSaveSettingsError').replace('{error}', String(error)));
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
        Alert.alert(translate('profile.success'), translate('profile.bugReportSubmittedSuccessfully'));
      } else {
        Alert.alert(translate('profile.error'), translate('profile.failedToSubmitBugReport'));
      }
    } catch (error) {
      Alert.alert(translate('profile.error'), translate('profile.failedToSubmitBugReportError').replace('{error}', String(error)));
    }
  };

  const handleContactSubmit = async (userMessage: UserMessageType) => {
    try {
      const result = await uploadUserMessage(userMessage);
      if (result) {
        Alert.alert(translate('profile.success'), translate('profile.messageSentSuccessfully'));
      } else {
        Alert.alert(translate('profile.error'), translate('profile.failedToSendMessage'));
      }
    } catch (error) {
      Alert.alert(translate('profile.error'), translate('profile.failedToSendMessageError').replace('{error}', String(error)));
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
        Alert.alert(translate('profile.success'), translate('profile.userDeletedSuccessfully'));
      } else {
        Alert.alert(translate('profile.error'), translate('profile.failedToDeleteAccount'));
        // Reset deleting state on failure
        setDeletingAccount(false);
      }
      await refetch();
    } catch (error) {
      Alert.alert(translate('profile.error'), translate('profile.failedToDeleteUserError').replace('{error}', String(error)));
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
            {translate('profile.welcomeToBloomer')}
          </Text>
          <Text className="text-text-secondary text-center text-lg">
            {translate('profile.pleaseSignIn')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show loading screen during account deletion
  if (isDeletingAccount) {
    return <LoadingScreen message={translate('profile.deletingAccountAndData')} />;
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
              {translate('profile.title')}
            </Text>
            <View className="w-12 h-12 bg-primary-medium rounded-full items-center justify-center">
              <AntDesign name="user" size={24} color="white" />
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-text-secondary text-lg">
              {translate('profile.manageAccountSettings')}
            </Text>
            <Text className="text-text-secondary text-lg">
              {databaseUser?.displayName || userSettings.displayName || translate('profile.user')}
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
                  {translate('profile.saveSettings')}
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
                  {translate('profile.signOut')}
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