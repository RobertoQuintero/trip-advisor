import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

const ChangeEmailForm = (props) => {
  const { email, setShowModal, toastRef, setReloadUserInfo } = props;
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultValue());
  const [loading, setLoading] = useState(false);

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };

  const onSubmit = () => {
    setError({});
    if (!formData.email || email === formData.email) {
      setError({
        email: "el email no ha cambiado",
      });
    } else if (!validateEmail(formData.email)) {
      setError({
        email: "Email incorrecto",
      });
    } else if (!formData.password) {
      setError({
        password: "La contraseña no puede estar vacía",
      });
    } else {
      setLoading(true);
      reauthenticate(formData.password)
        .then((response) => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setShowModal(false);
            })
            .catch(() => {
              setError({ email: "Error al  actualizar email" });
              setLoading(false);
            });
          console.log(response);
        })
        .catch(() => {
          setLoading(false);
          setError({ password: "La contraseña no es correcta" });
        });
    }
  };
  return (
    <View style={styles.view}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.input}
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={error.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-off-outline" : "eye-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={error.password}
      />
      <Button
        title="Cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      />
    </View>
  );
};

export default ChangeEmailForm;

const defaultValue = () => {
  return {
    email: "",
    password: "",
  };
};

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
