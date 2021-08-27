import { deleteSearchedData, saveSearchedData } from 'utils/AsyncStorage';

export const handleFilterData = async (
  text,
  type,
  searchedList,
  setSearchedList,
) => {
  const updateData = {
    id: Date.now(),
    text,
    type,
  };

  if (searchedList === null) {
    await saveSearchedData(updateData);
    setSearchedList([updateData]);
    console.log(searchedList);
  } else if (
    searchedList.some((item) => item.text === text && item.type === type)
  ) {
    const tempData = searchedList.filter(
      (item) => !(item.text == text && item.type === type),
    );
    console.log(tempData);
    await deleteSearchedData(tempData, updateData);
    setSearchedList([updateData, ...tempData]);
  } else {
    await saveSearchedData(updateData);
    setSearchedList([updateData, ...searchedList]);
  }
};
