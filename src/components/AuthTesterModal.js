import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';


const AuthTesterModal = ({ visible, onClose, onSelectUrl, currentUrl }) => {
  const [customInput, setCustomInput] = useState('');

  const testSites = [
    {
      title: 'YouTube Mobile (Default)',
      url: 'https://m.youtube.com',
      badge: 'Main App',
      description: 'Standard YouTube mobile web experience.',
    },

    {
      title: 'Demo Test Login Form',
      url: 'https://the-internet.herokuapp.com/login',
      badge: 'Demo Login',
      description: 'Username: tomsmith | Password: SuperSecretPassword!',
    },
  ];

  const handleSelect = url => {
    onSelectUrl(url);
    onClose();
  };

  const handleCustomSubmit = () => {
    let url = customInput.trim();
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    onSelectUrl(url);
    setCustomInput('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🔐 Auth & Persistence Tester</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.note}>
              Google may block OAuth in embedded WebViews (RFC 8252). You can use any
              standard form-based login website below to confirm that{' '}
              <Text style={styles.bold}>"always signed in"</Text> session persistence
              survives app restarts and device reboots.
            </Text>

            {testSites.map((site, index) => {
              const isSelected = currentUrl.startsWith(site.url);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.siteItem, isSelected && styles.siteItemSelected]}
                  onPress={() => handleSelect(site.url)}
                  activeOpacity={0.7}
                >
                  <View style={styles.siteHeader}>
                    <Text style={styles.siteTitle}>{site.title}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{site.badge}</Text>
                    </View>
                  </View>
                  <Text style={styles.siteUrl}>{site.url}</Text>
                  <Text style={styles.siteDesc}>{site.description}</Text>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.customLabel}>Or Enter Any Custom URL:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="https://example.com/login"
                placeholderTextColor="#777777"
                value={customInput}
                onChangeText={setCustomInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.goButton}
                onPress={handleCustomSubmit}
              >
                <Text style={styles.goButtonText}>Go</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.dismissButton} onPress={onClose}>
            <Text style={styles.dismissButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2b2b',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2e2e2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#aaaaaa',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  note: {
    color: '#bbbbbb',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  bold: {
    color: '#ffffff',
    fontWeight: '700',
  },
  siteItem: {
    backgroundColor: '#262626',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#383838',
  },
  siteItemSelected: {
    borderColor: '#FF0000',
    backgroundColor: '#2d2222',
  },
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  siteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  badge: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    color: '#FF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  siteUrl: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  siteDesc: {
    fontSize: 12,
    color: '#cccccc',
  },
  customLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dddddd',
    marginTop: 8,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#444444',
  },
  goButton: {
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginLeft: 8,
    borderRadius: 8,
  },
  goButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  dismissButton: {
    backgroundColor: '#2b2b2b',
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  dismissButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AuthTesterModal;
