import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ListItem } from 'react-native-elements';
import { TaskContext } from '../context/TaskContext';

const CalendarScreen = ({ navigation }) => {
  const { tasks } = useContext(TaskContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [dayTasks, setDayTasks] = useState([]);

  useEffect(() => {
    if (selectedDate) {
      const filteredTasks = tasks.filter(task => task.date === selectedDate);
      setDayTasks(filteredTasks);
    }
  }, [selectedDate, tasks]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Календар</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
      />
      <FlatList
        data={dayTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>
                {item.text}
              </ListItem.Title>
              <ListItem.Subtitle>Пріоритет: {item.priority}</ListItem.Subtitle>
              <ListItem.Subtitle>Опис: {item.description}</ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
};

export default CalendarScreen;
