import React, { useContext, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Picker } from '@react-native-picker/picker';
import { TasksContext } from '../context/TasksContext';

// Об'єкт для визначення кольорів категорій
const categoryColors = {
  work: '#A7C7E7',
  shopping: '#B5EAD7',
  home: '#FFDAC1',
  projects: '#CBAACB',
  other: '#E0E0E0',
};

const TaskListScreen = ({ navigation }) => {
  const { t } = useTranslation();
  // Отримуємо завдання, функцію видалення та оновлення з контексту
  const { tasks, removeTask, updateTask } = useContext(TasksContext);
  // Стан для вибраної категорії (за замовчуванням "all")
  const [selectedCategory, setSelectedCategory] = useState('all');
  // Стан для розгорнутих завдань (зберігає ID завдань, які розгорнуті)
  const [expandedTasks, setExpandedTasks] = useState({});

  // Функція підтвердження видалення завдання
  const confirmDelete = (taskId) => {
    Alert.alert(
      t('confirmDeleteTitle'), // Заголовок підтвердження
      t('confirmDeleteMessage'), // Повідомлення підтвердження
      [
        { text: t('cancel'), style: 'cancel' }, //Кнопка скасування
        { text: t('delete'), onPress: () => removeTask(taskId), style: 'destructive' } // Кнопка видалення
      ]
    );
  };

  // Тепер передаємо тільки task
  const editTask = (task) => {
    navigation.navigate('EditNote', { task });
  };

  // Перемикання розгортання опису
  const toggleExpand = (taskId) => {
    setExpandedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Позначити задачу виконаною
  const toggleComplete = (task) => {
    updateTask({ ...task, completed: !task.completed });
  };

  const filteredTasks = (selectedCategory === 'all'
    ? tasks
    : tasks.filter(task => task.category === selectedCategory)
  ).slice().sort((a, b) => (b.completed ? 1 : 0) - (a.completed ? 1 : 0));

  const renderTask = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.taskItem}>
        {/* Кнопка розгортання/згортання опису */}
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.expandButton}>
            {expandedTasks[item.id] ? '⌵' : '>'}
          </Text>
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.taskTitleCompleted
            ]}
          >
            {item.title}
          </Text>
          {expandedTasks[item.id] && (
            <Text style={styles.taskDescription}>{item.description}</Text>
          )}
          {/* Відображення категорії завдання за кольором */}
          <Text style={[styles.taskCategory, { color: categoryColors[item.category] }]}>
            ({t(`category.${item.category}`)})
          </Text>
        </View>
          {/* Кнопка позначити завдання виконаним */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => toggleComplete(item)}
        >
          <Text style={styles.completeText}>✔</Text>
        </TouchableOpacity>
          
          {/* Кнопка редагування завдання */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editTask(item)}
        >
          <Text style={styles.editText}>✎</Text>
        </TouchableOpacity>

          {/* Кнопка видалення завдання */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item.id)}
        >
          <Text style={styles.deleteText}>x</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Фільтр завдань за категорією */}
      <View style={styles.filterRow}>
        <Text style={styles.label}>{t('filterBy')}:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
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

      {/* Відобрадення списку завданб або повідомлення про їх відсутність */}
      {filteredTasks.length > 0 ? (
        <FlatList
          data={filteredTasks} // Дані для списку
          keyExtractor={item => item.id.toString()} // Унікальний ключ для кожного елемента
          renderItem={renderTask} // Функція для рендерингу завдання
        />
      ) : (
        <Text style={styles.noTasksText}>{t('noTasks')}</Text> // Повідомлення, якщо завдань немає
      )}

      {/* Кнопка додавання нового завдання */}
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
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: { fontSize: 16, fontWeight: 'bold' },
  picker: { width: 150 },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  expandButton: { fontSize: 18, paddingHorizontal: 8 },

  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: 'gray' },
  taskDescription: { fontSize: 14, color: 'gray' },
  taskCategory: { fontSize: 14, fontWeight: 'bold' },

  completeButton: { paddingHorizontal: 8 },
  completeText: { fontSize: 18, color: 'green' },

  editButton: { paddingHorizontal: 8 },
  editText: { fontSize: 18, color: '#555' },

  deleteButton: { paddingHorizontal: 8 },
  deleteText: { color: 'red', fontSize: 18, fontWeight: 'bold' },

  noTasksText: { textAlign: 'center', marginTop: 20, fontSize: 14, color: 'gray' },

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
  addButtonText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
});

export default TaskListScreen;
