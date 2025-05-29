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
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('error'), t('notificationPermissionDenied'));
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (route.params?.task) {
      const { task } = route.params;
      setTitle(task.title);
      setDescription(task.description);
      setCategory(task.category);
      setTaskId(task.id);
    }
  }, [route.params?.task]);

  const saveNote = () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('titleRequired'));
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':');

    const newTask = {
      id: taskId || Date.now(),
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
      if (enableNotification) {
        const trigger = new Date(date);
        trigger.setHours(time.getHours());
        trigger.setMinutes(time.getMinutes());

        Notifications.scheduleNotificationAsync({
          content: {
            title: t('reminderTitle'),
            body: t('reminderBody', { title }),
          },
          trigger,
        });
      }
    }
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

      <View style={styles.switchContainer}>
        <Text>{t('enableNotification')}</Text>
        <Switch
          value={enableNotification}
          onValueChange={setEnableNotification}
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
