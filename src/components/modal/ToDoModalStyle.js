import { StyleSheet } from 'react-native';
import { CONTAINER_WIDTH } from 'react-native-week-view/src/utils';

import { fontPercentage } from 'utils/responsiveUtil';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from 'constant/const';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
  },
  background: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  toDoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
  },
  modalTopContainer: {
    borderRadius: 10,
    backgroundColor: '#54BCB6',
    height: SCREEN_HEIGHT > 668 ? '45%' : '50%',
    borderRadius: 50,
    paddingHorizontal: SCREEN_HEIGHT > 668 ? 25 : 10,
  },
  modalTextView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 80,
    marginTop: 20,
    width: '100%',
  },
  modalTopText: {
    fontFamily: 'GodoB',
    color: '#FFFFFF',
    fontSize: 20,
    paddingHorizontal: 15,
  },
  titleText: {
    fontFamily: 'GodoB',
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  imageBackgroundMapStyle: {
    width: SCREEN_HEIGHT > 668 ? SCREEN_WIDTH * 0.36 : SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT > 668 ? SCREEN_WIDTH * 0.36 : SCREEN_WIDTH * 0.35,
    borderRadius: 100,
    marginRight: 20,
  },
  imageBackgroundStyle: {
    width: SCREEN_HEIGHT > 668 ? SCREEN_WIDTH * 0.36 : SCREEN_WIDTH * 0.35,
    height: SCREEN_HEIGHT > 668 ? SCREEN_WIDTH * 0.36 : SCREEN_WIDTH * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  modalLocationText: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    fontSize: fontPercentage(15),
    marginLeft: 10,
  },
  //FavoriteModal Container 크기도 변경
  modalInputContainer: {
    backgroundColor: '#e2ece9',
    marginTop: '27.8%',
    height: SCREEN_HEIGHT / 1.27,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  modalInput1: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginRight: 20,
    width: 165,
    height: 40,
  },
  modalInput2: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 165,
    height: 40,
    marginBottom: 10,
  },
  taskTitle: {
    color: '#229892',
    fontFamily: 'NotoSansKR-Bold',
    fontSize: 13,
    // marginLeft: 20,
    flex: 2,
  },
  taskInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    height: 50,
    marginBottom: 10,
  },
  modalInputTitle: {
    width: 140,
    height: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: 'center',
    marginLeft: 10,
    paddingLeft: 5,
    fontSize: 12,
  },
  modalInputTask: {
    width: CONTAINER_WIDTH * 0.75,
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    shadowColor: '#00000029',
    shadowOffset: {
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    justifyContent: 'center',
  },
  modalInputText: {
    color: '#B7B7B7',
    marginVertical: 10,
  },
  timePickerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  todoBottomContainer: {
    paddingTop: 30,
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalTaskContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: SCREEN_HEIGHT > 668 ? 200 : 100,
    marginBottom: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
});
export default styles;
