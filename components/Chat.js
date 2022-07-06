import {
  collection,
  orderBy,
  query,
  onSnapshot,
  addDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { db, auth } from './firebase/firebase-config';
import { onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';

//const firebase = require('firebase');
//require('firebase/firestore');

//Create a functional component for the chat screen.
export default function Chat(props) {
  //Create variables for the user's name and background color props.
  let { name, bgColor } = props.route.params;
  let [messages, setMessages] = useState([]);
  let [loggedUser, setLoggedUser] = useState('');

  //Create a function to get the user's messages from the database.
  const messagesCollection = collection(db, 'messages');

  //Create a function to handle the messages.
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    addMessage(messages[0]);
  });

  //Use the useEffect hook to set the messages.
  useEffect(() => {
    props.navigation.setOptions({ title: name });
    props.navigation.setOptions({ headerShown: true });

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        signInAnonymously(auth);
      }
      setLoggedUser(user.uid);
      setMessages([]);
    });

    //Create a function to get users messages that match users name and id.
    const messageQuery = query(
      messagesCollection,
      orderBy('createdAt', 'desc'),
      where('user._id', '==', loggedUser)
    );

    const unsubscribe = onSnapshot(messageQuery, onCollectionUpdate);

    //Remove the listener when the component unmounts.
    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  //Create a function to handle collection updates.
  const onCollectionUpdate = (querySnapshot) => {
    const messagesArray = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    setMessages(messagesArray);
  };

  //Create a function to add a message to the database.
  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    });
  };

  //Customize the text bubble color.
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
            padding: 10,
          },
          left: {
            backgroundColor: '#fff',
            padding: 10,
          },
        }}
      />
    );
  };

  return (
    <View style={[{ backgroundColor: bgColor }, styles.container]}>
      <GiftedChat
        renderBubble={renderBubble.bind()}
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: loggedUser,
          name: name,
        }}
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
}

//Create a style sheet for the App.
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
