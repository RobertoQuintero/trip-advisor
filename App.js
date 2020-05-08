import React, { useEffect } from "react";
import Navigation from "./app/navigations/Navigation";
import { firebaseapp } from "./app/utils/firebase";
import * as firebase from "firebase";
import { YellowBox } from "react-native";
import { decode, encode } from "base-64"; //for atob

YellowBox.ignoreWarnings(["Setting a timer"]);
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;
export default function App() {
  // useEffect(() => {
  //   firebase.auth().onAuthStateChanged((user) => {
  //     console.log(user);
  //   });
  // }, []);
  return <Navigation />;
}
