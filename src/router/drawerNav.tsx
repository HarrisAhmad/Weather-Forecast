import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import HomeScreen from '../screens/homeScreen';
import LocationScreen from '../screens/locationScreen';
import CustomBottomDrawerTab from '../components/customBottomDrawerTab';

const Drawer = createDrawerNavigator();

const DrawerFlow = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomBottomDrawerTab {...props} />}>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="Location Screen"
        component={LocationScreen}
        options={{
          drawerItemStyle: {height: 0},
          title: '',
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
};
export default DrawerFlow;
