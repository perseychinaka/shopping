/**
 * @format
 */

import {AppRegistry} from 'react-native';
import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import 'react-native-screens';
import 'react-native-safe-area-context';
import App from './App';

import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
