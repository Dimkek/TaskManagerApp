import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddNoteScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddNote = () => {
    const newTask = { title, description, date: date.toString() };
    if (route.params && route.params.addTask) {
      route.params.addTask(newTask);
    }
    navigation.goBack();
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Скрыть DateTimePicker после выбора даты
    if (selectedDate) {
      setDate(selectedDate);
    }
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
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16 }}>Выбранная дата: {date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <Button title="Добавить заметку" onPress={handleAddNote} />
    </View>
  );
};

export default AddNoteScreen;
