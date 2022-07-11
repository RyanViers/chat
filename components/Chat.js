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
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { db, auth } from './firebase/firebase-config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

//Create a functional component for the chat screen.
export default function Chat(props) {
  //Create variables for the user's name and background color props.
  const { name, bgColor } = props.route.params;
  const [messages, setMessages] = useState([]);
  const [loggedUser, setLoggedUser] = useState('');
  const [isConnected, setIsConnected] = useState();

  //Create a function to get the user's messages from the database.
  const messagesCollection = collection(db, 'messages');

  //Retrieve messages from async storage.
  const getMessages = async () => {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages');
      setMessages(JSON.parse(messages));
    } catch (e) {
      console.log(e);
    }
  };

  //Save messages to async storage.
  const saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messages));
    } catch (e) {
      console.log(e);
    }
  };

  //Delete messages from async storage.
  const deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (e) {
      console.log(e);
    }
  };

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

    //Check if user is online using NetInfo.
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    });

    if (isConnected) {
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (!user) {
          signInAnonymously(auth);
        }
        setLoggedUser(user.uid);
        setMessages([]);
        /*setMessages([
          {
            _id: 1,
            text: 'Welcome to the chat app!',
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: 'https://placeimg.com/140/140/any',
            },
          },
        ]);*/
      });

      //Create a function to get users messages that match users name and id.
      const messageQuery = query(
        messagesCollection,
        orderBy('createdAt', 'desc'),
        where('user._id', '==', loggedUser)
      );

      //Create a function to get the messages from the database.
      const unsubscribe = onSnapshot(messageQuery, onCollectionUpdate);

      //Remove the listener when the component unmounts.
      return () => {
        unsubscribe();
        unsubscribeAuth();
      };
    } else {
      getMessages();
    }
  }, [isConnected]);

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
    saveMessages(messagesArray);
  };

  //Create a function to add a message to the database.
  const addMessage = (message) => {
    addDoc(messagesCollection, {
      _id: message._id,
      text: message.text || '',
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

  //Hide input bar if user is offline.
  const renderInputToolbar = (props) => {
    if (!isConnected) {
      //Hide input bar if user is offline.
    } else {
      return <InputToolbar {...props} />;
    }
  };

  return (
    <View style={[{ backgroundColor: bgColor }, styles.container]}>
      <GiftedChat
        renderBubble={renderBubble.bind()}
        renderInputToolbar={renderInputToolbar.bind()}
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
