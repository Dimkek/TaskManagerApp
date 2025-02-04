import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { TasksContext } from '../context/TasksContext';

// Налаштування локалізації календаря
LocaleConfig.locales['uk'] = {
  monthNames: [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень',
  ],
  monthNamesShort: [
    'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
    'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру',
  ],
  dayNames: [
    'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота',
  ],
  dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сьогодні',
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

const CalendarScreen = () => {
  const { i18n, t } = useTranslation(); // Додано t для перекладу
  const { tasks } = useContext(TasksContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});

  useEffect(() => {
    LocaleConfig.defaultLocale = i18n.language === 'uk' ? 'uk' : 'en';

    const updatedMarkedDates = tasks.reduce((acc, task) => {
      acc[task.date] = { marked: true, dotColor: 'blue' };
      return acc;
    }, {});
    setMarkedDates(updatedMarkedDates);
  }, [i18n.language, tasks]);

  const tasksForSelectedDate = tasks.filter((task) => task.date === selectedDate);

  const toggleTaskExpansion = (taskId) => {
    setExpandedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  return (
    <View style={styles.container}>
      <Calendar
        key={i18n.language + Date.now()}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
        }}
        theme={{
          selectedDayBackgroundColor: 'blue',
          todayTextColor: 'red',
          arrowColor: 'orange',
          monthTextColor: 'black',
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
      />
      <View style={styles.tasksContainer}>
        {tasksForSelectedDate.length > 0 ? (
          <FlatList
            data={tasksForSelectedDate}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.taskItem}>
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{item.title}</Text>
                  <TouchableOpacity onPress={() => toggleTaskExpansion(item.id)}>
                    <Text style={styles.expandButton}>
                      {expandedTasks[item.id] ? '-' : '+'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {expandedTasks[item.id] && (
                  <Text style={styles.taskDescription}>{item.description}</Text>
                )}
              </View>
            )}
          />
        ) : (
          <Text style={styles.noTasksText}>
            {selectedDate ? t('noTasksForThisDay') : t('selectDate')} {/* Використано t для перекладу */}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tasksContainer: {
    flex: 1,
    padding: 10,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandButton: {
    fontSize: 16,
    color: 'blue',
  },
  taskDescription: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
});

export default CalendarScreen;
