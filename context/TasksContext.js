import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Створюємо контекст для завдань
export const TasksContext = createContext();

// Провайдер контексту
export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Завантаження завдань з AsyncStorage
  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem('tasks');
      if (stored) setTasks(JSON.parse(stored));
    } catch (e) {
      console.error('Не вдалося завантажити завдання:', e);
    }
  };

  // Збереження завдань у AsyncStorage
  const saveTasks = async updated => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updated));
    } catch (e) {
      console.error('Не вдалося зберегти завдання:', e);
    }
  };

  // Додає нове завдання (за замовчуванням не виконане)
  const addTask = taskData => {
    const newTask = { 
      id: Date.now(), 
      ...taskData, 
      completed: false // поле для позначення виконаних
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    saveTasks(updated);
  };

  // Оновлює наявне завдання (використовується й для markCompleted)
  const updateTask = updatedTask => {
    const updated = tasks.map(t =>
      t.id === updatedTask.id ? updatedTask : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  // Видаляє завдання
  const removeTask = id => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveTasks(updated);
  };

  // Перемикає стан виконання завдання
  const toggleTaskCompleted = id => {
    const updated = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    saveTasks(updated);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        removeTask,
        toggleTaskCompleted,
        loadTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
