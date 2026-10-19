import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';


const OfflineNotice = ({ onRetry }) => {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    try {
      if (onRetry) {
        await onRetry();
      }
    } finally {

      setTimeout(() => {
        setRetrying(false);
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

      {/* Offline Icon Container */}
      <View style={styles.iconCircle}>
        <View style={styles.wifiBase}>
          <View style={styles.wifiArcOuter} />
          <View style={styles.wifiArcInner} />
          <View style={styles.wifiDot} />
          <View style={styles.slashLine} />
        </View>
      </View>

      {/* Informational Text */}
      <Text style={styles.title}>No internet connection</Text>
      <Text style={styles.subtitle}>
        You're offline. Check your network connection and tap Retry to reload YouTube.
      </Text>

      {/* Interactive Retry Button */}
      <TouchableOpacity
        style={[styles.button, retrying && styles.buttonDisabled]}
        onPress={handleRetry}
        activeOpacity={0.8}
        disabled={retrying}
      >
        {retrying ? (
          <View style={styles.buttonContent}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={[styles.buttonText, styles.buttonLoadingText]}>Checking...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Retry</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1f1f1f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: '#333333',
  },
  wifiBase: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wifiArcOuter: {
    position: 'absolute',
    top: 4,
    width: 44,
    height: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#aaaaaa',
  },
  wifiArcInner: {
    position: 'absolute',
    top: 14,
    width: 26,
    height: 13,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#aaaaaa',
  },
  wifiDot: {
    position: 'absolute',
    bottom: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#aaaaaa',
  },
  slashLine: {
    position: 'absolute',
    width: 54,
    height: 3,
    backgroundColor: '#FF0000',
    transform: [{ rotate: '-45deg' }],
    borderRadius: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 32,
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    minWidth: 140,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  buttonLoadingText: {
    marginLeft: 8,
  },
});

export default OfflineNotice;