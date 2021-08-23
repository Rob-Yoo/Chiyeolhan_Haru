import { deleteSearchedData, saveSearchedData } from 'utils/AsyncStorage';

export const handleFilterData = (text, type, searchedList, setSearchedList) => {
  const updateData = {
    id: Date.now(),
    text,
    type,
  };
  if (searchedList.some((item) => item.text === text)) {
    const tempData = searchedList.filter((item) => item.text !== text);
    deleteSearchedData(tempData, updateData);
    setSearchedList([updateData, ...tempData]);
  } else {
    saveSearchedData(updateData);
    setSearchedList([updateData, ...searchedList]);
  }
};
