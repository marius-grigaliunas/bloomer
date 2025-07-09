# Plant care app - Bloomer

## react.native  + expo app + appwrite

### features

- Authentication
- Plant Gallery
- Plant Detail View
- Camera Integration
- Image Processing
- Notification Management
- Plant Identification
- Care Calendar

## Plan

### Week 1: Setup & Planning (Mar 10-16)

- **Days 1-2:** Project setup and environment configuration
  - [x] Watch react native tutorials
  - [x] Set up React Native with Expo
  - [x] Create Appwrite account and project
  - [x] Configure development environment
- **Days 3-4:** Database schema design
  - [x] Design Appwrite Collections for Users
  - [x] Design Plant Collection with care requirements
  - [x] Design WateringSchedule Collection
- **Days 5-7:** API planning
  - [x] Research PlantApi for plant identification
  - [x] Create API key and test with sample images
  - [ ] Map out required Appwrite functions and endpoints

### Week 2: Appwrite Integration & Authentication (Mar 17-23)

- **Days 1-2:** Authentication setup
  - [x] Implement Appwrite Auth for user registration and login
  - [x] Set up google verification
  - [x] Configure OAuth providers (optional)
- **Days 3-5:** Database collections setup
  - [x] Create database collections in Appwrite Console
  - [x] Set up security rules and permissions
- **Days 6-7:** Storage configuration
  - [x] Configure file permissions

### Week 3: Basic Mobile App (Mar 24-30)

- **Days 1-2:** App navigation and UI skeleton
  - [x] Design The UI
  - [x] Set up React Navigation
  - [x] Create basic screen components
- **Days 3-4:** Authentication screens
  - [x] Implement login/signup UI
  - [x] Connect to Appwrite Auth SDK
- **Days 5-7:** Plant list and detail screens
  - [x] Create plant listing component
  - [x] Build plant detail view
  - [x] Implement add/edit plant functionality with Appwrite Database SDK

### Week 4: Core Features (Mar 31-Apr 6)

- **Days 1-3:** Camera integration
  - [x] Implement image capture functionality
  - [x] Send captured images to <pl@nt.net> api, for now direct api call,
  - [?] later needs a protected api route
  - [x] build the result view
- **Days 4-7:** Plant care with AI
  - [x] Implement response parsing to extract structured data
  - [x] Build results display component
  - [x] Create "add identified plant to collection" flow

### Scheduling and Notifications (June 9-15)

- **Days 1-3:** Watering schedule UI
  - [x] Create schedule view and calendar
- **Days 4-5:** Notification system
  - [x] Set up scheduled Appwrite Functions for notifications
  - [x] Configure push notification service (appwrite)
  - [ ] Connect notifications to user preferences

### Last step

- UI polish
  - Refine styling and transitions
    - Buttons on the plant details page need changing
    - Missing day styling needs improving
  - Implement loading states
- Performance optimization
  - image compression
  - Image caching
  - Optimize Appwrite queries
- Testing and debugging
  - Test full user journeys
  - Fix critical bugs
- Final testing and documentation
  - User testing
  - Create README and documentation
  - Prepare for deployment
  - Deploy

### TODO

- notifications and appwrite functions for watering days/ reminde
  - every time user refreshes the main page, he gets a notification if any of the plants need watering
    - Fix was implemented, need a rebuild to check.
- The loading screen has a white background.
  - This needs an inspection of where the loading screens were used and need to rewritten to create the overlay effect.

- Add a profile settings view, where the user can check and edit the settings like the notification settings, measurements,
  - Forms in the settings screen need form validation
  - Settings need to be updated in database

- Generate a push token for every user as it's notifications are set up
  - Push token generation worked, function executed on appwrite send a push notification to the main test user. Test with others

- Make that the new users have their userId the same as the documentId containing the user data. For now, I will change it manually in appwrite. (fix implemented, make sure it works properly)
  
- Show how many days overdue in the plant details tab

- [ ] Update `PlantCareInfo` and `DatabasePlantType` interfaces to include both metric and imperial units for temperature and watering amount.
- [ ] Update Appwrite Plants collection schema to add `wateringAmountOz`, `minTemperatureF`, and `maxTemperatureF` fields.
- [ ] Update the AI prompt template to request both metric and imperial units for temperature and watering amount.
- [ ] Update the response parser to extract and validate both metric and imperial values from the AI response.
- [ ] Update plant creation and update logic to save all four values (metric and imperial) to the database.
- [ ] Update UI to display plant care information using the user's preferred unit system.
