import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const Card = (props) => {
    return (
      <View style={styles.card}>
        <Image style={styles.thumbnail} source={{uri: props.image}} />
        <Text style={styles.text}>This is card {props.name}</Text>
      </View>
    )
}

const NoMoreCards = (props) => {
    return (
        <View>
            <Text style={styles.noMoreCardsText}>No more cards</Text>
        </View>
    )
}

const DetailsCard = (props) => {
    return (
        <View>
            <Text style={styles.noMoreCardsText}>ADDRESS</Text>
        </View>
    )
}

const { manifest } = Constants;

const uri = `http://localhost:5000`;

const RestaurantCard = (props) => {
    const navigation = useNavigation();
    const [cards, setCards] = React.useState([]);
    const [currentLocation, setCurrentLocation] = React.useState({location: null, errorMessage: null});
    const [apiData, setApiData] = React.useState()

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
          setCurrentLocation({
            errorMessage: 'Permission to access location was denied',
          });
        }

        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({location});
        console.warn(location);
    };

    React.useEffect(() => {
        console.warn('Loading GeoLocation');
        if (Platform.OS === 'android' && !Constants.isDevice) {
            setCurrentLocation({location: currentLocation.location, errorMessage: "Android bitch"})
        } else {
            _getLocationAsync();
        }
    },[])

    const getCards = () => {
        if (currentLocation.location != null) {
            console.warn('Loading Cards');
            const params = `coords=${currentLocation.location.coords.latitude},${currentLocation.location.longitude}&cuisine=burgers&use_cache=True`;
            const apiUrl = uri + '/restaurants?' + params;
            console.warn(apiUrl);
            fetch(apiUrl)
            .then(res => res.json())
            .then((data) => {
                setApiData(data);
                setCards(data.ids.map(id => data.by_id[id]))
                console.warn(cards);
            })
            .catch(e => console.log(e))
        }
    }

    React.useEffect(() => {
        getCards();
    }, [currentLocation])


    const setCardsLocBranch = () => setCards(apiData.ids_loc_branch.map(id => apiData.by_id[id]));
    const setCardsPriceBranch = () => setCards(apiData.ids_price_branch.map(id => apiData.by_id[id]));

    const handleYup = (card) => {
        console.log(`Yup for ${card.name}`);
        navigation.navigate('Restaurant', card);
    }
    const handleNope = (card) => console.log(`Nope for ${card.name}`)

    return (
        <SafeAreaView>
            <SwipeCards
                cards={cards}
                renderCard={(cardData) => <Card {...cardData}/>}

                handleYup={(card) => handleYup(card)}
                handleNope={(card) => handleNope(card)}

                smoothTransition={true}
            />
            {(cards.length > 0) ?
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={() => setCardsLocBranch()}><Text style={styles.buttonText}>{"\uD83D\uDCB0"}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setCardsPriceBranch()}><Text style={styles.buttonText}>{"\uD83D\uDCCF"}</Text></TouchableOpacity>
            </View> : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1,
  },
  thumbnail: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between'

  },
  button: {
    padding: 30,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1
  },
  buttonText: {
    fontSize: 30
  }
})

export default RestaurantCard;