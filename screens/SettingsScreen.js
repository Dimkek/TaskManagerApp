import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTranslation } from 'react-i18next';

const SettingsScreen = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    i18n.changeLanguage(language);
  };

  return (
    <View style={styles.container}>
      {/* Зміна мови */}
      <View style={styles.row}>
        <Text style={styles.label}>{t('changeLanguage')}:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={handleLanguageChange}
            style={styles.picker}
          >
            <Picker.Item label="Українська" value="uk" />
            <Picker.Item label="English" value="en" />
          </Picker>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  pickerContainer: {
    width: 150,
    height: 30,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    fontSize: 16,
    height: 30,
    textAlign: 'center',
  },
});

export default SettingsScreen;
