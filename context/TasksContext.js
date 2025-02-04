import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks', error);
    }
  };

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks', error);
    }
  };

  const addTask = (task) => {
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  return (
    <TasksContext.Provider value={{ tasks, addTask }}>
      {children}
    </TasksContext.Provider>
  );
};
