import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';

/**
 * Represents Card component.
 * @constructor
 * @param {string} title - The title of the card.
 * @param {string} navigation - The Navigation Stack provided by the App's NavigationProvider.
 * @param {string} target - The Navigation url name to switch to when pressed.
 * @param deleteCuisine - function prop to delete the cuisine of that this card represents.
 */
function Card({ title, navigation, target, deleteCuisine }) {

    const { colors, font } = useTheme();

    const styles = StyleSheet.create({
      item: {
        backgroundColor: colors.card,
        padding: 30,
        marginVertical: 8,
        marginHorizontal: 16,
      },
      title: {
        fontSize: font.medium,
        color: colors.text,
      },
    });

    let swipeBtns = [{
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => deleteCuisine()
    }]

  return (
    <Swipeout right={swipeBtns}
        autoClose={true}
        backgroundColor='transparent'>
        <TouchableOpacity onPress={() => navigation.navigate(target, {cuisine: title})}>
            <View style={styles.item}>
              <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableOpacity>
    </Swipeout>
  );
}

export default Card;