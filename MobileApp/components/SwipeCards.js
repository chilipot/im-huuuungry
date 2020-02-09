import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import { useNavigation } from '@react-navigation/native';
import { Geolocation } from '@react-native-community/geolocation';

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

const RestaurantCard = (props) => {
    const navigation = useNavigation();
    const [cards, setCards] = React.useState([]);

    React.useEffect(() => getCards(), [])

    Geolocation.getCurrentPosition(
       //Will give you the current location
       (position) => {
           const currentLongitude = JSON.stringify(position.coords.longitude);
           //getting the Longitude from the location json
           const currentLatitude = JSON.stringify(position.coords.latitude);
           //getting the Latitude from the location json
       },
       (error) => alert(error.message),
       {
          enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
       }
    );

    const getCards = () => {
        fetch('')
        .then(res => res.json())
        .then((data) => {
            setCards(data.ids.map(id => data.by_id[id]))
        })
        .catch(e => console.log(e))
    }

    const setCardsLocBranch = () => setCards(data.ids_loc_branch.map(id => data.by_id[id]));
    const setCardsPriceBranch = () => setCards(data.ids_price_branch.map(id => data.by_id[id]));

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
            <View style={styles.buttons}>
                <TouchableOpacity style={styles.button} onPress={() => setCardsLocBranch()}><Text style={styles.buttonText}>{"\uD83D\uDCB0"}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setCardsPriceBranch()}><Text style={styles.buttonText}>{"\uD83D\uDCCF"}</Text></TouchableOpacity>
            </View>
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