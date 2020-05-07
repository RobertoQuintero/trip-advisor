import * as firebase from "firebase";

export function reauthenticate(passowrd) {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    passowrd
  );
  return user.reauthenticateWithCredential(credentials);
}
