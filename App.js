import React  from 'react'
import AppNavigation from './src/navigation/AppNavigation'
import {AppLoading} from "expo"
import * as Font from "expo-font"
import { ApolloProvider } from 'react-apollo'
import { Client }  from './src/store/Client'

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,

        };
    }


    async componentDidMount() {
        await Font.loadAsync({
            'Roboto_medium': require('./assets/fonts/Roboto-Medium.ttf')
        })
        this.setState({ fontLoaded: true })
    }

    render() {

         if (!this.state.fontLoaded) {
            return <AppLoading/>
         }
         return  <ApolloProvider client={Client}><AppNavigation /></ApolloProvider>
    }
}