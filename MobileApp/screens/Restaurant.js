import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });


const RestaurantScreen = ({route, navigation}) => {
    const { name, image } = route.params
    const { coords, setCoords } = React.useState({'lat': null, 'lng': null});

    const latLng = `${coords['lat']},${coords['lng']}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    return (
        <View>
            <Text>ADDRESS</Text>
            <Text>{name}</Text>
            <Text>{image}</Text>
            <Text style={{color: 'blue'}}
                  onPress={() => Linking.openURL(url)}>
              Maps
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default RestaurantScreen;