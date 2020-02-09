import React from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, Image } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

function AddScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Add Screen</Text>
      <View>
        <ModalDropdown options={['option1', 'option2']}>
        </ModalDropdown>
      </View>
    </View>
  );
}

export default AddScreen;