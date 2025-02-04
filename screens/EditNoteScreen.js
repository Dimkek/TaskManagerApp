import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const EditNoteScreen = ({ route, navigation }) => {
  const { task } = route.params; // Отримуємо переданий параметр
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleSave = () => {
    // Логіка оновлення задачі
    console.log('Updated Task:', { ...task, title, description });
    navigation.goBack(); // Повернення до попереднього екрана
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Заголовок"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Опис"
        multiline
      />
      <Button title="Зберегти" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});

export default EditNoteScreen;
