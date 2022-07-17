import React, { useEffect, useState, useCallback } from 'react';
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  addDoc,
} from 'firebase/firestore';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { db, auth } from './firebase/firebase-config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

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
      messages = (await AsyncStorage.getItem('messages')) || [];
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
  }, []);

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
      //Create a listener for authentication state changes.
      const authUnsubscribe = onAuthStateChanged(auth, (user) => {
        if (!user) {
          signInAnonymously(auth);
        }
        setLoggedUser(user.uid);
      });

      //Create a function to get users messages that match users name and id.
      const messageQuery = query(
        messagesCollection,
        orderBy('createdAt', 'desc')
      );

      //Create a listener for collection changes.
      const unsubscribe = onSnapshot(messageQuery, onCollectionUpdate);

      //Remove the listener when the component unmounts.
      return () => {
        unsubscribe();
        authUnsubscribe();
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
      messagesArray.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image,
        location: data.location,
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
      image: message.image || null,
      location: message.location || null,
    });
  };

  //Customize the text bubble color.
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#D3D3D3',
          },
          left: {
            backgroundColor: '#848884',
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

  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3,
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[{ backgroundColor: bgColor }, styles.container]}>
      <GiftedChat
        renderBubble={renderBubble.bind()}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
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
