import { PixelRatio, StyleSheet } from 'react-native';
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
    backgroundColor: 'rgba(171, 171, 171, 0.16)',
  },
  toDoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
  },
  modalTopContainer: {
    width: SCREEN_WIDTH,
    //maxWidth: SCREEN_WIDTH,
    backgroundColor: '#54BCB6',
    borderRadius: 50,
    paddingHorizontal: 38,
    height: SCREEN_HEIGHT > 668 ? '40%' : '40%',
  },
  modalTextView: {
    flexDirection: 'row',
    //justifyContent: 'flex-end',
    marginTop: 21.5,
    //  width: CONTAINER_WIDTH,

    //paddingHorizontal: SCREEN_HEIGHT > 668 ? null : 20,
  },
  modalTopText: {
    fontFamily: 'GodoB',
    color: '#FFFFFF',
    fontSize: fontPercentage(17.5),
  },
  titleText: {
    fontFamily: 'GodoB',
    color: '#FFFFFF',
    fontSize: fontPercentage(10),
    marginBottom: 6,
  },
  favoriteIconBackground: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 33,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
    paddingLeft: 1,
    marginLeft: 5.2,
  },
  radiusImage: {
    width: SCREEN_HEIGHT > 668 ? SCREEN_WIDTH * 0.36 : SCREEN_WIDTH * 0.29,
    height: SCREEN_HEIGHT > 668 ? SCREEN_WIDTH * 0.36 : SCREEN_WIDTH * 0.29,
    borderRadius: 200,
  },
  imageBackgroundMapStyle: {
    marginRight: 20,
  },
  imageBackgroundStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLocationText: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    fontSize: fontPercentage(15),
    maxWidth: 147,
    maxWidth: SCREEN_WIDTH * 0.4,
  },
  //FavoriteModal Container 크기도 변경
  modalInputContainer: {
    height: SCREEN_HEIGHT / 1.2,
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
    fontFamily: 'GodoB',
    fontSize: fontPercentage(11),
    // marginLeft: 20,
    position: 'absolute',
    top: 40,
    left: 20,
  },
  taskInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 220,
    height: 50,
    marginBottom: 10,
  },
  modalInputTitle: {
    width: '100%',
    height: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 5,
    fontSize: 12,
    paddingHorizontal: 2,
    maxWidth: 137,
    maxWidth: SCREEN_WIDTH * 0.4,
    //minWidth: 145,
  },
  modalInputTask: {
    width: CONTAINER_WIDTH * 0.7,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.22)',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 3,
    shadowOpacity: 1,
  },
  modalInputCantEdit: {
    shadowColor: null,
    shadowOpacity: 0,
    shadowRadius: 0,
    backgroundColor: '#f8f8f8',
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
    paddingBottom: 12,
  },
  todoBottomContainer: {
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
