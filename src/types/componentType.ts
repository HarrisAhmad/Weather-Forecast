import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {DrawerNavigationProp} from '@react-navigation/drawer';
// export interface CustomBottomDrawerTabProps {
//   navigation: NativeStackNavigationProp<any>;
//   state?: any;
//   descriptors?: any;
// }

export interface ICustomBottomDrawerTabProps {
  navigation: NativeStackNavigationProp<any>;
  state: any;
  descriptors?: any;
}
