import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { add, create } from '../store';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 50,
    bottom: 50,
  },
});

function ToDo({ toDos, createToDo, addToDo }) {
  const { register, handleSubmit, setValue } = useForm();
  const [task, setTask] = useState('');

  const taskSubmit = (data) => {
    const { todotask } = data;
    addToDo(todotask);
    setTask('');
  };
  const titleSubmit = (data) => {
    const { todostarttime, todofinishtime, todotitle } = data;

    const todo = [todostarttime, todofinishtime, todotitle];
    createToDo(todo);
  };

  useEffect(() => {
    register('todostarttime'),
      register('todofinishtime'),
      register('todotitle'),
      register('todotask');
  }, [register]);

  return (
    <>
      <View>
        <TouchableOpacity>
          <Text>취소</Text>
        </TouchableOpacity>

        <View style={{ backgroundColor: 'red ' }}>
          <TextInput
            placeholder="시작시간:00:00"
            onChangeText={(text) => setValue('todostarttime', text)}
          ></TextInput>
          <TextInput
            placeholder="마칠시간:00:00"
            onChangeText={(text) => setValue('todofinishtime', text)}
          ></TextInput>
          <TextInput
            placeholder="제목을 입력해 주세요"
            onChangeText={(text) => setValue('todotitle', text)}
          ></TextInput>
          <TouchableOpacity onPress={handleSubmit(titleSubmit)}>
            <Text>추가</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="수행리스트"
            onChangeText={(text) => {
              setTask(text);
              setValue('todotask', text);
            }}
            returnKeyType="done"
            value={task}
            onSubmitEditing={handleSubmit(taskSubmit)}
          ></TextInput>
        </View>

        <TouchableOpacity>
          <Text>모달창닫기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
function mapStateToProps(state) {
  return { toDos: state };
}

function mapDispatchToProps(dispatch) {
  return {
    createToDo: (todo) => dispatch(create(todo)),
    addToDo: (task) => dispatch(add(task)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ToDo);
