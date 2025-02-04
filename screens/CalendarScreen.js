import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useTranslation } from 'react-i18next';
import { TasksContext } from '../context/TasksContext';

// Локалізація календаря
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

  useEffect(() => {
    LocaleConfig.defaultLocale = i18n.language === 'uk' ? 'uk' : 'en';
    setLocale(i18n.language);
  }, [i18n.language]);

  // Фільтрація завдань на основі вибраної дати
  const tasksForSelectedDate = tasks.filter((task) => task.date === selectedDate);

  return (
    <View style={styles.container}>
      {/* Календар у верхній частині */}
      <View style={styles.calendarContainer}>
        <Calendar
          key={locale} 
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: 'blue' }
          }}
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

      {/* Список завдань */}
      <View style={styles.tasksContainer}>
        <Text style={styles.tasksHeader}>
          {selectedDate ? `${t('notesOn')} ${selectedDate}` : t('selectDate')}
        </Text>
        <FlatList
          data={tasksForSelectedDate}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              {/* Виправлена помилка: якщо категорія відсутня, виводимо "Інше" */}
              {item.category ? (
                <Text style={styles.taskCategory}>{t(`category.${item.category}`)}</Text>
              ) : (
                <Text style={styles.taskCategory}>{t('category.other')}</Text>
              )}
              {item.description ? <Text>{item.description}</Text> : null}
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noTasksText}>{t('noTasks')}</Text>}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tasksContainer: {
    flex: 1,
    padding: 10,
  },
  tasksHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskCategory: {
    fontSize: 14,
    color: 'gray',
    fontStyle: 'italic',
  },
  noTasksText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
  },
});

export default CalendarScreen;
