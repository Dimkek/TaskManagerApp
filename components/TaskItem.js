import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';

export default function TaskItem({ task, onToggleComplete, onDelete }) {
  const { t } = useTranslation(); // Використовуємо для перекладів

  const handleDelete = () => {
    Alert.alert(
      t('deleteConfirmationTitle'), // Тема підтвердження
      t('deleteConfirmationMessage'), // Повідомлення підтвердження
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('delete'), style: 'destructive', onPress: () => onDelete(task.id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.taskContainer}>
      <Pressable
        onPress={() => {
          console.log('Toggle complete for task:', task.id);
          onToggleComplete(task.id);
        }}
        style={styles.checkboxContainer}
      >
        <MaterialIcons
          name={task.completed ? 'check-box' : 'check-box-outline-blank'}
          size={24}
          color={task.completed ? 'green' : 'gray'}
        />
      </Pressable>
      <Text style={task.completed ? styles.completedTask : styles.task}>
        {task.title}
      </Text>
      <TouchableOpacity onPress={handleDelete}>
        <Text style={styles.deleteButton}>{t('delete')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  checkboxContainer: {
    marginRight: 10,
  },
  task: {
    fontSize: 16,
    flex: 1, // Щоб текст розтягнувся, якщо потрібно
  },
  completedTask: {
    fontSize: 16,
    textDecorationLine: 'line-through',
    color: 'gray',
    flex: 1, // Щоб текст розтягнувся, якщо потрібно
  },
  deleteButton: {
    color: 'red',
  },
});
