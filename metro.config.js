const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add path mapping for @ alias
config.resolver.alias = {
  '@': path.resolve(__dirname, '.'),
};

config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configure transformer
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

module.exports = withNativeWind(config, { input: "./app/global.css" });