import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { TasksContext } from '../context/TasksContext';

// Налаштування локалізації календаря для української мови
LocaleConfig.locales['uk'] = {
  monthNames: [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ],
  monthNamesShort: [
    'Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер',
    'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'
  ],
  dayNames: [
    'Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'
  ],
  dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
  today: 'Сьогодні'
};

// Налаштування локалізації календаря для англійської мови
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

const CalendarScreen = () => {
  const { t, i18n } = useTranslation();
  const { tasks } = useContext(TasksContext);
  const [selectedDate, setSelectedDate] = useState('');
  const [locale, setLocale] = useState(i18n.language);

  // При зміні мови оновлюємо локаль календаря
  useEffect(() => {
    LocaleConfig.defaultLocale = i18n.language === 'uk' ? 'uk' : 'en';
    setLocale(i18n.language);
  }, [i18n.language]);

  // Відмітки для календаря: вибрана дата + дати з нотатками
  const markedDates = {
    ...(selectedDate && {
      [selectedDate]: { selected: true, selectedColor: 'blue' }
    }),
    ...tasks.reduce((acc, task) => {
      const date = task.date;
      acc[date] = { marked: true, dotColor: '#2196F3', ...(acc[date] || {}) };
      return acc;
    }, {})
  };

  // Фільтрація завдань за вибраною датою
  const tasksForSelectedDate = tasks.filter(task => task.date === selectedDate);

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          key={locale}               // Перерендер при зміні мови
          onDayPress={day => setSelectedDate(day.dateString)} 
          markedDates={markedDates}
          // Налаштування: понеділок — перший день тижня
          firstDay={1}               
          // Тема відображення
          theme={{
            selectedDayBackgroundColor: 'blue',
            todayTextColor: 'red',
            arrowColor: 'orange',
            monthTextColor: 'black',
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 14
          }}
        />
      </View>

      <View style={styles.tasksContainer}>
        <Text style={styles.tasksHeader}>
          {selectedDate 
            ? `${t('notesFor')} ${selectedDate}` 
            : t('selectDate')}
        </Text>
        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.taskCategory}>
                {t(`category.${item.category}`)}
              </Text>
              {item.description ? <Text>{item.description}</Text> : null}
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noTasksText}>{t('noTasks')}</Text>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  calendarContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  tasksContainer: {
    flex: 1,
    padding: 10
  },
  tasksHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  taskItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  taskCategory: {
    fontSize: 14,
    color: 'gray',
    fontStyle: 'italic',
    marginBottom: 4
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'gray'
  }
});

export default CalendarScreen;
