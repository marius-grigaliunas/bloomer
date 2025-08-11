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

- UI polish
  - Refine styling and transitions
    - Buttons on the plant details page need changing
    - Missing day styling needs improving
  - Implement loading states
- Performance optimization
  - image compression
  - Image caching
  - Optimize Appwrite queries
  - Calendar caching and lazy loading
  - Pre-generation of watering days
- Testing and debugging
  - Test full user journeys
  - Fix critical bugs
- Final testing and documentation
  - User testing
  - Create README and documentation
  - Prepare for deployment
  - Deploy

### TODO

- [x] In the calendar, when selecting another day, the needs to be colored a different color on the calendar.
- [x] preload the calendar with the watering days so the ui loading would be instantaneous
- [ ] Show how many days overdue in the plant details tab
- [ ] Check and fix every instance of the loading screen
- [x] Forms in the settings screen need form validation
  - implemented selectables only.
- [ ] User is seeing the image steps and loading message while waiting for the response, make it look cohesive
