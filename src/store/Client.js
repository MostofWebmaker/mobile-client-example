import {ApolloClient} from 'apollo-boost'
import {ApolloLink} from 'apollo-link'
import {createHttpLink} from 'apollo-link-http'
import QueueLink from 'apollo-link-queue'
import {RetryLink} from 'apollo-link-retry'
import {setContext} from 'apollo-link-context'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {CONFIG} from '../config.js'
import {getToken} from '../util'

const cache = new InMemoryCache();
const queueLink = new QueueLink();


const authLink = setContext(async(_, { headers }) => {
    const token = await getToken()

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null
        },
    };
})

const httpLink = ApolloLink.from([
    new RetryLink(),
    queueLink,
    createHttpLink({
        credentials: 'same-origin',
        uri: CONFIG.API_PROD_URL,
    }),
]);

export const Client = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
});
