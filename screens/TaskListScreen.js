import React, { useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState([]);
  const navigation = useNavigation();

  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  const renderTaskItem = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.description}</Text>
      {item.date && <Text>Дата: {item.date}</Text>}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button
        title="Новая заметка"
        onPress={() => navigation.navigate('AddNote', { addTask })}
      />
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default TaskListScreen;
