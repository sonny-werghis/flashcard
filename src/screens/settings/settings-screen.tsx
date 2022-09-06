import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle, SafeAreaView } from 'react-native';
import { STATUS_IDLE, STATUS_ERROR, STATUS_LOADING, STATUS } from '@constants/statuses';
import { MainView } from '@components/main-view';
import { Button } from '@components/button';
import { ErrorMessage } from '@components/error-message';
import { Spacer } from '@components/spacer';
import { Text } from '@components/text';
import { themes } from '@theme/theme-context';
import { ActivityIndicator } from '@components/activity-indicator';
import { SETTINGS_THEME_BUTTON, SETTINGS_SCREEN_ID } from '@e2e/ids';
import { useToggleTheme } from '@theme/use-toggle-theme';
import { useTheme } from '@theme/use-theme';
import { TextInput } from 'react-native-gesture-handler';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Slider from '@react-native-community/slider';

import SInfo from "react-native-sensitive-info";

export function SettingsScreen() {
  const [status, setStatus] = useState<STATUS>(STATUS_IDLE);
  const [error, setError] = useState('');
  const toggleTheme = useToggleTheme();
  const theme = useTheme();
  const [checked, setChecked] = useState(false);
  const [transpValue, setTransparencyValue] = useState(0.0);
  const [fontSizeValue, setFontSizeValue] = useState(1);

  const PREFS_NAME = "com.werghis.flashcards.FlashcardWidget";
  const PREF_RANDOMIZE_KEY = "flashcardWidget_randomize";
  const PREF_TRANSPARENCY_KEY = "flashcardWidget_transparency";
  const PREF_FONTSIZE_KEY = "flashcardWidget_fontsize";

  // Set stored values
  SInfo.getItem(PREF_RANDOMIZE_KEY, {
    sharedPreferencesName: PREFS_NAME
  }).then( (value) => {
    setChecked(value == "true")
  });

  SInfo.getItem(PREF_TRANSPARENCY_KEY, {
    sharedPreferencesName: PREFS_NAME
  }).then( (value) => {
    if (value != null) {
      var transp = parseInt(value)
      setTransparencyValue(transp)
    }
  });

  SInfo.getItem(PREF_FONTSIZE_KEY, {
    sharedPreferencesName: PREFS_NAME
  }).then( (value) => {
    if (value != null) {
      var size = parseInt(value)
      setFontSizeValue(size)
    }
  });


  const onToggleThemePress = async () => {
    try {
      setStatus(STATUS_LOADING);
      await toggleTheme();
      setStatus(STATUS_IDLE);
    } catch (error) {
      setStatus(STATUS_ERROR);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };


  const renderError = () => {
    if (status !== STATUS_ERROR) {
      null;
    }

    return (
      <Spacer marginTop={20}>
        <ErrorMessage message={error} />
      </Spacer>
    );
  };

  const themeName = theme === themes.dark ? 'light' : 'dark';


  const onRandomizeCheck = () => {
    setChecked(!checked)
    SInfo.setItem(PREF_RANDOMIZE_KEY, "" + !checked, {
      sharedPreferencesName: PREFS_NAME
    });
    SInfo.getAllItems({ sharedPreferencesName: PREFS_NAME }).then((items) => {
      console.log(items)
    })
  }

  const onTransparencySelect = (value: any) => {
    setTransparencyValue(value)
    SInfo.setItem(PREF_TRANSPARENCY_KEY, "" + value, {
      sharedPreferencesName: PREFS_NAME
    });
    SInfo.getAllItems({ sharedPreferencesName: PREFS_NAME }).then((items) => {
      console.log(items)
    })
  }

  const onFontsizeSelect = (value: any) => {
    setFontSizeValue(value)
    SInfo.setItem(PREF_FONTSIZE_KEY, "" + value, {
      sharedPreferencesName: PREFS_NAME
    });
    SInfo.getAllItems({ sharedPreferencesName: PREFS_NAME }).then((items) => {
      console.log(items)
    })
  }

  return (
    <MainView testID={SETTINGS_SCREEN_ID}>
      <View style={styles.view}>
        {status === STATUS_LOADING && <ActivityIndicator size="large" />}
        <Button onPress={onToggleThemePress} text={`Use ${themeName} theme`} testID={SETTINGS_THEME_BUTTON} />
        <Spacer marginTop={20}>
          <Text fontSize={18} color="primary025" >
            Widget refresh time in minutes:
          </Text>
          <Text fontSize={18} color="primary025" >
            (minimum: 30, default: 60)
          </Text>
        </Spacer>
        <TextInput
          placeholder="60"
          placeholderTextColor={theme.primary050}
          style={[{
            color: theme.primary025, borderColor: theme.primary025,
            borderBottomWidth: 1,
            fontSize: 18,
          }]}
        />

        <BouncyCheckbox
          fillColor={theme.primary025}
          style={{ marginTop: 15 }}
          isChecked={checked}
          text="Randomly select card in Widget"
          disableBuiltInState
          onPress={onRandomizeCheck}
          textStyle={{
            textDecorationLine: "none",
            color: theme.primary025,
            fontSize: 18
          }}
          innerIconStyle={{
            borderRadius: 10, // to make it a little round increase the value accordingly
          }}

        />

        <Spacer marginTop={15}>
          <View style={styles.checkboxWrapper}>
            <Text fontSize={18} color="primary025" >
              Widget transparency:&nbsp;
            </Text>
            <Text fontSize={18} color="primary025" >
              {"" + transpValue / 10}
            </Text>
          </View>
          <Slider
            style={{ marginTop: 15, marginLeft: 0 }}
            step={2}
            value={transpValue}
            minimumValue={0}
            maximumValue={10}
            minimumTrackTintColor={theme.primary075}
            maximumTrackTintColor={theme.primary025}
            onValueChange={value => onTransparencySelect(value)}
          />
        </Spacer>

        <Spacer marginTop={15}>
          <View style={styles.checkboxWrapper}>
            <Text fontSize={18} color="primary025" >
              Widget font size:&nbsp;
            </Text>
            <Text fontSize={18} color="primary025" >
              {fontSizeValue == 1 ? "Small" : fontSizeValue == 2 ? "Medium" : "Large"}
            </Text>
          </View>
          <Slider
            style={{ marginTop: 15, marginLeft: 0 }}
            step={1}
            value={fontSizeValue}
            minimumValue={1}
            maximumValue={3}
            minimumTrackTintColor={theme.primary075}
            maximumTrackTintColor={theme.primary025}
            onValueChange={value => onFontsizeSelect(value)}
          />
        </Spacer>
        {renderError()}
      </View>
    </MainView>
  );
}

type Style = {
  view: ViewStyle;
  email: TextStyle;
  checkboxWrapper: ViewStyle
};

const styles = StyleSheet.create<Style>({
  view: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  email: {
    textAlign: 'center',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
});
