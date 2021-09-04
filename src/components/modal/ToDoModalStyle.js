import { Dimensions, StyleSheet } from 'react-native';
import { fontPercentage } from 'utils/responsive';

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
    flex: 1,
  },
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
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#54BCB6',
    height: Dimensions.get('window').height > 667 ? '40%' : '45%',
    // height: 320,
    borderRadius: 50,
    marginTop: -10,
  },
  modalTextView: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginTop: 20,
  },
  modalTopText: {
    fontFamily: 'NotoSansKR-Bold',
    color: '#FFFFFF',
    fontSize: 20,
  },
  imageBackgroundMapStyle: {
    width: Dimensions.get('window').height > 667 ? 200 : 150,
    height: Dimensions.get('window').height > 667 ? 200 : 150,
    borderRadius: 100,
  },
  imageBackgroundStyle: {
    width: Dimensions.get('window').height > 667 ? 200 : 150,
    height: Dimensions.get('window').height > 667 ? 200 : 150,
    borderRadius: 100,
    paddingHorizontal: Dimensions.get('window').height > 667 ? '33%' : '35%',
    paddingVertical: 40,
    marginBottom: 20,
  },
  modalLocationText: {
    fontFamily: 'NotoSansKR-Regular',
    color: '#FFFFFF',
    fontSize: fontPercentage(20),
  },
  modalInputContainer: {
    backgroundColor: '#e2ece9',
    marginTop: '40%',
    height: Dimensions.get('window').height / 1.2,
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
  modalInputTitle: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 40,
    marginBottom: 10,
  },
  modalInputTask: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: 40,
    marginBottom: 20,
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  modalInputText: {
    color: '#B7B7B7',
    marginVertical: 10,
  },
  timePickerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  todoInputContainer: {
    alignItems: 'center',
    shadowColor: '#00000029',
    shadowOffset: {
      width: 3.4,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  modalTaskContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 350,
    height: Dimensions.get('window').height > 667 ? 200 : 100,
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
