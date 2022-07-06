import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Button,
  Pressable,
} from 'react-native';

// Import default background image.
import BackgroundImage from '../assets/BackgroundImage.png';

//Create a functional component for the main screen. Users will see this screen when they open the app and
//be able to enter their name and pick background color.
export default function Start(props) {
  // Create a state variable to store the user's name.
  const [name, setName] = useState('');
  const [bgColor, setBgColor] = useState('#fff');

  //Colors array for user to pick for background color.
  const colors = {
    blue: '#0099ff',
    red: '#ff0000',
    orange: '#ff9900',
    purple: '#9900ff',
    green: '#00ff00',
  };

  //Create handle function to send user's name and background color to the chat screen after authentication.
  const handleSubmit = () => {
    props.navigation.navigate('Chat', { name: name, bgColor: bgColor });
  };
  /*signInAnonymously(auth)
      .then(
        () => {
          props.navigation.navigate('Chat', { name: name, bgColor: bgColor });
          console.log('Signed in anonymously!');
        }
        //If the user is not authenticated, display an error message.
      )
      .catch((error) => {
        alert(error.message);
        console.log(`Error: ${error.message}`);
      });
  };*/

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage}>
        <View style={styles.titleBox}>
          <Text style={styles.title}>Chat App</Text>
        </View>

        <View style={styles.box1}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setName(text)}
              value={name}
              placeholder="Type name ..."
            />
          </View>

          <View style={styles.colorBox}>
            <Text style={styles.chooseColor}>Choose background color:</Text>
          </View>

          {/*Create a button for each color.*/}
          <View style={styles.colorArray}>
            <TouchableOpacity
              style={styles.color1}
              onPress={() => setBgColor(colors.blue)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.color2}
              onPress={() => setBgColor(colors.red)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.color3}
              onPress={() => setBgColor(colors.orange)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.color4}
              onPress={() => setBgColor(colors.purple)}
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.color5}
              onPress={() => setBgColor(colors.green)}
            ></TouchableOpacity>
          </View>

          {/*Create a button to start the chat.*/}
          <Button
            title="Start Chat"
            style={styles.button}
            onPress={handleSubmit}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

/*Create a style sheet for the App.*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleBox: {
    height: '40%',
    width: '88%',
    alignItems: 'center',
    paddingTop: 100,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },

  box1: {
    backgroundColor: 'white',
    height: '60%',
    width: '88%',
    alignItems: 'center',
    marginBottom: 50,
    justifyContent: 'space-around',
  },

  inputBox: {
    height: 40,
    width: '88%',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 1,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    opacity: 0.5,
  },

  colorBox: {
    height: '20%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chooseColor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    opacity: 0.5,
  },

  colorArray: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '88%',
  },

  color1: {
    height: 50,
    width: 50,
    backgroundColor: '#0099ff',
    borderRadius: 25,
  },

  color2: {
    height: 50,
    width: 50,
    backgroundColor: '#ff0000',
    borderRadius: 25,
  },

  color3: {
    height: 50,
    width: 50,
    backgroundColor: '#ff9900',
    borderRadius: 25,
  },

  color4: {
    height: 50,
    width: 50,
    backgroundColor: '#9900ff',
    borderRadius: 25,
  },

  color5: {
    height: 50,
    width: 50,
    backgroundColor: '#00ff00',
    borderRadius: 25,
  },

  button: {
    height: 70,
    width: '88%',
    borderRadius: 8,
    backgroundColor: '#0099ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
