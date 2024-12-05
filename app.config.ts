import { ExpoConfig, ConfigContext } from 'expo/config';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default ({ config }: ConfigContext): ExpoConfig => {
  // Ensure environment variables are loaded
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleAndroidClientId = process.env.GOOGLE_ANDROID_CLIENT_ID;
  const googleIosClientId = process.env.GOOGLE_IOS_CLIENT_ID;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      'Missing Supabase environment variables. Please check your .env file.'
    );
  }

  if (!googleClientId) {
    console.warn(
      'Missing Google OAuth credentials. Please check your .env file.'
    );
  }

  return {
    ...config,
    name: 'MainStreet Markets',
    slug: 'mainstreet-markets',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'mainstreet-markets',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#232f3e'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.mainstreet.markets',
      infoPlist: {
        NSCameraUsageDescription: 'This app uses the camera to let sellers take product photos.',
        NSPhotoLibraryUsageDescription: 'This app uses the photo library to let sellers choose product images.',
      },
      config: {
        googleSignIn: {
          reservedClientId: googleIosClientId,
        },
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#232f3e'
      },
      package: 'com.mainstreet.markets',
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE'
      ],
      googleServicesFile: './google-services.json',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-image-picker',
        {
          photosPermission: 'The app accesses your photos to let you share them with your customers.',
          cameraPermission: 'The app accesses your camera to let you take product photos.'
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    },
    extra: {
      supabaseUrl,
      supabaseAnonKey,
      googleClientId,
      googleAndroidClientId,
      googleIosClientId,
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    }
  };
}; 