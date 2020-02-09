import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image, TouchableHighlight, Modal } from 'react-native';
import { NavigationContainer, useTheme } from '@react-navigation/native';
import Constants from 'expo-constants';
import Card from '../components/Card';
import cuisineData from '../storage/cuisines.json';
import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';


const AddCuisine = ({options, select}) => {
      const handleSelect = (value) => {setModalVisible(false); select(value)};
      const { colors, font } = useTheme();

      const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            padding: 30,
            marginTop: Constants.statusBarHeight,
        },
        header: {
        },
        dropdownItem: {
            alignItems: 'center',
            padding: 30
        },
        dropdownText: {
            fontSize: font.normal,
            textAlign: 'center'
        },
        modalButton: {
          fontSize: font.normal,
          color: colors.text,
          textAlign: 'center',
          backgroundColor: 'white',
          borderStyle: 'solid',
          borderRadius: 20,
          borderColor: 'gray',
          padding: 10,
          width: 300,
          margin: 'auto',
        },
      })
       const [modalVisible, setModalVisible] = React.useState(false);

      return (
          <View style={styles.container}>
              <TouchableHighlight style={styles.modalButton} onPress={() => setModalVisible(true)}><Text style={styles.dropdownText}>Add Cuisine</Text></TouchableHighlight>
                <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <TouchableHighlight
                        style={styles.dropdownItem}
                        onPress={() => setModalVisible(false)}>
                            <Text style={styles.dropdownText}>X</Text>
                    </TouchableHighlight>
                    {options.map((optionData) => {
                        return (<TouchableHighlight
                                    style={styles.dropdownItem}
                                    value={optionData}
                                    onPress={() => handleSelect(optionData)}>
                            <Text style={styles.dropdownText}>{optionData.label}</Text>
                        </TouchableHighlight>)
                    })}
                </Modal>
          </View>
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
    const { colors, font } = useTheme();

    const addSelectedCuisineId = (cuisine) => selectCuisineIds([...selectedCuisineIds, cuisine.id])
    const removeSelectedCuisineId = (cuisineId) => selectCuisineIds(selectedCuisineIds.filter(cid => cid != cuisineId))

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
        backgroundColor: colors.background
      },
      header: {
        fontSize: font.large,
        color: colors.text,
        textAlign: 'center'
      },
      card: {
        backgroundColor: colors.card
      }
    });

  return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>What Do You Want?</Text>
              <FlatList
                data={cuisines.filter(c => selectedCuisineIds.includes(c.id))}
                renderItem={({ item }) => <Card title={item.label} emoji={item.emoji} navigation={navigation} target="Details" deleteCuisine={() => removeSelectedCuisineId(item.id)}/>}
                keyExtractor={item => item.id}
              />
              {(selectedCuisineIds.length < 3) ? <AddCuisine options={cuisines.filter(c => !selectedCuisineIds.includes(c.id))} select={addSelectedCuisineId}/> : null}
        </SafeAreaView>
  );
}

export default HomeScreen;