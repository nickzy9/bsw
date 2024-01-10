import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/UsersScreen';
import PhotoScreen from '../screens/PhotosScreen';
import { RootStackParamList } from '.';

import { Button } from 'react-native-paper';
import { userAlbumManager } from '../services/dataManager';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigatonContainer = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='UserList'>
        <Stack.Screen name='UserList' component={HomeScreen} options={{
          title: 'User List',
          // Enable to clear data
          // headerRight: () => (
          //   <Button onPress={userAlbumManager.clearStorage}> Clear </Button>
          // ),
        }} />
        <Stack.Screen name='Photos' component={PhotoScreen} options={{
          title: '', 
          headerBackVisible: false
          }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};
