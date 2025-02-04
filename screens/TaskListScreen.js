import React, { useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { TasksContext } from '../context/TasksContext';
import TaskItem from '../components/TaskItem';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskListScreen({ navigation }) {
  const { tasks, toggleComplete, deleteTask } = useContext(TasksContext);

  // Сортування завдань: невиконані зверху, виконані знизу
  const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

  const handleAddTask = () => {
    navigation.navigate('AddNote'); // Навігація до екрану додавання нотаток
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedTasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggleComplete={toggleComplete} onDelete={deleteTask} />
        )}
      />
      <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 50,
    elevation: 5, // Тінь для Android
    shadowColor: '#000', // Тінь для iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
