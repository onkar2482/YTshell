import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  StatusBar,
  BackHandler,
  Platform,
  ToastAndroid,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import OfflineNotice from './src/components/OfflineNotice';
import LoadingScreen from './src/components/LoadingScreen';
import AuthTesterModal from './src/components/AuthTesterModal';
import { useNetInfo } from './src/hooks/useNetInfo';


const ANDROID_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

const IOS_USER_AGENT =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

const USER_AGENT = Platform.select({
  android: ANDROID_USER_AGENT,
  ios: IOS_USER_AGENT,
  default: ANDROID_USER_AGENT,
});

/**
 * CSS injected into YouTube Mobile to hide web-only app promo banners
 * ("Switch to YouTube app" / "Open in app") so the shell feels like a real native app.
 */
const INJECTED_CSS = `
  (function() {
    try {
      var css = 'yt-app-promo-banner, .yt-app-banner, .upsell-dialog-renderer, .promoted-sparkles-web-renderer { display: none !important; }';
      var style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    } catch (e) {}
  })();
  true;
`;

const DEFAULT_URL = 'https://m.youtube.com';

const App = () => {
  const webViewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasWebError, setHasWebError] = useState(false);
  const [isTesterOpen, setIsTesterOpen] = useState(false);
  const backPressTime = useRef(0);

  // Network connectivity listener from custom hook
  const { isConnected, checkConnectivity } = useNetInfo();

  // Android Hardware Back Button navigation handling
  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      // If modal is open, close it first
      if (isTesterOpen) {
        setIsTesterOpen(false);
        return true;
      }

      // 1. If WebView has internal browsing history, navigate back
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // Prevent default app exit
      }

      // 2. If at root of history, prompt user with double-press to exit (native app behavior)
      const now = Date.now();
      if (now - backPressTime.current < 2000) {
        return false; // Exit app
      }

      backPressTime.current = now;
      ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backHandler.remove();
  }, [canGoBack, isTesterOpen]);

  // Handle Retry button tap from OfflineNotice
  const handleRetry = useCallback(async () => {
    const online = await checkConnectivity();
    if (online) {
      setHasWebError(false);
      if (webViewRef.current) {
        webViewRef.current.reload();
      }
    }
  }, [checkConnectivity]);

  // Handle switching URLs from the AuthTesterModal
  const handleSelectUrl = useCallback(url => {
    setCurrentUrl(url);
    setHasWebError(false);
  }, []);

  // Show offline screen if device has no connection OR if WebView suffered a fatal network error
  const isOffline = !isConnected || hasWebError;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#0f0f0f"
          translucent={false}
        />

        {isOffline ? (
          <OfflineNotice onRetry={handleRetry} />
        ) : (
          <View style={styles.webviewContainer}>
            <WebView
              ref={webViewRef}
              source={{ uri: currentUrl }}
              userAgent={USER_AGENT}
              // Cookie & Storage Persistence (Always Signed In / Persistent Sign Out)
              domStorageEnabled={true}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
              incognito={false}
              cacheEnabled={true}
              cacheMode="LOAD_DEFAULT"
              saveFormDataDisabled={false}
              // Video Playback & Fullscreen / Landscape Handling
              allowsInlineMediaPlayback={true}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              androidHardwareAccelerationDisabled={false}
              androidLayerType="hardware"
              mixedContentMode="compatibility"
              // Navigation State Tracking
              onNavigationStateChange={navState => {
                setCanGoBack(navState.canGoBack);
              }}
              // Native App Feel (Hide web promo banners & fast loading splash)
              injectedJavaScript={INJECTED_CSS}
              startInLoadingState={true}
              renderLoading={() => <LoadingScreen />}
              // Network Error Handling
              onError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                // Fatal network disconnects trigger the offline screen
                if (
                  nativeEvent.description?.includes('ERR_INTERNET_DISCONNECTED') ||
                  nativeEvent.description?.includes('ERR_NAME_NOT_RESOLVED') ||
                  nativeEvent.code === -1009 || // iOS offline error code
                  nativeEvent.code === -2 ||   // Android ERROR_HOST_LOOKUP
                  nativeEvent.code === -6      // Android ERROR_CONNECT
                ) {
                  setHasWebError(true);
                }
              }}
              onHttpError={syntheticEvent => {
                const { nativeEvent } = syntheticEvent;
                if (nativeEvent.statusCode >= 500) {
                  // Server unreachable
                  setHasWebError(true);
                }
              }}
              onLoadEnd={() => {
                // Clear any prior web error if page loads successfully
                if (hasWebError) setHasWebError(false);
              }}
              style={styles.webview}
            />



            {/* Auth Tester Modal */}
            <AuthTesterModal
              visible={isTesterOpen}
              onClose={() => setIsTesterOpen(false)}
              onSelectUrl={handleSelectUrl}
              currentUrl={currentUrl}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444444',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default App;