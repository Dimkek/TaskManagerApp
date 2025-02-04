import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TaskListScreen from './screens/TaskListScreen';
import CalendarScreen from './screens/CalendarScreen';
import SettingsScreen from './screens/SettingsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AddNoteScreen from './screens/AddNoteScreen';
import EditNoteScreen from './screens/EditNoteScreen';
import { TasksProvider } from './context/TasksContext';
import './i18n'; // Подключаем i18n
import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainNavigator() {
  const { t } = useTranslation(); // Используем перевод

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TaskListMain"
        component={TaskListScreen}
        options={{ title: t('TaskListMain') }} // Пример использования перевода
      />
      <Stack.Screen
        name="AddNote"
        component={AddNoteScreen}
        options={{ title: t('AddNote') }} // Пример использования перевода
      />
      <Stack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{ title: t('EditNote') }} // Пример использования перевода
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const { t } = useTranslation(); // Используем перевод

  return (
    <TasksProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="TaskListDrawer">
          <Drawer.Screen
            name="TaskListDrawer"
            component={MainNavigator}
            options={{ title: t('TaskListDrawer') }} // Пример использования перевода
          />
          <Drawer.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: t('Calendar') }} // Пример использования перевода
          />
          <Drawer.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: t('Settings') }} // Пример использования перевода
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
