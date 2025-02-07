import React, { useContext, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { TasksContext } from '../context/TasksContext';

const categoryColors = {
  work: '#A7C7E7', // Пастельно-синій
  shopping: '#B5EAD7', // Пастельно-зелений
  home: '#FFDAC1', // Пастельно-оранжевий
  projects: '#CBAACB', // Пастельно-фіолетовий
  other: '#E0E0E0', // Пастельно-сірий
};

const TaskListScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { tasks, removeTask } = useContext(TasksContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTasks, setExpandedTasks] = useState({}); // Стан для зберігання розгорнутих нотаток

  const confirmDelete = (taskId) => {
    Alert.alert(
      t('confirmDeleteTitle'),
      t('confirmDeleteMessage'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), onPress: () => removeTask(taskId), style: 'destructive' }
      ]
    );
  };

  const editTask = (task) => {
    navigation.navigate('AddNote', { task });
  };

  const toggleExpand = (taskId) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const renderTask = ({ item }) => {
    if (!item) return null; // Додаткова перевірка на наявність об'єкта item

    return (
      <View style={styles.taskItem}>
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.expandButton}>
            {expandedTasks[item.id] ? '⌵' : '>'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.taskContent} onPress={() => editTask(item)}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          {expandedTasks[item.id] && (
            <Text style={styles.taskDescription}>{item.description}</Text>
          )}
          <Text style={[styles.taskCategory, { color: categoryColors[item.category] }]}>
            ({t(`category.${item.category}`)})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
          <Text style={styles.deleteText}>x</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Рядок фільтрації з розташуванням Picker поруч */}
      <View style={styles.filterRow}>
        <Text style={styles.label}>{t('filterBy')}:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label={t('allTasks')} value="all" />
          <Picker.Item label={t('category.work')} value="work" />
          <Picker.Item label={t('category.shopping')} value="shopping" />
          <Picker.Item label={t('category.home')} value="home" />
          <Picker.Item label={t('category.projects')} value="projects" />
          <Picker.Item label={t('category.other')} value="other" />
        </Picker>
      </View>

      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTask}
        />
      ) : (
        <Text style={styles.noTasksText}>{t('noTasks')}</Text>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNote')}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Розташування filterBy та Picker в один рядок
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  picker: {
    width: 150, // Визначаємо ширину Picker
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  expandButton: {
    fontSize: 18, // Зменшення розміру шрифту
    paddingRight: 10,
  },
  taskContent: {
    flex: 1, 
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: 'gray',
  },
  taskCategory: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  deleteText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TaskListScreen;
