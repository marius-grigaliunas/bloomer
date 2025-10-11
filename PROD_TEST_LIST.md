# Bloomer App - Production Test List
## User Journey Testing Scenarios

---

## 🌱 Journey 1: New User First Time Experience

### Scenario: Sarah discovers Bloomer and wants to start caring for her plants

**Steps:**
1. Open app for the first time
2. See welcome screen with logo and branding
3. Choose to sign in with Google
4. Grant necessary permissions (camera, notifications)
5. Land on empty home screen with greeting
6. See weather information for current location
7. Notice "Add Plant" button and empty state messaging

**Success Criteria:**
- Smooth onboarding flow
- Clear call-to-action to add first plant
- Weather loads correctly
- Greeting shows correct time of day and user name

---

## 🔍 Journey 2: Identifying and Adding First Plant

### Scenario: Sarah wants to add her first plant by taking photos

**Steps:**
1. Tap "Identify Plant" button from home screen
2. Grant camera permissions if prompted
3. Take 3-5 photos of the plant from different angles
4. Toggle flash if lighting is poor
5. Review photos taken (progress shows 3/5, 4/5, etc.)
6. Tap "Identify" button
7. Wait for identification (see loading messages)
8. View identification results with confidence score
9. Review care information (watering, light, temperature)
10. Tap "Add to My Garden"
11. Enter a nickname for the plant (e.g., "Basil")
12. Select when it was last watered (e.g., today)
13. Tap "Add Plant"
14. Return to home screen and see the plant card

**Success Criteria:**
- Camera works properly on device
- Can take and review multiple photos
- Identification returns accurate results
- Care information displays correctly
- Plant appears in "My Garden" section
- Plant shows correct next watering date

---

## 📅 Journey 3: Daily Morning Routine

### Scenario: Mark checks his plants each morning before work

**Steps:**
1. Open app in the morning
2. See "Good morning, Mark" greeting
3. Check today's weather conditions
4. Review "Today's Tasks" section
5. See 2 plants need watering today (shown in list)
6. See 1 plant is overdue (shown with red indicator)
7. Tap on first overdue plant
8. Review watering status (e.g., "2 days overdue")
9. Water the plant physically
10. Tap "Mark Watered" button
11. See success message
12. Navigate back to home
13. Tap on second plant that needs watering
14. Mark as watered
15. Navigate back to home
16. See "All caught up!" message

**Success Criteria:**
- Tasks accurately reflect watering schedule
- Overdue plants clearly highlighted
- "Mark Watered" updates the schedule immediately
- Next watering date recalculates correctly
- Home screen updates to show completion

---

## 🗓️ Journey 4: Planning the Week Ahead

### Scenario: Emma checks her schedule for the upcoming week

**Steps:**
1. From home screen, tap "View Schedule" button
2. See monthly calendar view
3. Notice dots on dates indicating watering tasks
4. Red dots show late tasks, green dots show scheduled tasks
5. Tap on today's date
6. View tasks for today below calendar
7. Tap on tomorrow's date
8. See which plants need watering tomorrow
9. Tap on a future date (3 days from now)
10. See tasks for that specific day
11. Pull down to refresh calendar
12. Verify tasks update correctly

**Success Criteria:**
- Calendar loads all months
- Can navigate between months smoothly
- Task indicators (dots) show correctly
- Selecting date shows accurate task list
- Can view past and future dates
- Refresh updates data properly

---

## 🌿 Journey 5: Managing Multiple Plants

### Scenario: David has 10 plants and needs to manage them all

**Steps:**
1. Open home screen
2. Scroll horizontally through "My Garden" section
3. View all 10 plant cards
4. Tap on a specific plant (e.g., "Monstera")
5. Review full plant details page
6. Check watering history (last 10 entries)
7. Review care information (light, temperature, humidity)
8. Decide to rename plant
9. Tap edit/rename button
10. Enter new name (e.g., "Monty the Monstera")
11. Save changes
12. See updated name immediately
13. Navigate back to home
14. Confirm name updated in garden list

**Success Criteria:**
- Can scroll through all plants smoothly
- Plant details load quickly
- Watering history shows correct dates
- Rename works instantly
- Changes persist across navigation

---

## ⚙️ Journey 6: Customizing App Settings

### Scenario: Lisa wants to adjust her preferences

**Steps:**
1. Navigate to Profile tab
2. Update display name to preferred name
3. Enable notifications
4. Set notification time to 8:00 AM
5. Change unit system from Imperial to Metric
6. Change temperature display to Celsius
7. Toggle "Monday as first day of week" ON
8. Tap "Save Settings"
9. See success confirmation
10. Navigate to Care tab
11. Verify calendar now starts with Monday
12. Navigate to home screen
13. Verify temperature shows in Celsius
14. Verify plant watering amounts show in ml (metric)

**Success Criteria:**
- All settings save successfully
- Calendar preference applies immediately
- Temperature units update everywhere
- Notification time saves in correct timezone
- Settings persist after closing app

---

## 🐛 Journey 7: Getting Help and Support

### Scenario: Tom encounters an issue and wants to report it

**Steps:**
1. Navigate to Profile tab
2. Scroll to "Contact & Support" section
3. Tap "Report a Bug"
4. Fill out bug report form:
   - Title: "Camera flash not working"
   - Description: Detailed explanation
   - Steps to reproduce
   - Device info: "iPhone 13, iOS 17.2"
5. Submit report
6. See success message
7. Return to profile
8. Tap "Contact Us"
9. Enter email address
10. Write feedback message
11. Submit message
12. Receive confirmation

**Success Criteria:**
- Modal forms open correctly
- Can type in all fields
- Form validation works
- Submission succeeds
- Confirmation messages display
- Forms reset after submission

---

## 🎯 Journey 8: Recovering from Mistakes

### Scenario: Nina accidentally marks the wrong plant as watered

**Steps:**
1. View today's tasks on home screen
2. Accidentally tap wrong plant
3. Accidentally tap "Mark Watered"
4. Realize mistake immediately
5. Note: App doesn't have undo feature
6. Navigate to the plant's detail page
7. Check watering history
8. Verify last watered date was updated
9. Note that user would need to wait or contact support for correction

**Alternative - Preventing Mistakes:**
1. View plant details before marking watered
2. Confirm plant identity from image
3. Check watering schedule makes sense
4. Then tap "Mark Watered"

**Success Criteria:**
- Mark watered action is quick but intentional
- Watering history updates immediately
- User can verify changes in history
- Plant detail page shows accurate status

---

## 🔄 Journey 9: Weekly Check-In Routine

### Scenario: Michael checks in on weekend to plan his week

**Steps:**
1. Open app on Sunday morning
2. Pull down to refresh on home screen
3. Review weather for the day
4. Check "This Week" calendar widget
5. See overview of watering tasks for coming 7 days
6. Notice Monday has 3 plants (3 dots)
7. Notice Wednesday has 2 plants
8. Tap on Monday in week calendar
9. Navigate to Care tab with Monday selected
10. Review full list of Monday's tasks
11. Make mental note of plants needing attention
12. Return to home
13. Check "My Garden" section for any urgent plants
14. Notice border colors indicating urgency

**Success Criteria:**
- Refresh updates all data
- Week calendar gives clear overview
- Tap on day navigates with context preserved
- Urgency indicators are visible and clear
- Can plan ahead for multiple days

---

## 🗑️ Journey 10: Removing a Plant

### Scenario: Anna's plant died and she wants to remove it

**Steps:**
1. Navigate to home screen
2. Find plant in "My Garden" section
3. Tap on the plant to open details
4. Locate delete button (trash icon)
5. Tap delete button
6. See confirmation alert: "Are you sure? This cannot be undone"
7. Confirm deletion
8. Return to home screen
9. Verify plant no longer appears in garden
10. Check Care calendar
11. Verify plant's tasks no longer appear
12. Confirm deletion was successful

**Success Criteria:**
- Delete requires confirmation
- Warning message is clear
- Plant removes from all screens
- Schedule updates automatically
- Action cannot be undone (as warned)

---

## 📱 Journey 11: Using App Offline

### Scenario: Carlos is in an area with no internet connection

**Steps:**
1. Turn off WiFi and mobile data on device
2. Open Bloomer app
3. View previously loaded plants on home screen
4. Navigate to Care calendar
5. View previously cached calendar data
6. Mark a plant as watered (should work offline)
7. Try to identify a new plant
8. See appropriate error message about needing internet
9. Turn internet back on
10. Pull to refresh on home screen
11. Verify offline changes synced (watered plant)
12. Verify all data updates

**Success Criteria:**
- App opens and works offline for basic functions
- Can view cached plant data
- Mark watered works offline
- Internet-required features show helpful messages
- Data syncs when connection restored

---

## 🔔 Journey 12: Notification Experience

### Scenario: Rachel receives and responds to notification

**Steps:**
1. Have app set up with notifications enabled
2. Wait until notification time (e.g., 8:00 AM)
3. Receive push notification: "You have 3 plants to water today"
4. Tap on notification
5. App opens to home screen
6. See today's tasks highlighted
7. Complete watering tasks
8. Mark plants as watered
9. Check that tomorrow won't have unnecessary notifications

**Success Criteria:**
- Notification arrives at correct time
- Notification content is accurate
- Tapping notification opens app correctly
- Tasks shown match notification count
- Daily notification repeats appropriately

---

## 🌍 Journey 13: Multi-Device Experience

### Scenario: James uses Bloomer on phone and later on tablet

**Steps:**
1. Set up account on phone with Google sign-in
2. Add 3 plants on phone
3. Mark one plant as watered
4. Update profile settings
5. Sign in to same account on tablet
6. Verify all 3 plants appear
7. Verify watered plant shows updated status
8. Verify settings synced correctly
9. Add a new plant on tablet
10. Check phone
11. Pull to refresh
12. Verify new plant appears on phone

**Success Criteria:**
- Account syncs across devices
- All plant data syncs
- Watering history syncs
- Settings sync
- Changes appear on all devices
- Refresh pulls latest data

---

## 🎨 Journey 14: Visual Urgency Detection

### Scenario: Patricia quickly scans which plants need immediate attention

**Steps:**
1. Open home screen
2. Quickly scan "Today's Tasks" section
3. Identify overdue plants by red border/indicator
4. Notice plants 5+ days overdue have red banner
5. See plants 1-2 days overdue have orange indicator
6. Scroll through "My Garden" section
7. Identify urgent plants by border colors:
   - Red border = very overdue
   - Orange border = somewhat overdue
   - No border = on schedule
8. Prioritize watering based on visual cues
9. Handle most urgent plants first

**Success Criteria:**
- Color coding is consistent across app
- Urgency levels are clearly distinguishable
- Visual hierarchy helps with prioritization
- Urgent plants stand out immediately
- Color choices are accessible

---

## 🏠 Journey 15: Returning User After Long Absence

### Scenario: Kevin hasn't opened app in 2 weeks

**Steps:**
1. Open app after 2 week absence
2. See greeting and weather update
3. Notice multiple plants in "Today's Tasks"
4. See several plants marked overdue with high day counts
5. See urgent care banner: "5 plants need immediate attention"
6. Review which plants are most overdue (10+ days)
7. Tap on most overdue plant
8. See red "10 days overdue" status
9. Water the plant physically
10. Mark as watered
11. See next watering date calculated from today
12. Work through remaining urgent plants
13. Pull to refresh to update all data
14. See schedule gradually normalize

**Success Criteria:**
- App accurately calculates days overdue
- Urgent plants clearly highlighted
- Can recover from long absence
- Schedule resets properly after watering
- No data loss during absence

---

## 🔐 Journey 16: Account Deletion and Fresh Start

### Scenario: Sophie wants to delete account and start over

**Steps:**
1. Navigate to Profile tab
2. Scroll to "Delete Account" section
3. Read warning about data deletion
4. Tap "Delete Account" button
5. See confirmation modal with serious warning
6. Confirm understanding of permanent deletion
7. Tap "Delete Account" in modal
8. See deletion loading screen
9. Wait for account deletion to complete
10. Return to sign-in screen
11. Sign in again (as new user or same Google account)
12. See empty home screen (fresh start)
13. All previous plants are gone
14. All previous settings reset to defaults

**Success Criteria:**
- Deletion requires multiple confirmations
- Warning messages are very clear
- Deletion is truly permanent
- All user data removed
- Can create new account after deletion
- Previous data does not persist

---

## ✅ Quick Smoke Tests (Run These Every Build)

### Critical Path Tests - Should take ~5 minutes

1. **Sign In:** Google OAuth works → Lands on home screen
2. **Add Plant:** Camera → Take 1 photo → Identify → Add to garden → Appears on home
3. **Mark Watered:** Tap plant → Mark watered → Status updates
4. **Calendar:** Navigate to Care tab → Calendar loads → Can select dates
5. **Settings:** Change a setting → Save → Verify it applies
6. **Sign Out:** Sign out works → Returns to sign-in screen

---

## 📋 Testing Checklist

### Pre-Release Testing
- [ ] All 16 user journeys complete successfully
- [ ] Quick smoke tests pass on iOS
- [ ] Quick smoke tests pass on Android
- [ ] Camera works on multiple device models
- [ ] Notifications arrive at correct times
- [ ] Offline mode handles gracefully
- [ ] Internet reconnection syncs properly
- [ ] All modals open and close correctly
- [ ] Navigation flows work in all directions
- [ ] Performance is smooth with 50+ plants
- [ ] No crashes during any journey
- [ ] Error messages are helpful and clear

### Platform-Specific
- [ ] iOS: Flash works properly
- [ ] Android: Torch works properly
- [ ] iOS: Date picker displays correctly
- [ ] Android: Date picker displays correctly
- [ ] Both: Time picker for notifications works
- [ ] Both: Pull-to-refresh feels responsive

### Data Integrity
- [ ] Mark watered updates immediately
- [ ] Rename plant persists
- [ ] Delete plant removes everywhere
- [ ] Settings save and persist
- [ ] Calendar calculations correct
- [ ] Timezone handling correct
- [ ] Watering history accurate

---

## 🎯 Success Metrics

A successful production release means:
- Users can complete all 16 journeys without confusion
- No critical bugs block core functionality
- App feels fast and responsive
- Visual urgency system helps users prioritize
- Notifications drive daily engagement
- Plant identification has >80% success rate
- Users can recover from mistakes or absences
- Support/bug reporting is easy to access

---

*Last Updated: Production Test List v1.0*

