import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNative, {
  TextInput,
  Text,
  findNodeHandle,
  View,
} from 'react-native';
import styles from 'components/modal/ToDoModalStyle';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREEN_HEIGHT } from '../constant/const';

export const TaskList = ({ taskList, taskSubmit, isToday, passModalData }) => {
  console.log();
  const [task, setTask] = useState('');

  let scrollViewInnerRef = useRef();
  const scrollViewRef = useRef();
  const textInputRef = useRef();
  const handleText = (text) => {
    setTask(text);
  };

  const editSchedule = (item, index) => {
    setTask({ item, index });
  };

  const handleOnSubmitEditing = (task) => {
    taskSubmit(task, index);
    setTask('');
  };
  const scrollToInput = (reactNode) => {
    scrollViewRef.current?.update();
    scrollViewRef.current?.scrollToFocusedInput(reactNode);
  };

  const scrollToEnd = () => {
    scrollViewRef.current.scrollToEnd();
  };

  return (
    <View>
      <KeyboardAwareScrollView
        innerRef={(r) => (scrollViewInnerRef.current = r)}
        ref={scrollViewRef}
        bounces={false}
        keyboardDismissMode="on-drag"
        extraHeight={SCREEN_HEIGHT / 2 + 30}
        onContentSizeChange={() => {
          scrollViewRef.current?.scrollToEnd();
        }}
        contentContainerStyle={{
          width: '100%',
          paddingTop: 10,
          paddingHorizontal: 20,
          paddingBottom: SCREEN_HEIGHT > 668 ? 200 : 160,
          alignItems: 'center',
        }}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        {taskList.map((item, index) => (
          <View key={`${item.id}${index}`}>
            <TextInput
              style={styles.modalInputTask}
              onSubmitEditing={(task) => taskSubmit(task, index)}
              onFocus={(event) => {
                scrollToInput(ReactNative.findNodeHandle(event.target));
              }}
            >
              <Text style={styles.modalInputText}>{item}</Text>
            </TextInput>
          </View>
        ))}

        <TextInput
          ref={textInputRef}
          blurOnSubmit={false}
          placeholder="입력"
          style={[styles.modalInputTask]}
          returnKeyType="done"
          onChangeText={(task) => handleText(task)}
          onSubmitEditing={(task) => {
            taskSubmit(task, taskList.length);
            setTask('');
            //textInputRef.current?.focus();
          }}
          onFocus={(event) => {
            scrollToEnd();
          }}
          value={task}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
