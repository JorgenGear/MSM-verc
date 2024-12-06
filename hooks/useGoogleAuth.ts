import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { supabase } from '@/lib/supabase';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = Constants.expoConfig?.extra?.googleClientId as string;
const GOOGLE_ANDROID_CLIENT_ID = Constants.expoConfig?.extra?.googleAndroidClientId as string;
const GOOGLE_IOS_CLIENT_ID = Constants.expoConfig?.extra?.googleIosClientId as string;

export function useGoogleAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [_, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    webClientId: GOOGLE_CLIENT_ID,
    expoClientId: GOOGLE_CLIENT_ID,
  });

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;

        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: authentication?.accessToken || '',
        });

        if (error) throw error;

        // Create or update profile
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: data.user.user_metadata.full_name,
              email: data.user.email,
              avatar_url: data.user.user_metadata.avatar_url,
              updated_at: new Date().toISOString(),
            });

          if (profileError) throw profileError;
        }

        return data;
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
  };
} 