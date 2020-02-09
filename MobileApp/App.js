import React from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';


const Stack = createStackNavigator();

export default function App() {
  const MainTheme = {
      dark: false,
      colors: {
        primary: 'rgb(255, 45, 85)',
        background: 'rgb(180, 150, 255)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(199, 199, 204)',
      },
      font: {
        normal: 32,
        medium: 48,
        large: 64
      }
  }

  return (
        <AppearanceProvider>
            <NavigationContainer theme={MainTheme}  >
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Details" component={DetailsScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
  );
}