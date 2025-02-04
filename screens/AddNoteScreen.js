import React, { useState, useContext } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { TasksContext } from '../context/TasksContext';

const AddNoteScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation();
  const { addTask } = useContext(TasksContext);

  const handleAddNote = () => {
    const formattedDate = date.toISOString().split('T')[0];
    const formattedTime = time.toTimeString().split(':').slice(0, 2).join(':');
    const newTask = { 
      id: Date.now(),
      title, 
      description, 
      date: formattedDate, 
      time: formattedTime,
      completed: false // Додаємо поле для стану виконання
    };

    addTask(newTask);
    navigation.goBack();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Заголовок"
        value={title}
        onChangeText={setTitle}
        style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      />
      <TextInput
        placeholder="Опис"
        value={description}
        onChangeText={setDescription}
        multiline={true} // Дозволяє вводити декілька рядків
        numberOfLines={4}
        style={{
          marginBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          textAlignVertical: 'top',
        }}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>Обрана дата: {date.toDateString()}</Text>
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
      <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>Обраний час: {time.toTimeString().split(':').slice(0, 2).join(':')}</Text>
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
      <Button title="Додати нотатку" onPress={handleAddNote} />
    </View>
  );
};

export default AddNoteScreen;
