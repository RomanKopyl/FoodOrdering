import Button from '@/src/components/Button';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useAuth();

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setIsLoading(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{profile?.username}</Text>

      <Button
        text="Sign out"
        onPress={signOut}
        isLoading={isLoading}
      />
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});