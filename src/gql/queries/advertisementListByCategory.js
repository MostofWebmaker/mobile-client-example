import gql from 'graphql-tag';

export const advertisementListByCategory = gql `
    query advertisementListByCategory (
        $categoryId: Int!        
    ) {        
        advertisement_list(category_id: $categoryId) {
            advertisements {
                id
                dateCreated
                dateUpdated
                categoryAdvertisement {
                  id    
                  title
                }
                address {
                    id
                    country {
                        id
                        title
                    }
                    city {
                        id
                        title
                    }
                    district {
                        id
                        title
                    }
                    street {
                        id
                        title
                    }
                    house {
                        id
                        title
                    }
                }
                subwayStation {
                    id
                    title
                }
                bodyAdvertisement {
                    id
                    title
                    price
                    description
                }
                status {
                    id
                    advertisement_status_type {
                        id
                        description
                    }
                }
                user {
                    id
                    name {
                        last
                        first
                        middle
                    }
                    email {
                        value
                    }
                    phone {
                        value
                    }
                }
                photos {
                    id
                    url
                }                
            }
        }
    }
`;