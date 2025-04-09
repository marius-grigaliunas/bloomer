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
	- [ ] Watch react native tutorials
	- [x] Set up React Native with Expo
    - [x] Create Appwrite account and project
    - [x] Configure development environment
- **Days 3-4:** Database schema design
    - [ ] Design Appwrite Collections for Users
    - [ ] Design Plant Collection with care requirements
    - [ ] Design WateringSchedule Collection
- **Days 5-7:** API planning
    - [x] Research PlantApi for plant identification
    - Create API key and test with sample images
    - Map out required Appwrite functions and endpoints

### Week 2: Appwrite Integration & Authentication (Mar 17-23)

- **Days 1-2:** Authentication setup
    - [x] Implement Appwrite Auth for user registration and login
    - [x] Set up google verification
    - [x] Configure OAuth providers (optional)
- **Days 3-5:** Database collections setup
    - [ ] Create database collections in Appwrite Console
    - [ ] Set up security rules and permissions
    - [ ] Create indexes for efficient queries
- **Days 6-7:** Storage configuration
    - Set up Appwrite Storage buckets for plant images
    - Configure file permissions
    - Test upload and retrieval

### Week 3: Basic Mobile App (Mar 24-30)

- **Days 1-2:** App navigation and UI skeleton
    - [x] Design The UI
    - [x] Set up React Navigation
    - [x] Create basic screen components
- **Days 3-4:** Authentication screens
    - [x] Implement login/signup UI
    - [x] Connect to Appwrite Auth SDK
- **Days 5-7:** Plant list and detail screens
    - [ ] Create plant listing component
    - [ ] Build plant detail view
    - [ ] Implement add/edit plant functionality with Appwrite Database SDK

### Week 4: Core Features (Mar 31-Apr 6)

- **Days 1-3:** Camera integration
    - Implement image capture functionality
    - Send captured images to pl@nt.net api, for now direct api call, later needs a protected api route
    - build the result view
- **Days 4-7:** Plant identification with AI
    - Implement response parsing to extract structured data
    - Build results display component
    - Create "add identified plant to collection" flow

### Week 5: Scheduling and Notifications (Apr 7-13)

- **Days 1-3:** Watering schedule UI
    - Create schedule view and calendar
    - Implement schedule creation/editing with Appwrite Database
- **Days 4-5:** Notification system
    - Set up scheduled Appwrite Functions for notifications
    - Configure push notification service (like Firebase or Expo Notifications)
    - Connect notifications to user preferences
- **Days 6-7:** Testing and debugging
    - Test full user journeys
    - Fix critical bugs

### Week 6: Polish and Launch Prep (Apr 14-20)

- **Days 1-2:** UI polish
    - Refine styling and transitions
    - Implement loading states
- **Days 3-4:** Performance optimization
    - Image caching
    - Optimize Appwrite queries
- **Days 5-7:** Final testing and documentation
    - User testing
    - Create README and documentation
    - Prepare for deployment