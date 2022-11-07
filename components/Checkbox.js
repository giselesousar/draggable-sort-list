import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const CHECKBOX_STATUS = {
  CHECKED: 'CHECKED',
  UNCHECKED: 'UNCHECKED',
};

export default function Checkbox({
  isChecked = false,
  onChange,
  label,
  ...props
}) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onChange} {...props}>
      <View style={styles.container}>
        <View
          style={
            styles[
              isChecked ? CHECKBOX_STATUS.CHECKED : CHECKBOX_STATUS.UNCHECKED
            ]
          }>
          {isChecked && (
            <Icon name="check" size={20} color="#FFFFFF" />
          )}
        </View>

        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const defaultCheckboxContainerStyles = {
  width: 24,
  height: 24,
  borderRadius: 4,
  borderWidth: 2,
  alignItems: 'center',
  justifyContent: 'center',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  [CHECKBOX_STATUS.UNCHECKED]: {
    ...defaultCheckboxContainerStyles,
    borderColor: '#7A8B9A',
  },
  [CHECKBOX_STATUS.CHECKED]: {
    ...defaultCheckboxContainerStyles,
    borderColor: 'red',
    backgroundColor:'red',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 19.6,
    fontWeight: '400',
    color: '#595959',
  },
});
