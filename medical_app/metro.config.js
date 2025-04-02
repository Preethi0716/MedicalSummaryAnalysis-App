// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
module.exports = withNativeWind(config, { input: './global.css' })


config.resolver = config.resolver || {};  
config.resolver.assetExts = config.resolver.assetExts || [];

config.resolver.assetExts.push("pte", "bin");

