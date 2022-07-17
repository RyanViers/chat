# React Native Chat Application

## Description

This project is a chat application built with React Native to use the same codebase for updates and development across different OS (iOS & Android). Users will be able to chat with other users by sending texts,
sending images (via by taking a picture or picking one on the camera roll), and sending users geo-location.

### User Stories

- As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
- As a user, I want to be able to send messages to my friends and family members to exchange the latest news.
- As a user, I want to send images to my friends to show them what I’m currently doing
- As a user, I want to share my location with my friends to show them where I am.
- As a user, I want to be able to read my messages offline so I can reread conversations at any time.
- As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

### Technology

- **React Native**
- **React-Navigation**
- **React Native Gifted Chat**
- **React Native Async Storage**
- **Expo (ImagePicker & Location API)**
- **NetInfo**
- **Google Firebase(Firestore Database & Cloud Storage)**
- **Android Studio & iPhone**

# Development Environment Setup

## Core

- Download CodeBase from [GitHub](https://github.com/RyanViers/chat)
- Install Expo CLI Globally (`npm install -g expo-cli`)
- Create a new expo project and name it. (`expo init [project name]`)
- Start expo by running `expo start` in the project directory.

## Install All Dependencies

- Install all dependencies (`npm install`)
- Run the app (`expo start`) from root directory of the project.
- Open the app on your physical device, an emulator, or a simulator.

## Set Up Firebase as Database

- Install Firebase Database and Cloud Storage (`npm install --save firebase`)
- Create your own Google Firebase account (`https://firebase.google.com/`)
- Register App in Firebase settings
- Copy config code to your project
- Initialize app
  - const app = intializeApp(firebaseConfig);
  - const db = getFirestore(app);
- Set up anonymous authentication
  - const auth = getAuth(app);
- Set up storage
  - const storage = getStorage(app);

## Set up Async Storage for Offline Storage

- Install Async Storage (`npm install --save async-storage`)
  - expo install @react-native-community/async-storage
- import AsyncStorage into your project
  - import { AsyncStorage } from '@react-native-community/async-storage';
- Store and retrieve data from AsyncStorage when offline.
