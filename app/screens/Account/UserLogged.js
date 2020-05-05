import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as firebase from "firebase";

const UserLogged = () => {
  return (
    <View>
      <Text>UserLogged</Text>
      <Button title="cerrar sesión" onPress={() => firebase.auth().signOut()} />
    </View>
  );
};

export default UserLogged;

const styles = StyleSheet.create({});
