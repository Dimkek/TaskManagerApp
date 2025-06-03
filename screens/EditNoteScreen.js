import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { TasksContext } from '../context/TasksContext'; // Імпортуємо контекст завдань

// Компонент для редагування нотатки
const EditNoteScreen = ({ route, navigation }) => {
  const { updateTask } = useContext(TasksContext); // Отримуємо функцію оновлення завдань із контексту
  const { task } = route.params; // Отримуємо переданий параметр із даними нотатки

  // Стани для збереження даних форми
  const [title, setTitle] = useState(task.title || ''); // Стан для заголовка
  const [description, setDescription] = useState(task.description || ''); // Стан для опису
  const [category, setCategory] = useState(task.category || 'other'); // Стан для категорії
  const [date, setDate] = useState(task.date ? new Date(task.date) : new Date()); // Стан для дати
  const [time, setTime] = useState(task.time ? new Date(`${task.date}T${task.time}`) : new Date()); // Стан для часу
  const [showDatePicker, setShowDatePicker] = useState(false); // Стан для відображення вибору дати
  const [showTimePicker, setShowTimePicker] = useState(false); // Стан для відображення вибору часу
  const [enableNotification, setEnableNotification] = useState(task.enableNotification || false); // Стан для перемикача нагадувань

  // Перевірка на порожній заголовок перед збереженням
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Помилка', 'Заголовок не може бути порожнім!'); // Перевірка на порожній заголовок
      return;
    }

    // Форматування дати та часу
    const formattedDate = date.toISOString().split('T')[0]; // Формат дати: YYYY-MM-DD
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':'); // Формат часу: HH:mm

    // Створення оновленого об'єкта завдання
    const updatedTask = {
      ...task, // Зберігаємо всі інші поля завдання
      title, // Оновлений заголовок
      description, // Оновлений опис
      category, // Оновлена категорія
      date: formattedDate, // Оновлена дата
      time: formattedTime, // Оновлений час
      enableNotification, // Оновлений стан нагадування
    };

    updateTask(updatedTask); // Оновлюємо завдання через контекст

    // Якщо нагадування увімкнене — плануємо його
    if (enableNotification) {
      const trigger = new Date(date); // Створюємо тригер для нагадування
      trigger.setHours(time.getHours());
      trigger.setMinutes(time.getMinutes());

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Нагадування', // Заголовок сповіщення
          body: `Нотатка: ${title}`, // Тіло сповіщення
        },
        trigger, // Час сповіщення
      });
    }

    navigation.goBack(); // Повертаємося на попередній екран
  };

  return (
    <View style={styles.container}>
      {/* Поле вводу для заголовка */}
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
      />
      {/* Поле вводу для опису */}
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Опис"
        multiline
      />
      {/* Вибір категорії */}
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
      {/* Вибір дати */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          Дата: {date.toLocaleDateString()} {/* Відображення вибраної дати */}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false); // Закриваємо вибір дати
            if (selectedDate) setDate(selectedDate); // Оновлюємо стан дати
          }}
        />
      )}
      {/* Вибір часу */}
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
        <Text style={styles.dateTimeText}>
          Час: {time.toTimeString().split(':').slice(0, 2).join(':')} {/* Відображення вибраного часу */}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false); // Закриваємо вибір часу
            if (selectedTime) setTime(selectedTime); // Оновлюємо стан часу
          }}
        />
      )}
      {/* Перемикач для увімкнення/вимкнення нагадувань */}
      <View style={styles.switchContainer}>
        <Text>Увімкнути нагадування</Text>
        <Switch
          value={enableNotification}
          onValueChange={setEnableNotification} // Оновлюємо стан перемикача
        />
      </View>
      {/* Кнопка для збереження змін */}
      <Button title="Зберегти" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' }, // Основний контейнер
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 }, // Поле вводу
  textArea: { height: 80 }, // Поле вводу для опису
  label: { marginTop: 10, fontSize: 16, fontWeight: 'bold' }, // Стиль для тексту "Категорія"
  picker: { height: 50, marginBottom: 20 }, // Стиль для вибору категорії
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }, // Контейнер для перемикача
  dateTimeButton: { marginVertical: 10 }, // Кнопка для вибору дати/часу
  dateTimeText: { fontSize: 16 }, // Текст для відображення дати/часу
});

export default EditNoteScreen;
