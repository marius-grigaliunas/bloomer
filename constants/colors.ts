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
      primary: '#F8F8F8',
      surface: '#FFFFFF'
    },
    
    primary: {
      medium: '#4F772D',
      deep: '#2E7D32'
    },
    
    secondary: {
      medium: '#90A955',
      deep: '#4F772D'
    },
    
    accent: '#E6B566',
    
    success: '#2E7D32',   // Success green
    warning: '#E6B566',   // Warning yellow
    danger: '#E53935',    // Error/danger red
    info: '#90A955',      
    
    text: {
      primary: '#2F2F2F',
      secondary: '#666666'
    },

    black: '#000000',
    white: '#FFFFFF'
  };
  
  module.exports = colors;