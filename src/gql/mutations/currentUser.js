import gql from 'graphql-tag';

export const currentUser = gql `
    mutation currentUser {
        currentUser {
            id
            email {
                value
            }
        }
    }
`;