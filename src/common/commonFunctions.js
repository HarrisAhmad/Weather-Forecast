import AsyncStorage from '@react-native-async-storage/async-storage';

export const GetDate = () => {
  let currentDate = '';
  const dateTime = new Date();

  date = ('0' + dateTime.getDate()).slice(-2);
  month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
  year = dateTime.getFullYear();

  var hours = dateTime.getHours();
  var minutes = dateTime.getMinutes();
  var seconds = dateTime.getSeconds();

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes;

  //console.log(year + '-' + month + '-' + date + ' ' + strTime);
  actualDate = year + '-' + month + '-' + date + ' ' + strTime;

  return actualDate;
};

// Setting Drawer with no back nav
export const SaveAsyncStorage = async (key, status) => {
  try {
    await AsyncStorage.setItem(key.toString(), status.toString());
  } catch (e) {
    alert('Failed to save the data to the storage');
  }
};

export const GetAsyncStorageData = async key => {
  let result = '';
  try {
    await AsyncStorage.getItem(key.toString()).then(id => {
      result = id;
      return result;
    });
  } catch (e) {
    console.log('Failed to get Data');
  }
  return result;
};
