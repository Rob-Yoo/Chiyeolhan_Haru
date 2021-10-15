import { deleteSearchedData, saveSearchedData } from 'utils/asyncStorageUtil';

//검색기록 async storage update
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
    setSearchedList([updateData]);
    await saveSearchedData(updateData);
  } else if (
    searchedList.some((item) => item.text === text && item.type === type)
  ) {
    const tempData = searchedList.filter(
      (item) => !(item.text == text && item.type === type),
    );
    setSearchedList([updateData, ...tempData]);
    await deleteSearchedData(tempData, updateData);
  } else {
    setSearchedList([updateData, ...searchedList]);
    await saveSearchedData(updateData);
  }
};
