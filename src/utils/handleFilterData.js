import { deleteSearchedData, saveSearchedData } from 'utils/asyncStorageUtil';

//검색기록 async storage update
export const handleFilterData = async (
  id,
  location,
  address,
  longitude,
  latitude,
  type,
  searchedList,
  //setSearchedList,
) => {
  console.log('handleFilter');
  const updateData = {
    id,
    location,
    address,
    longitude,
    latitude,
    type,
  };

  if (searchedList === null) {
    //setSearchedList([updateData]);
    await saveSearchedData(updateData);
  } else if (
    searchedList.some(
      (item) =>
        item.address === address &&
        item.location === location &&
        item.type === type,
    )
  ) {
    const tempData = searchedList.filter(
      (item) =>
        !(
          item.address === address &&
          item.location === location &&
          item.type === type
        ),
    );
    // setSearchedList([updateData, ...tempData]);
    await deleteSearchedData(tempData, updateData);
  } else {
    //setSearchedList([updateData, ...searchedList]);
    await saveSearchedData(updateData);
  }
};
