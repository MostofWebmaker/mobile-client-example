import gql from 'graphql-tag';

export const newRefreshToken = gql `
    mutation newRefreshToken (
        $refreshToken: String!        
    )  {
        resfreshToken(input:{
            refresh_token:$refreshToken
        }) {
            token
            refresh_token
        }
    }    
`;