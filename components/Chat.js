import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';

//Create a functional component for the chat screen.
export default function Chat(props) {
  //Create variables for the user's name and background color props.
  const name = props.route.params.name;
  const bgColor = props.route.params.bgColor;
  props.navigation.setOptions({ title: name });

  return (
    <View style={{ background: bgColor, height: '100%', width: '100%' }}>
      <View style={styles.container}>
        {/*<Text style={styles.text}>{name}</Text>*/}
        <Button
          title="Go to Start"
          onPress={() => props.navigation.navigate('Start')}
        />
      </View>
    </View>
  );
}

//Create a style sheet for the App.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
