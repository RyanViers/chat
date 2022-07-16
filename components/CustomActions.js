import React from 'react';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useChatContext } from 'react-native-gifted-chat/lib/GiftedChatContext';
import { storage } from './firebase/firebase-config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
//import { useActionSheet } from '@expo/react-native-action-sheet';
//import { Actions } from 'react-native-gifted-chat';

export default function CustomActions(props) {
  //const { onSend } = useChatContext();
  //const { actionSheet } = useChatContext();
  //const { useActionSheetWithOptions } = useActionSheet();

  const uploadImage = async (uri) => {
    //Get uri and turn it into a blob.
    const img = await fetch(uri);
    const imgBlob = await img.blob();

    //Update file path name.
    const filePath = uri.split('/');
    const fileName = filePath[filePath.length - 1];

    //Create reference to the storage path.
    const newImageRef = ref(storage, `images/${fileName}`);

    //Upload image to storage.
    await uploadBytes(newImageRef, imgBlob).then(async (snapshot) => {
      console.log('Uploaded a blob or file!');
      //imgBlob.close();
      //return await getDownloadURL(newImageRef);
    });

    //Return the download url.
    return await getDownloadURL(newImageRef);
  };

  //Lets user to select an image from their camera roll.
  const pickImage = async () => {
    //Request permission to access the camera roll.
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    //If user does not allow permissions, exit function.
    if (status.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    //Let user select an image from their camera roll.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    //If user selected an image, upload it to firebase.
    if (!result.cancelled) {
      const imageUrl = await uploadImage(result.uri);
      props.onSend({
        image: imageUrl,
      });
    }
  };

  //Let user to take a photo with the camera.
  const takePhoto = async () => {
    //Request permissions to use the camera.
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    //If user does not allow permissions, exit function.
    if (status !== 'granted') {
      alert('Permission to access camera is required!');
      return;
    }

    //Let user take a photo with the camera.
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    //If user did not cancel, upload image to firebase.
    if (!result.cancelled) {
      const imageUrl = await uploadImage(result.uri);
      props.onSend({ image: imageUrl });
    }
  };

  //Get the current location of the user.
  const getLocation = async () => {
    //Request permissions to use the location.
    const { status } = await Location.requestForegroundPermissionsAsync();

    //If user does not allow permissions, exit function.
    if (status !== 'granted') {
      alert('Permission to access location is required!');
      return;
    }

    //Get the current location of the user.
    const location = await Location.getCurrentPositionAsync({}).catch(
      (error) => {
        console.log(error);
      }
    );

    //If user did not cancel, upload location to firebase.
    if (location) {
      const { latitude, longitude } = location.coords;
      props.onSend({ location: { latitude, longitude } });
    }
  };

  const { actionSheet } = useChatContext();

  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;

    //Options Menu.
    actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user wants to pick an image');
            return pickImage();
          case 1:
            console.log('user wants to take a picture');
            return takePhoto();
          case 2:
            console.log('user wants to get their location');
            return getLocation();
          default:
        }
      }
    );
  };

  //Action sheet for the options menu.
  return (
    <TouchableOpacity
      style={[styles.container]}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="Picture and Location Options"
      accessibilityHint="Lets you choose to take picture, pick one from picture file, or send geolocation."
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, props.wrapperStyle]}>
        <Text style={[styles.iconText, props.iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};
