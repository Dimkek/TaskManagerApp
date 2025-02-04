import React, { useState, useContext } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TasksContext } from '../context/TasksContext';

const AddNoteScreen = () => {
  const { addTask } = useContext(TasksContext);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [category, setCategory] = useState('work'); // Категорія за замовчуванням

  const handleAddNote = () => {
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':');

    const newTask = {
      id: Date.now(),
      title,
      description,
      date: formattedDate,
      time: formattedTime,
      category,
    };

    addTask(newTask);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={t('titlePlaceholder')}
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder={t('descriptionPlaceholder')}
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      {/* Вибір категорії */}
      <Text style={styles.label}>{t('selectCategory')}:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label={t('category.work')} value="work" />
        <Picker.Item label={t('category.shopping')} value="shopping" />
        <Picker.Item label={t('category.home')} value="home" />
        <Picker.Item label={t('category.projects')} value="projects" />
        <Picker.Item label={t('category.other')} value="other" />
      </Picker>

      {/* Вибір дати */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          {t('selectedDate')}: {date.toDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      {/* Вибір часу */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          {t('selectedTime')}: {time.toTimeString().split(':').slice(0, 2).join(':')}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              setTime(selectedTime);
            }
          }}
        />
      )}

      <Button title={t('addNote')} onPress={handleAddNote} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  picker: {
    marginVertical: 10,
  },
});

export default AddNoteScreen;
