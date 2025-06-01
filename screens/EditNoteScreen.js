import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { TasksContext } from '../context/TasksContext';

const EditNoteScreen = ({ route, navigation }) => {
  const { updateTask } = useContext(TasksContext);
  const { task } = route.params;

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [category, setCategory] = useState(task.category || 'other');
  const [date, setDate] = useState(task.date ? new Date(task.date) : new Date());
  const [time, setTime] = useState(task.time ? new Date(`${task.date}T${task.time}`) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [enableNotification, setEnableNotification] = useState(task.enableNotification || false);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Помилка', 'Заголовок не може бути порожнім!');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':');

    const updatedTask = {
      ...task,
      title,
      description,
      category,
      date: formattedDate,
      time: formattedTime,
      enableNotification,
    };

    updateTask(updatedTask);

    // Якщо нагадування увімкнене — плануємо його
    if (enableNotification) {
      const trigger = new Date(date);
      trigger.setHours(time.getHours());
      trigger.setMinutes(time.getMinutes());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Нагадування',
          body: `Нотатка: ${title}`,
        },
        trigger,
      });
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Опис"
        multiline
      />
      <Text style={styles.label}>Категорія:</Text>
      <Picker
        selectedValue={category}
        onValueChange={setCategory}
        style={styles.picker}
      >
        <Picker.Item label="Робота" value="work" />
        <Picker.Item label="Покупки" value="shopping" />
        <Picker.Item label="Дім" value="home" />
        <Picker.Item label="Проєкти" value="projects" />
        <Picker.Item label="Інше" value="other" />
      </Picker>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          Дата: {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          Час: {time.toTimeString().split(':').slice(0, 2).join(':')}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}
      <View style={styles.switchContainer}>
        <Text>Увімкнути нагадування</Text>
        <Switch
          value={enableNotification}
          onValueChange={setEnableNotification}
        />
      </View>
      <Button title="Зберегти" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
  textArea: { height: 80 },
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' },
  picker: { height: 50, marginBottom: 20 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 },
  dateTimeButton: { marginVertical: 10 },
  dateTimeText: { fontSize: 16 },
});

export default EditNoteScreen;
