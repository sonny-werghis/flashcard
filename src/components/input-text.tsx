import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle } from 'react-native';
import { Text } from '@components/text';
import { View } from 'react-native';

import { useTheme } from '@theme/use-theme';
import { FilterOpenButton } from './filter-open-button';

type Props = TextInputProps & {
  label: string;
  showSearchIcon?: boolean;
  onSearch? : () => void;
};

export const InputText = React.forwardRef<TextInput, Props>(function InputText(props: Props, ref) {
  const theme = useTheme();

  var onClickSearch = () => { 
    if (props.onSearch != undefined) {
      props.onSearch()
    }

  }

  return (
    <>
      <View style={{
        paddingVertical: 0,
        paddingHorizontal: 3,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Text fontSize={18} color="primary025" fontWeight="bold">
          {props.label}
        </Text>
        {(props.showSearchIcon == true) && <FilterOpenButton onPress={onClickSearch}/>}
      </View>

      <TextInput
        ref={ref}
        style={[styles.inputText, { color: theme.primary025, borderColor: theme.primary025 }]}
        placeholderTextColor={theme.primary050}
        {...props}
      />
    </>
  );
});

type Style = {
  inputText: TextStyle;
};

const styles = StyleSheet.create<Style>({
  inputText: {
    borderBottomWidth: 1,
    paddingBottom: 15,
    fontSize: 22,
  },
});
