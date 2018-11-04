import gql from 'graphql-tag';

export const FETCH_POSTS = gql`
query{
  posts{
    id
    title
    body
  }
}
`
export const CREATE_POST = gql`
mutation(
  $Post : PostCreateInput!
){
 createPost(data: $Post){
          id
   				title
          body
      }
}
`

export const DELETE_POST = gql`
mutation(
  $ID : PostWhereUniqueInput!
){
  deletePost( where: $ID ){
     id
  }
}
`
