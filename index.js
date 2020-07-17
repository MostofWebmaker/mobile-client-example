import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import App from './App'
import { Platform } from 'react-native'

if (Platform.OS === 'android') {
    const { UIManager } = NativeModules;
    if (UIManager) {
        // Add gesture specific events to genericDirectEventTypes object exported from UIManager native module.
        // Once new event types are registered with react it is possible to dispatch these events to all kind of native views.
        UIManager.genericDirectEventTypes = {
            ...UIManager.genericDirectEventTypes,
            onGestureHandlerEvent: { registrationName: 'onGestureHandlerEvent' },
            onGestureHandlerStateChange: {
                registrationName: 'onGestureHandlerStateChange',
            },
        };
    }
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
