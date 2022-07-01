import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

//Create a functional component for the chat screen.
export default function Chat(props) {
  //Create variables for the user's name and background color props.
  let { name, bgColor } = props.route.params;
  let [messages, setMessages] = useState([]);

  //Create a function to handle the messages.
  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  });

  //Use the useEffect hook to set the messages.
  useEffect(() => {
    props.navigation.setOptions({ title: name });
    props.navigation.setOptions({ headerShown: true });
    setMessages([
      {
        _id: 1,
        text: 'Hello Developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a test message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, [name]);

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
          _id: 1,
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
