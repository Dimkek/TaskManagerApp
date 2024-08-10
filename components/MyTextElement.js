import React from 'react';
import { Text } from 'react-native';

const MyTextElement = ({ children, style = {}, ...props }) => {
  return (
    <Text style={[{ fontSize: 16 }, style]} {...props}>
      {children}
    </Text>
  );
};

export default MyTextElement;
