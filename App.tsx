import { NativeModules, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
var DirectSms = NativeModules.DirectSms;
import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter, flex: 1,
  };
  async function sendDirectSms() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          title: 'YourProject App Sms Permission',
          message:
            'YourProject App needs access to your inbox ' +
            'so you can send messages in background.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Get the current location
        Geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationMessage = 'Current Location';
            //`Latitude: ${latitude}, Longitude: ${longitude}`;

            // Construct the map link
            const mapUrl =
              Platform.OS === 'android'
                ? `https://maps.google.com/?q=${latitude},${longitude}`
                : `http://maps.apple.com/?ll=${latitude},${longitude}`;

            // Send the message with the location link
            const phoneNumbers = ['9044271286', '1234567890']; // Add your phone numbers here
            const smsText = `Test Message\n${locationMessage}\n${mapUrl}`;
            DirectSms.sendDirectSms(phoneNumbers, smsText);
          },
          (error) => {
            console.warn('Error getting location:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        console.log('SMS permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  return (
    <View
      style={{
        backgroundColor: Colors.white, flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%'
      }}>
      <TouchableOpacity onPress={() => sendDirectSms()} style={{ backgroundColor: 'orange', padding: 10 }}>
        <Text>SEND</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
