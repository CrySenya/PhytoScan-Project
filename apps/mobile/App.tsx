import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen       from './src/screens/HomeScreen';
import ScanScreen       from './src/screens/ScanScreen';
import ExploreScreen    from './src/screens/ExploreScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen    from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#1B5E20' }}>
          <Tab.Screen name='Home'        component={HomeScreen} />
          <Tab.Screen name='Scan'        component={ScanScreen} />
          <Tab.Screen name='Explore'     component={ExploreScreen} />
          <Tab.Screen name='Leaderboard' component={LeaderboardScreen} />
          <Tab.Screen name='Profile'     component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
