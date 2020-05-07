import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

const ChangeDisplayNameForm = (props) => {
  const { displayName, setShowModal, toastRef, setReloadUserInfo } = props;
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const onSubmit = () => {
    console.log(newDisplayName);
    setError(null);
    if (!newDisplayName) setError("El nombre no puede estar vació");
    else if (displayName === newDisplayName)
      setError("El nombre no puede ser igual al actual");
    else {
      setisLoading(true);
      const update = { displayName: newDisplayName };
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setReloadUserInfo(true);
          setisLoading(false);
          setShowModal(false);
        })
        .catch(() => {
          setisLoading(false);
          setError("Error al actualizar el nombre");
        });
    }
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Nombre y apellidos"
        containerStyle={styles.input}
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        defaultValue={displayName || ""}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
};

export default ChangeDisplayNameForm;

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
