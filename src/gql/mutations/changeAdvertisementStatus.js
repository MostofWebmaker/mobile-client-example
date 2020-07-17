import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

export const changeAdvertisementStatus = gql `
    mutation changeAdvertisementStatus (
        $advertisementId: Int!
        $statusId: Int!,
        $userId: Int!
    )  {
        changeAdvertisementStatus(input: {
            advertisementId: $advertisementId
            statusId: $statusId,
            userId: $userId
        }) {
            id
            advertisement_status_type {
                id
                description
            }
        }
    }
`;