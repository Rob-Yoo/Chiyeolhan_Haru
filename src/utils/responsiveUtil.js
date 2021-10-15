import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from 'react-native-responsive-dimensions';

const WINDOW_WIDTH = 360;
const WINDOW_HEIGTH = 640;

export const widthPercentage = (width) => {
  const percentage = (width / WINDOW_WIDTH) * 100;
  return responsiveScreenWidth(percentage);
};

export const heightPercentage = (heigth) => {
  const percentage = (heigth / WINDOW_HEIGTH) * 100;
  return responsiveScreenHeight(percentage);
};
export const fontPercentage = (size) => {
  const percentage = size * 0.125;
  return responsiveScreenFontSize(percentage);
};
