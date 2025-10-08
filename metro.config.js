const { getDefaultConfig } = require("expo/metro-config");
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path mapping for @ alias
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

// Add resolver configuration to handle native modules
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure transformer
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = config;