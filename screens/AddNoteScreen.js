import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text, StyleSheet, Switch, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { TasksContext } from '../context/TasksContext';
import * as Notifications from 'expo-notifications';

const AddNoteScreen = ({ route, navigation }) => {
  const { addTask, updateTask } = useContext(TasksContext);
  const { t, i18n } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [category, setCategory] = useState('other');
  const [taskId, setTaskId] = useState(null);
  const [enableNotification, setEnableNotification] = useState(false); // Перемикач для сповіщень

  useEffect(() => {
    // Запит дозволів для сповіщень
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        // Відображення повідомлення, якщо дозволи не надані
        Alert.alert(t('error'), t('notificationPermissionDenied'));
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    // Якщо передано завдання через route params, заповнюємо поля
    if (route.params?.task) {
      const { task } = route.params;
      setTitle(task.title); // Встановлюємо заголовок
      setDescription(task.description); // Встановлюємо опис
      setCategory(task.category); // Встановлюємо категорію
      setTaskId(task.id); // Встановлюємо ID завдання
    }
  }, [route.params?.task]); // Виконується при зміні route.params.task

  const saveNote = () => {
    // Перевірка, чи введено заголовок
    if (!title.trim()) {
      Alert.alert(t('error'), t('titleRequired')); // Відображення помилки, якщо заголовок порожній
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':');

    // Створення нового об'єкта завдання
    const newTask = {
      id: taskId || Date.now(), // Використовуємо існуючий ID або генеруємо новий
      title,
      description,
      date: formattedDate,
      time: formattedTime,
      category,
    };

    if (taskId) {
      updateTask(newTask);
    } else {
      addTask(newTask);
      // Планування сповіщення, якщо увімкнено
      if (enableNotification) {
        const trigger = new Date(date);
        trigger.setHours(time.getHours());
        trigger.setMinutes(time.getMinutes());

        Notifications.scheduleNotificationAsync({
          content: {
            title: t('reminderTitle'), // Заголовок сповіщення
            body: t('reminderBody', { title }), // Тіло сповіщення
          },
          trigger, // Час сповіщення
        });
      }
    }
    navigation.goBack(); // Повернення на попередній екран
  };

  return (
    <View style={styles.container}>
      {/* Поле вводу заголовка */}
      <TextInput
        placeholder={t('titlePlaceholder')} // Підказка для заголовка
        value={title} // Значення заголовка
        onChangeText={setTitle} // Оновлення заголовка
        style={styles.input}
      />
      {/* Поле вводу опису */}
      <TextInput
        placeholder={t('descriptionPlaceholder')} // Підказка для опису
        value={description} // Значення опису
        onChangeText={setDescription} // Оновлення опису
        multiline={true} // Дозволяє кілька рядків
        numberOfLines={4} // Кількість рядків
        style={[styles.input, styles.textArea]}
      />

      {/* Вибір категорії */}
      <Text style={styles.label}>{t('selectCategory')}:</Text>
      <Picker
        selectedValue={category} // Вибрана категорія
        onValueChange={(itemValue) => setCategory(itemValue)} // Оновлення категорії
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
          value={date} // Поточна дата
          mode="date" // Режим вибору дати
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false); // Закриваємо вибір дати
            if (selectedDate) {
              setDate(selectedDate); // Оновлюємо дату
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
          value={time} // Поточний час
          mode="time" // Режим вибору часу
          display="default"
          onChange={(event, selectedTime) => {
            setShowTimePicker(false); // Закриваємо вибір часу
            if (selectedTime) {
              setTime(selectedTime); // Оновлюємо час
            }
          }}
        />
      )}

      {/* Перемикач для увімкнення.вимкнення сповіщень */}
      <View style={styles.switchContainer}>
        <Text>{t('enableNotification')}</Text>
        <Switch
          value={enableNotification} // Значення перемикача
          onValueChange={setEnableNotification} // Оновлення стану перемикача
        />
      </View>

      <Button title={t('addNote')} onPress={saveNote} />
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

export default AddNoteScreen;
