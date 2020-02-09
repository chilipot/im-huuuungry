import React from 'react';
import {AsyncStorage} from 'react-native';

const _storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Error saving data
    console.log(`An error occurred when saving ${key}:${value}`)
  }
};

const _retrieveData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      console.log(value);
      return JSON.parse(value);
    }
  } catch (error) {
    // Error retrieving data
    console.log(`An error occurred when retrieving ${key}`)
  }
};

const saveCuisineID = (cuisineID) => {
    const currentCuisines = _retrieveData('cuisines')
    if (currentCuisines.length < 3) {
        let updatedCuisines = currentCuisines.push(cuisineID);
        _storeData('cuisines', updatedCuisines);
    } else {
        console.log("Maximum number of Cuisines set!")
    }
}

const removeCuisineID = (cuisineID) => {
    const currentCuisines = _retrieveData('cuisines')
    if (currentCuisines.length > 0) {
        cuisineIndex = currentCuisines.indexOf(cuisineID);
        if (cuisineIndex > -1) {
            currentCuisines.splice(cuisineIndex, 1);
            _storeData('cuisines', currentCuisines);
        } else {
            console.log("Unable to find the given cuisine.")
        }
    } else {
        console.log("List is empty!")
    }
}

const getSavedCuisineIDs = () => {
    const cuisines = _retrieveData('cuisines')
    if (cuisines > 0) {
        return cuisines
    } else {
        return []
    }
}

export default {saveCuisineID, removeCuisineID, getSavedCuisineIDs, cuisineData}