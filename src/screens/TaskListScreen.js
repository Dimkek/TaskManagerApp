import React, { useContext, useState, useEffect, useRef } from 'react';
import { View, Text, Button, TextInput, FlatList, TouchableOpacity, Modal, StyleSheet, Switch, Animated } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as Notifications from 'expo-notifications';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { TaskContext } from '../context/TaskContext';
import MyTextElement from '../../components/MyTextElement';  // Импортируем кастомный компонент

const TaskListScreen = ({ navigation }) => {
  const { tasks, saveTasks } = useContext(TaskContext);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskText, setTaskText] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskGroup, setTaskGroup] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');
  const [taskReminder, setTaskReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    filterTasks();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true, // Додавання useNativeDriver
    }).start();
  }, [tasks, filterGroup]);

  const addTask = () => {
    if (taskText.trim()) {
      const newTask = {
        id: Date.now().toString(),
        text: taskText,
        description: taskDescription,
        group: taskGroup,
        reminder: taskReminder,
        reminderDate: taskReminder ? reminderDate : null,
        completed: false,
        date: new Date().toISOString().split('T')[0],
      };
      const updatedTasks = [...tasks, newTask];
      saveTasks(updatedTasks);
      if (taskReminder) {
        scheduleReminder(newTask);
      }
      setTaskText('');
      setTaskDescription('');
      setTaskGroup('');
      setTaskReminder(false);
      setReminderDate(new Date());
    }
  };

  const editTask = (task) => {
    setEditTaskId(task.id);
    setTaskText(task.text);
    setTaskDescription(task.description);
    setTaskGroup(task.group);
    setTaskReminder(task.reminder);
    setReminderDate(task.reminderDate ? new Date(task.reminderDate) : new Date());
    setModalVisible(true);
  };

  const updateTask = () => {
    const updatedTasks = tasks.map(task =>
      task.id === editTaskId
        ? { ...task, text: taskText, description: taskDescription, group: taskGroup, reminder: taskReminder, reminderDate: taskReminder ? reminderDate : null }
        : task
    );
    saveTasks(updatedTasks);
    setModalVisible(false);
    setTaskText('');
    setTaskDescription('');
    setTaskGroup('');
    setTaskReminder(false);
    setReminderDate(new Date());
    setEditTaskId(null);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const scheduleReminder = async (task) => {
    const trigger = new Date(task.reminderDate);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Нагадування про завдання",
        body: task.text,
      },
      trigger,
    });
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (selectedDate) => {
    hideDatePicker();
    setReminderDate(selectedDate);
  };

  const filterTasks = () => {
    if (filterGroup === 'All') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.group === filterGroup));
    }
  };

  return (
    <Animated.View style={{ flex: 1, padding: 20, opacity: animatedValue }}>
      <MyTextElement style={{ fontSize: 24, marginBottom: 20 }}>Список завдань</MyTextElement>
      <TextInput
        placeholder="Додати нове завдання"
        value={taskText}
        onChangeText={setTaskText}
        style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 }}
      />
      <TextInput
        placeholder="Опис завдання"
        value={taskDescription}
        onChangeText={setTaskDescription}
        style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 }}
      />
      <TextInput
        placeholder="Група завдання"
        value={taskGroup}
        onChangeText={setTaskGroup}
        style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', marginBottom: 10 }}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <MyTextElement>Нагадування</MyTextElement>
        <Switch value={taskReminder} onValueChange={setTaskReminder} />
      </View>
      {taskReminder && (
        <View>
          <Button title="Вибрати час нагадування" onPress={showDatePicker} />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      )}
      <Button title={editTaskId ? "Оновити завдання" : "Додати завдання"} onPress={editTaskId ? updateTask : addTask} />
      <Picker
        selectedValue={filterGroup}
        style={{ height: 50, width: '100%' }}
        onValueChange={(itemValue) => setFilterGroup(itemValue)}
      >
        <Picker.Item label="All" value="All" />
        {Array.from(new Set(tasks.map(task => task.group))).map(group => (
          <Picker.Item key={group} label={group} value={group} />
        ))}
      </Picker>
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <MyTextElement style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                {item.text}
              </MyTextElement>
              <MyTextElement>Опис: {item.description}</MyTextElement>
              <MyTextElement>Група: {item.group}</MyTextElement>
            </ListItem.Content>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Icon name={item.completed ? 'check-circle' : 'circle'} type='font-awesome' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => editTask(item)}>
              <Icon name='edit' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Icon name='delete' />
            </TouchableOpacity>
          </ListItem>
        )}
      />
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <MyTextElement style={styles.modalTitle}>Редагувати завдання</MyTextElement>
          <TextInput
            placeholder="Оновити завдання"
            value={taskText}
            onChangeText={setTaskText}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Опис завдання"
            value={taskDescription}
            onChangeText={setTaskDescription}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Група завдання"
            value={taskGroup}
            onChangeText={setTaskGroup}
            style={styles.modalInput}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <MyTextElement>Нагадування</MyTextElement>
            <Switch value={taskReminder} onValueChange={setTaskReminder} />
          </View>
          {taskReminder && (
            <View>
              <Button title="Вибрати час нагадування" onPress={showDatePicker} />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
              />
            </View>
          )}
          <Button title="Зберегти зміни" onPress={updateTask} />
          <Button title="Скасувати" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  modalInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
});

export default TaskListScreen;
