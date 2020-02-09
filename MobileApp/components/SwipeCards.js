import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import { useNavigation } from '@react-navigation/native';

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
    const [cards, setCards] = React.useState([
                                               {name: '1', image: 'https://media.giphy.com/media/GfXFVHUzjlbOg/giphy.gif'},
                                               {name: '2', image: 'https://media.giphy.com/media/irTuv1L1T34TC/giphy.gif'},
                                               {name: '3', image: 'https://media.giphy.com/media/LkLL0HJerdXMI/giphy.gif'},
                                               {name: '4', image: 'https://media.giphy.com/media/fFBmUMzFL5zRS/giphy.gif'},
                                               {name: '5', image: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif'},
                                               {name: '6', image: 'https://media.giphy.com/media/7r4g8V2UkBUcw/giphy.gif'},
                                               {name: '7', image: 'https://media.giphy.com/media/K6Q7ZCdLy8pCE/giphy.gif'},
                                               {name: '8', image: 'https://media.giphy.com/media/hEwST9KM0UGti/giphy.gif'},
                                               {name: '9', image: 'https://media.giphy.com/media/3oEduJbDtIuA2VrtS0/giphy.gif'},
                                             ]);

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
                <TouchableOpacity style={styles.button} onPress={() => alert('money bitch')}><Text style={styles.buttonText}>{"\uD83D\uDCB0"}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => alert('distance slut')}><Text style={styles.buttonText}>{"\uD83D\uDCCF"}</Text></TouchableOpacity>
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