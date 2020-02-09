import React from 'react';
import { View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';
import RestaurantScreen from './screens/Restaurant';

const Stack = createStackNavigator();

export default function App() {
  const scheme = useColorScheme();

  return (
        <AppearanceProvider>
            <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen}/>
                    <Stack.Screen name="Details" component={DetailsScreen}/>
                    <Stack.Screen name="Restaurant" component={RestaurantScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
  );
}