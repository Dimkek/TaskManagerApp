import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TaskListScreen from '../screens/TaskListScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="TaskList">
        <Drawer.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Список задач' }} />
        <Drawer.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Календар' }} />
        <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Налаштування' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
