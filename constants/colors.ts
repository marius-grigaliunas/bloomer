// src/constants/colors.js
const colors = {
  /*
    Light Mode

    Primary Purple: #AB8BFF (medium purple)
    Secondary Purple: #D6C7FF (light lavender)
    Primary Green: #4CAF50 (vibrant green)
    Secondary Green: #8BC34A (light green)
    Background: #F8F6FF (very light lavender)
    Surface: #FFFFFF (white)
    Text Primary: #333333 (dark gray)
    Text Secondary: #666666 (medium gray)
    Accent: #FF9800 (orange, for notifications/alerts)

    Dark Mode

      Primary Purple: #AB8BFF (medium purple)
      Secondary Purple: #8667D8 (deeper purple)
    Primary Green: #2E7D32 (deep green)
    Secondary Green: #66BB6A (medium green)
      Background: #0F0D23 (deep blue-purple, as you specified)
      Surface: #1A172F (slightly lighter than background)
      Text Primary: #FFFFFF (white)
      Text Secondary: #BBBBBB (light gray)
      Accent: #FFB74D (light orange, for notifications/alerts)
  */

    // Main background colors (dark theme)
    background: {
      primary: '#0F0D23',
      surface: '#1A172F'
    },
    
    primary: {
      medium: '#AB8BFF',
      deep: '#8667D8'
    },
    
    secondary: {
      medium: '#66BB6A',
      deep: '#2E7D32'
    },
    
    accent: '#FFB74D',
    
    success: '#4CAF50',   // Success green
    warning: '#FFCA28',   // Warning yellow
    danger: '#EF5350',    // Error/danger red
    info: '#29B6F6',      // Info blue
    
    text: {
      primary: '#FFFFFF',
      secondary: '#BBBBBB'
    }
  };
  
  export default colors;