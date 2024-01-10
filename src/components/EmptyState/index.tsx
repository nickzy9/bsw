import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { DEFAULT_THEME } from '../../theme';

const EmptyState = ({ buttonTitle, errorMessage, onRetry }: { buttonTitle: string, errorMessage: string; onRetry: () => void }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon_error.png')} style={styles.image} />
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <Button mode="contained" onPress={onRetry} style={styles.retryButton}>
        {buttonTitle}
      </Button>
    </View>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: DEFAULT_THEME.baseLayout.margin,
  },
  errorMessage: {
    fontSize: DEFAULT_THEME.fontSize.subTitle,
    marginBottom: DEFAULT_THEME.baseLayout.margin,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: DEFAULT_THEME.color.primary,
  },
});

export default EmptyState;
