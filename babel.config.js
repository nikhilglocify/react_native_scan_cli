module.exports = {
  presets: ['module:@react-native/babel-preset','nativewind/babel',],
  plugins: [
    'react-native-reanimated/plugin', // Plugin for Reanimated
    "module:react-native-dotenv"
  ],
};
