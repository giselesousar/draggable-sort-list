import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Checkbox, SortableList} from './components';

const data = [
  {id: 1, title: 'Item 1', isChecked: false, order: 0},
  {id: 2, title: 'Item 2', isChecked: false, order: 1},
  {id: 3, title: 'Item 3', isChecked: false, order: 2},
  {id: 4, title: 'Item 4', isChecked: false, order: 3},
  {id: 5, title: 'Item 5', isChecked: false, order: 4},
  {id: 6, title: 'Item 6', isChecked: false, order: 5},
  {id: 7, title: 'Item 7', isChecked: false, order: 6},
  {id: 8, title: 'Item 8', isChecked: false, order: 7},
  {id: 9, title: 'Item 9', isChecked: false, order: 8},
];

const rowSize = 50;

const App = () => {
  const [items, setItems] = useState(data);

  function onChange(id) {
    setItems(
      items.map(item =>
        item.id !== id ? item : {...item, isChecked: !item.isChecked},
      ),
    );
  }

  function onRemove(id) {
    const removed = items.find(item => item.id === id);
    setItems(
      items
        .filter(item => item.id !== id)
        .map(item =>
          item.order < removed.order ? item : {...item, order: item.order - 1},
        ),
    );
  }

  function reorder(positions) {
    setItems(items.map(item => ({...item, order: positions[item.id]})));
  }

  const renderItem = (item, index) => (
    <View
      id={item.id}
      order={item.order}
      style={styles.item}
      key={`${item.id}-${index}`}>
      <View style={styles.checkboxLabel}>
        <Checkbox
          isChecked={item.isChecked}
          onChange={() => onChange(item.id)}
          style={styles.checkbox}
        />
        <Text
          style={{
            textDecorationLine: item.isChecked ? 'line-through' : 'none',
          }}>
          {item.title}
        </Text>
      </View>
      <TouchableOpacity onPress={() => onRemove(item.id)}>
        <Icon name="close" size={14} />
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="white" />
        <View style={styles.card}>
          <Text style={styles.title}>Reorderable list</Text>
          <SortableList
            onDragEnd={reorder}
            style={styles.list}
            rowSize={rowSize}>
            {items.map(renderItem)}
          </SortableList>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
  },
  item: {
    height: rowSize,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  list: {
    marginTop: 10,
  },
  checkboxLabel: {
    flexDirection: 'row',
  },
  checkbox: {
    marginRight: 10,
  },
});

export default App;
