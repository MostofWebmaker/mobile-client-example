import gql from 'graphql-tag';

export const advertisementStatusTypeList = gql `
    query advertisementStatusTypeList {
        advertisementStatusTypeList {
            advertisementStatusType {
                id
                description
            }
        }        
    }
`;