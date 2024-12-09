/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import { navigationRef } from './app/navigation/NavigationRef';

AppRegistry.registerComponent(appName, () => App);
