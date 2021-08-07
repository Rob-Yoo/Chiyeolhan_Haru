import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import deviceInfoModule from "react-native-device-info";
import { dbService } from "../firebase";
import { connect } from "react-redux";
import { init } from "../redux/store";

import { useSelector, useDispatch } from "react-redux";

const uid = deviceInfoModule.getUniqueId();

const exampledata = {
  1628179352151: {
    date: "0806",
    finishtime: "12:00",
    id: 1628179352151,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "11:00",
    title: "Title1",
    todos: ["List1 ", "List2 ", "list3"],
  },
  1628180195240: {
    date: "0806",
    finishtime: "16:00",
    id: 1628180195240,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "15:00",
    title: "Title2",
    todos: ["List1", "List2", "List3", "list4"],
  },
  1628181968664: {
    date: "0806",
    finishtime: "15”00",
    id: 1628181968664,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "15:00",
    title: "Title title",
    todos: ["Kustkust1", "Listlist2"],
  },
  1628185678507: {
    date: "0806",
    finishtime: "14:00",
    id: 1628185678507,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "12:00",
    title: "Wasssap",
    todos: ["List1", "List2"],
  },
  1628185964498: {
    date: "0806",
    finishtime: "90",
    id: 1628185964498,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "7:00",
    title: "Update",
    todos: ["List1", "List2"],
  },
  1628186073250: {
    date: "0806",
    finishtime: "22:00",
    id: 1628186073250,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "13:00",
    title: "Hiiiiiii",
    todos: ["Hi hi", "Hihihi 2"],
  },
  1628186231641: {
    date: "0806",
    finishtime: "13:00",
    id: 1628186231641,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "12:00",
    title: "Title",
    todos: ["Lililili"],
  },
  1628187065020: {
    date: "0806",
    finishtime: "44:00",
    id: 1628187065020,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "44:00",
    title: "Title121212",
    todos: ["List1", "List2"],
  },
  1628187328232: {
    date: "0806",
    finishtime: "17:00",
    id: 1628187328232,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "15:00",
    title: "Eat",
    todos: ["Eat eat eat~~!"],
  },
  1628187751973: {
    date: "0806",
    finishtime: "15:—",
    id: 1628187751973,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "14:00",
    title: "Sleep",
    todos: ["Good"],
  },
  1628187879369: {
    date: "0806",
    finishtime: "15:00",
    id: 1628187879369,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "12:00",
    title: "Todo",
    todos: ["Todo list"],
  },
  1628190932164: {
    date: "0806",
    finishtime: "16:00",
    id: 1628190932164,
    latitude: "위도",
    location: "장소명",
    longitude: "경도",
    starttime: "15:00",
    title: "Todo wh",
    todos: [],
  },
};
const Cards = styled.View``;
const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55bcf6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
  circular: {
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: "#55BCF6",
    borderRadius: 5,
  },
  paginationStyle: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
const Card = (props) => {
  const { index, text, todos, finishtime, starttime, location } = props;
  return (
    <View style={styles.item}>
      <TouchableOpacity style={styles.square}></TouchableOpacity>
      <Text style={styles.itemText}>
        {starttime}~{finishtime}
      </Text>
      <Text style={styles.itemText}>위치:{location}</Text>

      <Text style={styles.itemText}>{text}</Text>
      <Text>진행률바</Text>
    </View>
  );
};
const Task = (props) => {
  //console.log(props);
  return (
    <View style={styles.item}>
      <Text style={styles.itemText}>{props.text}</Text>
    </View>
  );
};

const renderPagination = (index, total, context) => {
  if (context.props.toDos.length === 0) {
    //데이터가 아직 없을때
    console.log("no data");
    return;
  } else {
    //console.log(context.props.toDos);
    console.log(context.props.toDos);
    const list = context.props.toDos[index].todos;
    return (
      <View style={styles.pagenationStyle}>
        <Text>수행 리스트</Text>
        {list.map((item, index) => {
          return <Task key={index} text={item} />;
        })}
      </View>
    );
  }

  return (
    <View style={styles.pagenationStyle}>
      <Text>수행 리스트</Text>
      <Text>{index}</Text>
    </View>
  );
};

const PaintHome = (todoArr) => {
  console.log(`paintHome${todoArr}`);
  if (Array.isArray(todoArr) && todoArr.length === 0) {
    return (
      <Cards style={{ flex: 2 }}>
        <Text>데이터가 없습니다</Text>
      </Cards>
    );
  }
  return (
    <Cards style={{ flex: 2 }}>
      <Swiper toDos={todoArr} renderPagination={renderPagination} loop={false}>
        {todoArr.map((item) => {
          // console.log(`imtem: ${JSON.stringify(item)}`);
          return (
            <Card
              key={item.id}
              text={item.title}
              starttime={item.starttime}
              finishtime={item.finishtime}
              location={item.location}
              toDos={todoArr}
            />
          );
        })}
      </Swiper>
    </Cards>
  );
};

function HomeContent({ initToDo, toDos }) {
  //  console.log(`store toDos : ${JSON.stringify(toDos)}`);
  const [isLoading, setLoading] = useState(true);
  const [fetchedToDo, setFetchObj] = useState({});
  const mounted = useRef(false);
  const mounted2 = useRef(false);
  //const [todoArr, setToDoArr] = useState([])
  let completed = false;
  //const { toDos:content } = toDos;
  let todoArr = [];

  let rowObj = {};
  //Object.keys(fetchedToDo).length === 0

  const getToDos = async () => {
    const row = await dbService.collection(`${uid}`).get();
    console.log("nodata");
    row.forEach((data) => (rowObj[data.id] = data.data()));
    console.log(rowObj);
    if (Object.keys(rowObj).length === 0) {
      setLoading(false);
      console.log(todoArr);
    }
    setFetchObj(rowObj);
    // setLoading(false);

    // let tempArr = [];
    // for (key in rowObj) tempArr.push(rowObj[key]);
    // setToDoArr([...tempArr]);
  };

  useEffect(() => {
    getToDos();
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      initToDo(fetchedToDo);
    }
  }, [fetchedToDo]);

  useEffect(() => {
    if (!mounted2.current) {
      mounted2.current = true;
    } else {
      console.log("here22");
      //console.log(toDos);
      setLoading(false);
    }
  }, [toDos]);
  for (key in toDos) todoArr.push(toDos[key]);

  return (
    <>
      <Text>Cards</Text>
      {isLoading ? <Text>loading</Text> : PaintHome(todoArr)}
    </>
  );
}
function mapStateToProps(state) {
  return { toDos: state };
}

function mapDispatchToProps(dispatch) {
  return {
    initToDo: (todo) => dispatch(init(todo)),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeContent);
