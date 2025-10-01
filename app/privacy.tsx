import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const Privacy = () => {
    const router = useRouter()

    return (
        <SafeAreaView className="bg-background-primary flex-1">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                <TouchableOpacity 
                    onPress={() => router.back()}
                    className="p-2"
                >
                    <Ionicons name="arrow-back" size={24} color="#2F2F2F" />
                </TouchableOpacity>
                <Text className="text-text-primary text-xl font-bold">
                    Privacy Policy
                </Text>
                <View className="w-10" />
            </View>

            <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 py-6">
                    {/* Last Updated */}
                    <Text className="text-text-secondary text-sm mb-6">
                        Last Updated: September 30, 2025
                    </Text>

                    {/* Introduction */}
                    <Text className="text-text-primary text-base leading-6 mb-6">
                        This Privacy Notice for Bloomer ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
                    </Text>

                    <View className="mb-6">
                        <Text className="text-text-primary text-base leading-6 mb-2">
                            • Download and use our mobile application (Bloomer), or any other application of ours that links to this Privacy Notice
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-2">
                            • Visit our website at https://bloomerapp.info or any website of ours that links to this Privacy Notice
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            • Engage with us in other related ways, including any sales, marketing, or events
                        </Text>
                    </View>

                    <Text className="text-text-primary text-base leading-6 mb-6">
                        Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at bloomer.app.info@gmail.com.
                    </Text>

                    {/* Summary Section */}
                    <View className="bg-background-surface rounded-2xl p-6 mb-6 border border-gray-200">
                        <Text className="text-text-primary text-lg font-bold mb-4">
                            SUMMARY OF KEY POINTS
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            This summary provides key points from our Privacy Notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for.
                        </Text>
                        
                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                What personal information do we process?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                Do we process any sensitive personal information?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                We do not process sensitive personal information. Although users may upload photos, we do not use them to extract biometric identifiers or analyze personal characteristics.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                Do we collect any information from third parties?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                We may collect information from third-party services such as Google OAuth for authentication, WeatherAPI for weather data, and AI services for generating plant care guides.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                How do we process your information?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                In what situations and with which parties do we share personal information?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                We may share information in specific situations and with specific third parties.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                How do we keep your information safe?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                We implement appropriate technical and organizational security measures to protect your personal information.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className="text-text-primary text-base font-medium mb-2">
                                What are your rights?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5 mb-3">
                                Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.
                            </Text>
                        </View>

                        <View>
                            <Text className="text-text-primary text-base font-medium mb-2">
                                How do you exercise your rights?
                            </Text>
                            <Text className="text-text-secondary text-sm leading-5">
                                The easiest way to exercise your rights is by visiting https://bloomerapp.info/contact, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws.
                            </Text>
                        </View>
                    </View>

                    {/* Table of Contents */}
                    <View className="bg-background-surface rounded-2xl p-6 mb-6 border border-gray-200">
                        <Text className="text-text-primary text-lg font-bold mb-4">
                            TABLE OF CONTENTS
                        </Text>
                        <View className="space-y-2">
                            <Text className="text-text-primary text-base">1. WHAT INFORMATION DO WE COLLECT?</Text>
                            <Text className="text-text-primary text-base">2. HOW DO WE PROCESS YOUR INFORMATION?</Text>
                            <Text className="text-text-primary text-base">3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?</Text>
                            <Text className="text-text-primary text-base">4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</Text>
                            <Text className="text-text-primary text-base">5. HOW DO WE KEEP YOUR INFORMATION SAFE?</Text>
                            <Text className="text-text-primary text-base">6. HOW LONG DO WE KEEP YOUR INFORMATION?</Text>
                            <Text className="text-text-primary text-base">7. WHAT ARE YOUR PRIVACY RIGHTS?</Text>
                            <Text className="text-text-primary text-base">8. DO WE COLLECT INFORMATION FROM CHILDREN?</Text>
                            <Text className="text-text-primary text-base">9. CONTROLS FOR DO-NOT-TRACK FEATURES</Text>
                            <Text className="text-text-primary text-base">10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?</Text>
                            <Text className="text-text-primary text-base">11. DO WE MAKE UPDATES TO THIS NOTICE?</Text>
                            <Text className="text-text-primary text-base">12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</Text>
                            <Text className="text-text-primary text-base">13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</Text>
                        </View>
                    </View>

                    {/* Section 1: What Information Do We Collect */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            1. WHAT INFORMATION DO WE COLLECT?
                        </Text>
                        
                        <Text className="text-text-primary text-lg font-semibold mb-3">
                            Personal information you disclose to us
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We collect personal information that you provide to us.
                        </Text>
                        
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Personal Information Provided by You.
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Email addresses:</Text>
                            <Text className="text-text-secondary text-sm mb-3">Collected through Google OAuth authentication</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Google Account ID:</Text>
                            <Text className="text-text-secondary text-sm mb-3">Used for account management and authentication</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Plant photos:</Text>
                            <Text className="text-text-secondary text-sm mb-3">You take up to 5 photos of plants for identification purposes; we store the first photo as a cover image for each identified plant</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Plant names and care data:</Text>
                            <Text className="text-text-secondary text-sm mb-3">Names of plants you identify and personalized care guides generated by our AI system, stored in JSON format</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Watering schedules:</Text>
                            <Text className="text-text-secondary text-sm mb-3">Information about watering needs for push notification reminders</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Device information:</Text>
                            <Text className="text-text-secondary text-sm mb-3">Device type, operating system version, and push notification tokens</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Location Information:</Text>
                            <Text className="text-text-secondary text-sm">We temporarily access your current location to provide weather information relevant to your area. Important: We do NOT store your location data. It is only sent to our weather service provider (WeatherAPI) in real-time and is not retained in our systems.</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Sensitive Information.
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We do not process sensitive information. Although users may upload photos, we do not use them to extract biometric identifiers, facial recognition data, or to analyze personal characteristics such as race, ethnicity, or health information. Photos are used solely for plant identification purposes.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Application Data.
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-3">
                            If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Mobile Device Access:</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may request access or permission to certain features from your mobile device, including your mobile device's camera, location services, and notifications. If you wish to change our access or permissions, you may do so in your device's settings.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Push Notifications:</Text>
                            <Text className="text-text-secondary text-sm">We may request to send you push notifications regarding watering reminders and app updates. If you wish to opt out from receiving these types of communications, you may turn them off in your device's settings.</Text>
                        </View>

                        <Text className="text-text-primary text-base leading-6 mb-4">
                            This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes.
                        </Text>

                        <Text className="text-text-primary text-base leading-6 mb-4">
                            All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Information automatically collected
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: Some information — such as your device type and app usage patterns — is collected automatically when you use our Services.
                        </Text>
                        <Text className="text-text-primary text-base leading-6">
                            We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as device type, operating system, app crashes, and performance metrics. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
                        </Text>
                    </View>

                    {/* Section 2: How Do We Process Your Information */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            2. HOW DO WE PROCESS YOUR INFORMATION?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes only with your prior explicit consent.
                        </Text>
                        
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We process your personal information for a variety of reasons, depending on how you interact with our Services, including:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">To facilitate account creation and authentication and otherwise manage user accounts.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may process your information so you can create and log in to your account, as well as keep your account in working order.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To identify plants from photos.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We process photos you submit to identify plant species using artificial intelligence.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To generate personalized care guides.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We process plant names to generate customized care instructions using AI services.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To provide weather information.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We temporarily process your location to display current weather conditions relevant to plant care.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To send administrative information to you.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To send you push notifications.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may process your information to send you reminders about plant watering schedules and other care-related notifications.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To improve our Services.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may process information about how you use our app to analyze usage patterns, improve plant identification algorithms, and develop new features.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To ensure security and prevent fraud.</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may process your information as part of our efforts to keep our Services safe and secure, including fraud monitoring and prevention.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">To save or protect an individual's vital interest.</Text>
                            <Text className="text-text-secondary text-sm">We may process your information when necessary to save or protect an individual's vital interest, such as to prevent harm.</Text>
                        </View>
                    </View>

                    {/* Section 3: Legal Bases */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests.
                        </Text>
                        
                        <Text className="text-text-primary text-base font-semibold mb-3">
                            If you are located in the EU or UK, this section applies to you.
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            The General Data Protection Regulation (GDPR) and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. As such, we may rely on the following legal bases to process your personal information:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Consent (Article 6(1)(a) GDPR)</Text>
                            <Text className="text-text-secondary text-sm mb-3">We process your information with your explicit consent for:</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Location access: Accessing your current location to provide weather information</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Push notifications: Sending you watering reminders and app updates</Text>
                            <Text className="text-text-secondary text-sm mb-3">• Camera access: Taking photos of plants for identification</Text>
                            <Text className="text-text-secondary text-sm">You can withdraw your consent at any time through your device settings or by contacting us.</Text>
                        </View>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Performance of a Contract (Article 6(1)(b) GDPR)</Text>
                            <Text className="text-text-secondary text-sm mb-3">We process your information when necessary to fulfill our contractual obligations to provide you with our Services:</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Account authentication: Processing your email and Google Account ID to create and manage your account</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Plant identification: Processing photos to identify plant species</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Care guide generation: Processing plant names to create personalized care guides</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Plant collection management: Storing your plant photos and care data</Text>
                            <Text className="text-text-secondary text-sm">• Service delivery: Maintaining app functionality and delivering core features</Text>
                        </View>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Legitimate Interests (Article 6(1)(f) GDPR)</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests:</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Service improvement: Analyzing app usage patterns to enhance plant identification accuracy</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Security and fraud prevention: Monitoring for suspicious activity</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Technical maintenance: Ensuring app stability and performance</Text>
                            <Text className="text-text-secondary text-sm">• Business operations: Managing our business efficiently</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            If you are located in Canada, this section applies to you.
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time.
                        </Text>
                    </View>

                    {/* Section 4: Sharing Information */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We may share information in specific situations described in this section and/or with the following third parties.
                        </Text>
                        
                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Third-Party Service Providers:
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We share your data with the following third-party service providers to enable core functionality of our Services. We have written contracts with each service provider to ensure they handle your data in accordance with this Privacy Notice and applicable data protection laws.
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Google OAuth (Google LLC)</Text>
                            <Text className="text-text-secondary text-sm mb-1">Data shared: Email address, Google Account ID</Text>
                            <Text className="text-text-secondary text-sm mb-1">Purpose: User authentication and account management</Text>
                            <Text className="text-text-secondary text-sm mb-1">Legal basis: Contract performance</Text>
                            <Text className="text-text-secondary text-sm mb-3">Location: United States</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">WeatherAPI</Text>
                            <Text className="text-text-secondary text-sm mb-1">Data shared: Current location (real-time only, not stored by us)</Text>
                            <Text className="text-text-secondary text-sm mb-1">Purpose: Providing weather information relevant to plant care</Text>
                            <Text className="text-text-secondary text-sm mb-3">Legal basis: Consent</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">AI/LLM Service Provider Rayon labs</Text>
                            <Text className="text-text-secondary text-sm mb-1">Data shared: Plant names only</Text>
                            <Text className="text-text-secondary text-sm mb-1">Purpose: Generating personalized plant care guides</Text>
                            <Text className="text-text-secondary text-sm mb-3">Legal basis: Contract performance</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Cloud Storage Provider Appwrite</Text>
                            <Text className="text-text-secondary text-sm mb-1">Data shared: Plant photos, care guides, user account data</Text>
                            <Text className="text-text-secondary text-sm mb-1">Purpose: Data storage and application functionality</Text>
                            <Text className="text-text-secondary text-sm mb-3">Legal basis: Contract performance</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Push Notification Service Firebase Cloud Messaging</Text>
                            <Text className="text-text-secondary text-sm mb-1">Data shared: Device tokens, notification content (watering reminders)</Text>
                            <Text className="text-text-secondary text-sm mb-1">Purpose: Sending watering reminders and app notifications</Text>
                            <Text className="text-text-secondary text-sm">Legal basis: Consent</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            International Data Transfers:
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We are based in Belgium (European Economic Area), but some of our service providers are located outside the EEA, including in the United States. When we transfer your personal data outside the EEA, we ensure appropriate safeguards are in place:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Standard Contractual Clauses (SCCs): We use EU Standard Contractual Clauses approved by the European Commission</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Adequacy Decisions: For transfers to countries with an EU adequacy decision (e.g., UK)</Text>
                            <Text className="text-text-secondary text-sm">• Additional Safeguards: Where necessary, we implement additional technical and organizational measures to protect your data</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Other Sharing Situations:
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We may need to share your personal information in the following situations:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Business Transfers:</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Legal Requirements:</Text>
                            <Text className="text-text-secondary text-sm mb-3">We may disclose your information where required by law, court order, or government regulation.</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">We do not:</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Sell your personal information to third parties</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Share your personal information for third-party marketing purposes</Text>
                            <Text className="text-text-secondary text-sm">• Engage in targeted advertising or profiling that produces legal or similarly significant effects</Text>
                        </View>
                    </View>

                    {/* Section 5: Information Security */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            5. HOW DO WE KEEP YOUR INFORMATION SAFE?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We aim to protect your personal information through a system of organizational and technical security measures.
                        </Text>
                        
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Our security measures include:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Encryption in transit: All data transmitted between your device and our servers is encrypted using industry-standard SSL/TLS protocols</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Encryption at rest: Sensitive data stored on our servers is encrypted</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Secure authentication: We use Google OAuth, which implements robust security standards</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Access controls: Limited access to personal information on a need-to-know basis</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Regular security assessments: We periodically review our security practices</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Secure infrastructure: We use reputable cloud service providers with strong security certifications</Text>
                            <Text className="text-text-secondary text-sm">• Data minimization: We only collect and retain data necessary for providing our Services</Text>
                        </View>

                        <Text className="text-text-primary text-base leading-6">
                            Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment.
                        </Text>
                    </View>

                    {/* Section 6: Data Retention */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            6. HOW LONG DO WE KEEP YOUR INFORMATION?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
                        </Text>
                        
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Specific Retention Periods:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Account data (email, Google ID)</Text>
                                <Text className="text-text-secondary text-sm">Until account deletion</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Plant photos (cover images)</Text>
                                <Text className="text-text-secondary text-sm">Until you delete them or your account</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Plant care guides</Text>
                                <Text className="text-text-secondary text-sm">Until you delete them or your account</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Location data</Text>
                                <Text className="text-text-secondary text-sm">Not stored — processed in real-time only</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Device tokens (push notifications)</Text>
                                <Text className="text-text-secondary text-sm">Until you uninstall the app or revoke permissions</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">App usage analytics</Text>
                                <Text className="text-text-secondary text-sm">24 months</Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-text-primary text-base font-medium">Backup archives</Text>
                                <Text className="text-text-secondary text-sm">90 days after account deletion</Text>
                            </View>
                        </View>

                        <Text className="text-text-primary text-base leading-6">
                            When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                        </Text>
                    </View>

                    {/* Section 7: Privacy Rights */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            7. WHAT ARE YOUR PRIVACY RIGHTS?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: Depending on your state of residence in the US or in some regions, such as the European Economic Area (EEA), United Kingdom (UK), Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information.
                        </Text>
                        
                        <Text className="text-text-primary text-base font-semibold mb-3">
                            If you are located in the EEA, UK, Switzerland, or Canada
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">(i) Right of Access (Article 15 GDPR): Request access to and obtain a copy of your personal information</Text>
                            <Text className="text-text-secondary text-sm mb-1">(ii) Right to Rectification (Article 16 GDPR): Request correction of inaccurate or incomplete personal information</Text>
                            <Text className="text-text-secondary text-sm mb-1">(iii) Right to Erasure (Article 17 GDPR): Request deletion of your personal information ("right to be forgotten")</Text>
                            <Text className="text-text-secondary text-sm mb-1">(iv) Right to Restrict Processing (Article 18 GDPR): Request restriction of processing of your personal information</Text>
                            <Text className="text-text-secondary text-sm mb-1">(v) Right to Data Portability (Article 20 GDPR): Receive your personal information in a structured, commonly used, and machine-readable format</Text>
                            <Text className="text-text-secondary text-sm mb-1">(vi) Right to Object (Article 21 GDPR): Object to processing of your personal information based on legitimate interests</Text>
                            <Text className="text-text-secondary text-sm">(vii) Right Not to Be Subject to Automated Decision-Making (Article 22 GDPR): Not be subject to decisions based solely on automated processing that produce legal or similarly significant effects</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Withdrawing your consent:
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Camera permission: Go to your device Settings → Apps → Bloomer → Permissions → Camera → Disable</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Location permission: Go to your device Settings → Apps → Bloomer → Permissions → Location → Disable</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Push notifications: Go to your device Settings → Apps → Bloomer → Notifications → Disable, or disable within the Bloomer app settings</Text>
                            <Text className="text-text-secondary text-sm">• Complete withdrawal: Contact us at bloomer.app.info@gmail.com</Text>
                        </View>

                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We will consider and act upon any request in accordance with applicable data protection laws. We will respond to your request within one month, though this may be extended by two additional months in complex cases.
                        </Text>
                    </View>

                    {/* Section 8: Children's Information */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            8. DO WE COLLECT INFORMATION FROM CHILDREN?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: We do not knowingly collect data from or market to children under 13 years of age (or 16 years of age in the European Economic Area).
                        </Text>
                        
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We do not knowingly collect, solicit data from, or market to children under 13 years of age (or under 16 years of age if located in the EEA, UK, or Switzerland), nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 13 (or 16 if in the EEA, UK, or Switzerland) or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.
                        </Text>

                        <Text className="text-text-primary text-base leading-6">
                            If we learn that personal information from users less than 13 years of age (or 16 in the EEA) has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 13 (or 16), please contact us at bloomer.app.info@gmail.com.
                        </Text>
                    </View>

                    {/* Section 9: Do-Not-Track */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            9. CONTROLS FOR DO-NOT-TRACK FEATURES
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected.
                        </Text>

                        <Text className="text-text-primary text-base leading-6 mb-4">
                            At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Tracking and Analytics:
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We do not use cookies or third-party analytics tools (such as Google Analytics) in our mobile application. We do not track your browsing activity across other websites or apps. Any app performance data we collect is limited to crash reports and basic usage metrics necessary to maintain and improve the app, and this data is not used for advertising or shared with third parties for marketing purposes.
                        </Text>
                    </View>

                    {/* Section 10: US Residents Rights */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            10. DO UNITED STATES RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it.
                        </Text>
                        
                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Categories of Personal Information We Collect
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We have collected the following categories of personal information in the past twelve (12) months:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">A. Identifiers</Text>
                                <Text className="text-success text-sm">YES</Text>
                            </View>
                            <Text className="text-text-secondary text-sm mb-3">Contact details, such as email address, Google Account ID, and device identifiers</Text>
                            
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">G. Geolocation data</Text>
                                <Text className="text-success text-sm">YES</Text>
                            </View>
                            <Text className="text-text-secondary text-sm mb-3">Device location (collected in real-time only for weather information, not stored)</Text>
                            
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">H. Audio, electronic, sensory, or similar information</Text>
                                <Text className="text-success text-sm">YES</Text>
                            </View>
                            <Text className="text-text-secondary text-sm">Images (plant photos) created in connection with our business activities</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Your Rights
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            You have rights under certain US state data protection laws. However, these rights are not absolute, and in certain cases, we may decline your request as permitted by law. These rights include:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Right to know whether or not we are processing your personal data</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Right to access your personal data</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Right to correct inaccuracies in your personal data</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Right to request the deletion of your personal data</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Right to obtain a copy of the personal data you previously shared with us</Text>
                            <Text className="text-text-secondary text-sm">• Right to non-discrimination for exercising your rights</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            How to Exercise Your Rights
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            To exercise these rights, you can contact us:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• By visiting https://bloomerapp.info/contact</Text>
                            <Text className="text-text-secondary text-sm mb-1">• By emailing us at bloomer.app.info@gmail.com</Text>
                            <Text className="text-text-secondary text-sm">• By using the in-app account deletion feature</Text>
                        </View>

                        <Text className="text-text-primary text-base leading-6">
                            We will respond to your verifiable request within 45 days of receipt. If we require more time (up to an additional 45 days), we will inform you of the reason and extension period in writing.
                        </Text>
                    </View>

                    {/* Section 11: Updates */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            11. DO WE MAKE UPDATES TO THIS NOTICE?
                        </Text>
                        <Text className="text-text-secondary text-sm mb-2">
                            In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.
                        </Text>
                        
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Last Updated" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification via email or push notification.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Material changes include:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Changes to the types of personal information we collect</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Changes to how we use or share your personal information</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Changes to your rights regarding your personal information</Text>
                            <Text className="text-text-secondary text-sm">• Changes to our data retention practices</Text>
                        </View>

                        <Text className="text-text-primary text-base leading-6">
                            We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.
                        </Text>
                    </View>

                    {/* Section 12: Contact */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            12. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            If you have questions or comments about this notice, you may email us at bloomer.app.info@gmail.com or visit https://bloomerapp.info/contact.
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-semibold mb-3">Data Controller:</Text>
                            <Text className="text-text-primary text-base mb-1">Bloomer</Text>
                            <Text className="text-text-primary text-base mb-1">Boomlaarstraat 108, bus 4</Text>
                            <Text className="text-text-primary text-base mb-1">2500, Lier</Text>
                            <Text className="text-text-primary text-base mb-1">Belgium</Text>
                            <Text className="text-text-primary text-base">European Union</Text>
                        </View>
                    </View>

                    {/* Section 13: Data Management */}
                    <View className="mb-8">
                        <Text className="text-text-primary text-xl font-bold mb-4">
                            13. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            Based on the applicable laws of your country or state of residence in the US, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information.
                        </Text>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            To request to delete your personal information:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-medium mb-2">Option 1: Through the Bloomer App</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Open the Bloomer app</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Go to Settings → Account</Text>
                            <Text className="text-text-secondary text-sm mb-3">• Select "Delete My Account" to permanently delete your account and all associated data</Text>
                            
                            <Text className="text-text-primary text-base font-medium mb-2">Option 2: Contact Us</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Visit: https://bloomerapp.info/contact</Text>
                            <Text className="text-text-secondary text-sm">• Email: bloomer.app.info@gmail.com</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            What happens when you delete your account?
                        </Text>
                        <Text className="text-text-primary text-base leading-6 mb-4">
                            Upon account deletion, the following data will be permanently removed:
                        </Text>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Your email address and Google Account ID</Text>
                            <Text className="text-text-secondary text-sm mb-1">• All plant photos you uploaded</Text>
                            <Text className="text-text-secondary text-sm mb-1">• All plant care guides and plant collection data</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Your watering schedules and notification preferences</Text>
                            <Text className="text-text-secondary text-sm">• Device tokens and app settings</Text>
                        </View>

                        <Text className="text-text-primary text-base font-semibold mb-3">
                            Timeline:
                        </Text>
                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-secondary text-sm mb-1">• Immediate: Your account will be deactivated and you will no longer be able to log in</Text>
                            <Text className="text-text-secondary text-sm mb-1">• Within 30 days: All data will be deleted from our active databases</Text>
                            <Text className="text-text-secondary text-sm">• Within 90 days: All data will be deleted from backup archives</Text>
                        </View>

                        <View className="bg-background-surface rounded-xl p-4 mb-4 border border-gray-200">
                            <Text className="text-text-primary text-base font-semibold mb-2">Summary of Your Privacy Rights</Text>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Access</Text>
                                <Text className="text-text-secondary text-sm">Get a copy of your personal data</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Rectification</Text>
                                <Text className="text-text-secondary text-sm">Correct inaccurate data</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Erasure</Text>
                                <Text className="text-text-secondary text-sm">Delete your personal data</Text>
                            </View>
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-text-primary text-base font-medium">Data Portability</Text>
                                <Text className="text-text-secondary text-sm">Receive your data in machine-readable format</Text>
                            </View>
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="text-text-primary text-base font-medium flex-1 mr-3">Withdraw Consent</Text>
                                <Text className="text-text-secondary text-sm flex-2 leading-5">Revoke camera, location, or notification permissions</Text>
                            </View>
                        </View>
                    </View>

                    {/* Contact Information */}
                    <View className="bg-primary-medium rounded-2xl p-6 mb-6">
                        <Text className="text-white text-lg font-bold mb-3">
                            Questions or Concerns?
                        </Text>
                        <Text className="text-white text-base leading-6 mb-4">
                            If you have any questions about this Privacy Notice or our privacy practices, please don't hesitate to contact us.
                        </Text>
                        <View className="bg-white/20 rounded-xl p-4">
                            <Text className="text-white text-base font-medium mb-2">Contact Information:</Text>
                            <Text className="text-white text-sm">Email: bloomer.app.info@gmail.com</Text>
                            <Text className="text-white text-sm">Website: https://bloomerapp.info/contact</Text>
                        </View>
                    </View>

                    {/* Thank You Message */}
                    <View className="bg-background-surface rounded-2xl p-6 border border-gray-200">
                        <Text className="text-text-primary text-lg font-bold mb-3">
                            Thank you for using Bloomer!
                        </Text>
                        <Text className="text-text-primary text-base leading-6">
                            We are committed to protecting your privacy and providing transparency about how we handle your personal information. If you have any questions about this Privacy Notice or our privacy practices, please don't hesitate to contact us at bloomer.app.info@gmail.com.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Privacy
