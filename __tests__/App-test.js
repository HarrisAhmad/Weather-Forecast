/**
 * @format
 */

import 'react-native';
import React from 'react';
// import App from '../App';

// // Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import LoadingIndicator from '../src/components/loadingIndicator';
import HomeScreen from '../src/screens/homeScreen';

// it('renders correctly', () => {
//   renderer.create(<App />);
// });

// test('testing the loading indicator', () => {
//   const tree = renderer.create(<LoadingIndicator />).toJSON();
//   expect(tree).toMatchSnapshot();
// });

test('testing the home screen', () => {
  const tree = renderer.create(<HomeScreen />).toJSON();
  expect(tree).toMatchSnapshot();
});
