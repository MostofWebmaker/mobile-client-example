import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import App from './App'
import { Platform } from 'react-native'

if (Platform.OS === 'android') {
    const { UIManager } = NativeModules;
    if (UIManager) {
        UIManager.genericDirectEventTypes = {
            ...UIManager.genericDirectEventTypes,
            onGestureHandlerEvent: { registrationName: 'onGestureHandlerEvent' },
            onGestureHandlerStateChange: {
                registrationName: 'onGestureHandlerStateChange',
            },
        };
    }
}
registerRootComponent(App);
