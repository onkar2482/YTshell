import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';


const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      {/* YouTube Play Icon Symbol */}
      <View style={styles.logoContainer}>
        <View style={styles.playCard}>
          <View style={styles.playTriangle} />
        </View>
        <Text style={styles.brandTitle}>YouTube</Text>
      </View>

      <ActivityIndicator size="small" color="#FF0000" style={styles.spinner} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  playCard: {
    width: 44,
    height: 30,
    backgroundColor: '#FF0000',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  playTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 0,
    borderBottomWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: '#ffffff',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  spinner: {
    marginTop: 12,
  },
});

export default LoadingScreen;
