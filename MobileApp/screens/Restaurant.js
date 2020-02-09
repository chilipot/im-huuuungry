import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import MapView from 'react-native-maps';

const RestaurantScreen = ({route, navigation}) => {
    const { name, image } = route.params
    return (
        <View>
            <Text>ADDRESS</Text>
            <Text>{name}</Text>
            <Text>{image}</Text>
            <View style={{height:400}}>
            <MapView
                style={{flex: 1}}
                region={{
                    latitude: 42.882004,
                    longitude: 74.582748,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                    }}
                showsUserLocation={true}
            />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default RestaurantScreen;