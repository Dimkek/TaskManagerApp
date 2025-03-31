import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TaskListScreen from './screens/TaskListScreen';
import CalendarScreen from './screens/CalendarScreen';
import SettingsScreen from './screens/SettingsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import AddNoteScreen from './screens/AddNoteScreen';
import EditNoteScreen from './screens/EditNoteScreen';
import { TasksProvider } from './context/TasksContext';
import './i18n'; // Підключення i18n для локалізації
import { useTranslation } from 'react-i18next';
import * as Notifications from 'expo-notifications';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainNavigator() {
  const { t } = useTranslation(); // Використання перекладу

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: t('taskList'), headerShown: false }} // Приховування заголовка
      />
      <Stack.Screen
        name="AddNote"
        component={AddNoteScreen}
        options={{ title: t('addNote') }}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{ title: t('editNote') }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const { t } = useTranslation(); // Використання перекладу

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    requestPermissions();
  }, []);

  return (
    <TasksProvider>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="TaskListDrawer">
          <Drawer.Screen
            name="TaskListDrawer"
            component={MainNavigator}
            options={{ title: t('TaskListDrawer') }}
          />
          <Drawer.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: t('Calendar') }}
          />
          <Drawer.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: t('settings') }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </TasksProvider>
  );
}
