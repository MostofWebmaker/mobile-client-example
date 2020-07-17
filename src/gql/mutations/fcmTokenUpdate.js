import gql from 'graphql-tag';

export const fcmTokenUpdate = gql `
    mutation fcmTokenUpdate (
        $fcmToken: String!        
    )  {
        fcmTokenUpdate(input:{
            fcm_token: $fcmToken
        }) {
            result
        }
    }    
`;