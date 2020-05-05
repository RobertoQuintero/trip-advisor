import React, { useState, useEffect } from "react";
import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import * as firebase from "firebase";
import Loading from "../../components/Loading";

const Account = () => {
  const [login, setLogin] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      !user ? setLogin(false) : setLogin(true);
      //si user es null el usuario no esta loggeado
      //esta peticion devuelve el contenido de user o null
    });
  }, []);

  if (login === null) return <Loading isVisible={true} text="Cargando" />;

  return login ? <UserLogged /> : <UserGuest />;
};

export default Account;
