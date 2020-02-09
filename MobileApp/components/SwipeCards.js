import React from 'react';
import { Platform, StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView , Linking} from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import Constants from 'expo-constants';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';


const uri = 'http://danguddemi.pythonanywhere.com';

const priceLevelMap = {
    1: "$1-10",
    2: "$11-20",
    3: "$21-30",
    4: "$31+"
}

const weight_incr = 5;

const secondsAsTimeStr = (secs) => {
    let mins = Math.floor(secs / 60);
    let hrs = Math.floor(mins / 60);
    let timeStr = "";
    if (hrs > 0) {
        timeStr += `${hrs} hr${hrs == 1 ? "" : "s"} `
        mins -= 60 * hrs
        if (mins > 0) {
            timeStr += `and ${mins} mins`
        }
    } else {
        timeStr += `${mins} mins`
    }
    return timeStr
}

const Card = (props) => {
    const [photoUrl, setPhotoUrl] = React.useState()
    const {colors, font} = useTheme();
    const cardStyles = StyleSheet.create({
        card: {
            alignItems: 'center',
            borderRadius: 5,
            overflow: 'hidden',
            borderColor: 'grey',
            backgroundColor: 'white',
            borderWidth: 1,
            elevation: 1,
            padding: 30,
            width: wp('80%'),
            height: wp('100%'),
        },
        name: {
            fontSize: font.large,
            color: colors.text,
            textAlign: 'center'
        },
        meta: {
            fontSize: font.medium,
            color: colors.text,
            textAlign: 'center',
        },
        thumbnail: {
          flex: 1,
          alignSelf: 'stretch',
            width: '100%',
            height: 'auto',
            borderColor: 'gray',
            borderStyle: 'solid',
            borderWidth: 1
        }
    })

    React.useEffect(() => {
        const apiUrl = uri + '/photo/' + props._photo_refs[0];
        fetch(apiUrl)
        .then(res => res.json())
        .then((data) => {
            console.warn(data);
            setPhotoUrl(data.url);
        })
        .catch(e => console.log(e))
    }, [props._photo_refs])


    return (
      <View style={cardStyles.card}>
        <Image style={cardStyles.thumbnail} source={{uri: photoUrl || 'http://www.n-aana.org/_images/board%20photos/Image_Missing_placeholder.jpg'}} />
        <Text style={cardStyles.meta}>{secondsAsTimeStr(props.travel_info.walking.duration)}{"\uD83D\uDEB6"}</Text>
        <Text style={cardStyles.meta}>{priceLevelMap[props.price_level]}</Text>
        <Text style={cardStyles.name}>{props.name}</Text>
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
    const [currentLocation, setCurrentLocation] = React.useState({location: null, errorMessage: null});
    const [apiData, setApiData] = React.useState();
    // loc, rating, price
    const [weights, setWeights] = React.useState([1, 1, 1]);

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
            const params = `coords=${currentLocation.location.coords.latitude},${currentLocation.location.coords.longitude}&cuisine=${props.cuisine}&use_cache=True&wt_loc=${weights[0]}&wt_rating=${weights[1]}&wt_price=${weights[2]}`;
            const apiUrl = uri + '/restaurants?' + params;
            console.warn(apiUrl);
            fetch(apiUrl)
            .then(res => res.json())
            .then((data) => {
                console.warn(data);
                setApiData(data);
                setCards(data.ids.map(id => data.by_id[id]))
                console.warn(cards);
            })
            .catch(e => console.log(e))
        }
    }

    React.useEffect(() => {
        getCards();
    }, [currentLocation, weights])


    const setCardsLocBranch = () => {
        setWeights([weights[0] + weight_incr, weights[1], weights[2]]);

    };
    const setCardsPriceBranch = () => {
        setWeights([weights[0], weights[1], weights[2] + weight_incr]);
    }

    const handleYup = (card) => {
        console.log(`Yup for ${card.name}`);

        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${card.lat},${card.lng}`;
        const label = card.name;
        const url = Platform.select({
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`
        });

        Linking.openURL(url);
    }
    const handleNope = (card) => console.log(`Nope for ${card.name}`)

    console.warn(`WEIGHTS: ${weights}`);
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
                <TouchableOpacity style={styles.button} onPress={setCardsPriceBranch}><Text style={styles.buttonText}>{"\uD83D\uDCB0"}</Text></TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={setCardsLocBranch}><Text style={styles.buttonText}>{"\uD83D\uDCCF"}</Text></TouchableOpacity>
            </View> : null}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  text: {
    fontSize: wp('5%'),
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
    padding: 40,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'white'
  },
  buttonText: {
    fontSize: 64
  }
})

export default RestaurantCard;