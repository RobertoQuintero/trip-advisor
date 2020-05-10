import React, { useState, useCallback, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";

import { firebaseapp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseapp);
import Loading from "../../components/Loading";
import Carousel from "../../components/Carousel";
const screenWidth = Dimensions.get("window").width;

import { Rating, ListItem, Icon } from "react-native-elements";
import Map from "../../components/Map";
import { map } from "lodash";
import ListReviews from "../../components/Restaurants/ListReviews";
//
import { useFocusEffect } from "@react-navigation/native";
//
import Toast from "react-native-easy-toast";

export default Restaurant = (props) => {
  const { navigation, route } = props;
  const { id, name } = route.params;
  navigation.setOptions({ title: name });
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  //
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  //
  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });
  //
  const toastRef = useRef();

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setRating(data.rating);
          setRestaurant(data);
        });
    }, [])
  );
  useEffect(() => {
    if (userLogged && restaurant) {
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get() //idiota que no se te olvide este!!! :(
        .then((response) => {
          if (response.docs.length) {
            setIsFavorite(true);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userLogged, restaurant]);
  //
  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para  usar el sistema de favoritos tienes que estar loggeado"
      );
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id,
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Restaurante añadido a favoritos");
        })
        .catch(() => {
          toastRef.current.show("Error al añadir el restaurante a favoritos");
        });
    }
  };
  const removeFavorite = () => {
    db.collection("favorites")
      .where("idRestaurant", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show("Eliminado de favoritos");
            })
            .catch(() => {
              toastRef.current.show("error al eliminar de favoritos");
            });
        });
      });
  };

  if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;
  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorite}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <Carousel
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReviews
        navigation={navigation}
        idRestaurant={restaurant.id}
        setRating={setRating}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
};

function TitleRestaurant(props) {
  const { name, description, rating } = props;

  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(rating)} //se convierte en caso de recibir string
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

function RestaurantInfo(props) {
  const { location, name, address } = props;
  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: "111 222 333",
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: "user@gmail.com",
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
  ];
  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurant
      </Text>
      <Map location={location} name={name} height={150} />
      {map(listInfo, (item, index) => (
        <ListItem
          key={index.toString()}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 5,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    padding: 5,
    paddingLeft: 15,
  },
});
