import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';
import { TasksContext } from '../context/TasksContext'; // Імпортуємо контекст завдань

const EditNoteScreen = ({ route, navigation }) => {
  const { updateTask } = useContext(TasksContext); // Отримуємо функцію оновлення завдань із контексту
  const { t, i18n } = useTranslation(); // Використовуємо локалізацію
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

  // Функція для збереження змін
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('titleRequired')); // Використовуємо ключі локалізації для помилки
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
          title: t('reminderTitle'), // Заголовок сповіщення
          body: t('reminderBody', { title }), // Тіло сповіщення
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
        placeholder={t('titlePlaceholder')} // Підказка для заголовка
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      {/* Поле вводу для опису */}
      <TextInput
        placeholder={t('descriptionPlaceholder')} // Підказка для опису
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
          {t('selectedDate')}: {new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(date)}
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

      {/* Перемикач для увімкнення/вимкнення нагадувань */}
      <View style={styles.switchContainer}>
        <Text>{t('enableNotification')}</Text>
        <Switch
          value={enableNotification}
          onValueChange={setEnableNotification}
        />
      </View>

      {/* Кнопка для збереження змін */}
      <Button title={t('saveNote')} onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  textArea: {
    height: 80,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dateTimeButton: {
    marginVertical: 10,
  },
  dateTimeText: {
    fontSize: 16,
  },
});

export default EditNoteScreen;
