import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactNative, {
  TextInput,
  Text,
  findNodeHandle,
  View,
} from 'react-native';
import styles from 'components/modal/ToDoModalStyle';
import { fontPercentage } from 'utils/responsiveUtil';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SCREEN_HEIGHT } from 'constant/const';

export const TaskList = ({ taskList, taskSubmit, canEdit }) => {
  let scrollViewInnerRef = useRef();
  const scrollViewRef = useRef();
  const textInputRef = useRef();
  const [task, setTask] = useState('');
  const handleText = (text) => {
    setTask(text);
  };

  const scrollToInput = (reactNode) => {
    scrollViewRef.current?.update();
    scrollViewRef.current?.scrollToFocusedInput(reactNode);
  };

  return (
    <KeyboardAwareScrollView
      innerRef={(r) => (scrollViewInnerRef.current = r)}
      ref={scrollViewRef}
      bounces={false}
      keyboardDismissMode="on-drag"
      extraHeight={SCREEN_HEIGHT / 2 + 10}
      onContentSizeChange={() => {
        scrollViewRef.current?.scrollToEnd();
      }}
      contentContainerStyle={{
        width: '100%',
        paddingTop: 17,
        paddingHorizontal: 24,
        // paddingBottom: SCREEN_HEIGHT > 668 ? 300 : 200,
        paddingBottom: SCREEN_HEIGHT * 0.33,
        alignItems: 'flex-end',
      }}
      alwaysBounceVertical={false}
      keyboardShouldPersistTaps="handled"
    >
      {taskList.map((item, index) =>
        canEdit ? (
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
        ) : (
          <View
            key={`${item.id}${index}`}
            style={[styles.modalInputTask, styles.modalInputCantEdit]}
          >
            <Text
              style={{
                fontFamily: 'NotoSansKR-Bold',
                fontSize: fontPercentage(10),
              }}
            >
              {item}
            </Text>
          </View>
        ),
      )}

      {canEdit ? (
        <View>
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
            }}
            onFocus={(event) => {
              scrollToInput(ReactNative.findNodeHandle(event.target));
            }}
            value={task}
          />
        </View>
      ) : taskList.length === 0 ? (
        <View style={styles.modalInputTask} />
      ) : null}
    </KeyboardAwareScrollView>
  );
};
