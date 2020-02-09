import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image } from 'react-native';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';
import Card from '../components/Card';
import cuisineData from '../storage/cuisines.json';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, close } from "react-native-popup-menu";



const AddCuisine = ({options, select}) => {
      const [menuOpen, setMenuOpen] = React.useState(false)

      const handleSelect = (value) => {setMenuOpen(false); select(value)};
      return (
          <MenuProvider style={{ flexDirection: "column", padding: 30 }}>
            <Menu opened={menuOpen} onSelect={value => handleSelect(value)} onBackdropPress={() => setMenuOpen(false)} onRequestClose={() => setMenuOpen(false)}>

              <MenuTrigger onPress={() => setMenuOpen(true)} text="Add Cuisine"/>

              <MenuOptions>
                {options.map((optionData) => {
                    return (<MenuOption value={optionData}>
                        <Text>{optionData.label}</Text>
                    </MenuOption>)
                })}
              </MenuOptions>

            </Menu>
          </MenuProvider>
        );
}

function convertUnicode(input) {
  return input.replace(/\\u(\w\w\w\w)/g,function(a,b) {
    var charcode = parseInt(b,16);
    return String.fromCharCode(charcode);
  });
}

/**
 * Represents the application Home Screen
 * @constructor
 * @param navigation - The Navigation Stack provided by the App's NavigationProvider
 */
function HomeScreen({navigation}) {
    const [cuisines, setCuisines] = React.useState(cuisineData);
    const [selectedCuisineIds, selectCuisineIds] = React.useState([]);
    const { colors } = useTheme();

    const addSelectedCuisineId = (cuisine) => selectCuisineIds([...selectedCuisineIds, cuisine.id])
    const removeSelectedCuisineId = (cuisineId) => selectCuisineIds(selectedCuisineIds.filter(cid => cid != cuisineId))

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: colors.background

      },
      header: {
        fontSize: 32,
        color: colors.text
      },
    });

  return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>What Do You Want?</Text>
              <FlatList
                data={cuisines.filter(c => selectedCuisineIds.includes(c.id))}
                renderItem={({ item }) => <Card title={`${item.label} ${convertUnicode(item.emoji)}`} navigation={navigation} target="Details" deleteCuisine={() => removeSelectedCuisineId(item.id)}/>}
                keyExtractor={item => item.id}
              />
              {(selectedCuisineIds.length < 3) ? <AddCuisine options={cuisines.filter(c => !selectedCuisineIds.includes(c.id))} select={addSelectedCuisineId}/> : null}
        </SafeAreaView>
  );
}

export default HomeScreen;