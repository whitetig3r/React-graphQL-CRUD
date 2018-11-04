import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query, Mutation, ApolloConsumer } from 'react-apollo';
import { FETCH_POSTS, CREATE_POST, DELETE_POST } from './queries';
//import { defaults, resolvers } from "./resolvers";

const client = new ApolloClient({
  uri: 'https:xxxxxxxxxxxxxxxxxxxx__YOUR_API_URL.com',
})

/*client.query({
  query: testQuery
}).then((res)=>{
  console.log(res);
})
*/

class App extends Component {
  state = {
      status: "PUBLISHED",
      title: "",
      body: ""
  }

  changeHandler = (e) => {
    this.setState({
      [ e.target.name ] : e.target.value
    })
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Mutation
            mutation={CREATE_POST}
            variables = {
              {
                Post:this.state
              }
            }
            update={(cache, { data: { createPost } } ) => {
              const { posts } = cache.readQuery({ query: FETCH_POSTS });
              cache.writeQuery({
                query:FETCH_POSTS,
                data: { posts: posts.concat( createPost ) }
              });
            }}
          >
              { ( createPost, { data } ) => (
                  <form>
                    TITLE: <input type="text" value={this.state.title} name="title" onChange={this.changeHandler.bind(this)} />
                    BODY: <input type="text" value={this.state.body} name="body" onChange={this.changeHandler.bind(this)} />
                    <button onClick = { async e => {
                        e.preventDefault();
                        //console.log("ADDING")
                        await createPost()
                        this.setState({status:"PUBLISHED",title:"",body:""})
                        }
                      } >
                        Post!
                      </button>
                  </form>
                )
              }
          </Mutation>
          <Query
            query={ FETCH_POSTS }
            update = { (cache, { data: { fetchPosts } }) => {
                const { posts } = cache.readQuery({ query: FETCH_POSTS });
              }
            }
          >
            {
              ( { loading, data } ) => {
                if(loading) return "Loading..";
                const { posts } = data;
                //console.log("UPDATING");
                return posts.map( ( post,i ) => (
                  <Mutation
                    key={i}
                    mutation={ DELETE_POST }
                    variables={
                      {
                        ID : {id:`${post.id}`}
                      }
                    }
                    update={ (cache, { data: { deletePost } }) => {
                      const { posts } = cache.readQuery({ query: FETCH_POSTS });
                      cache.writeQuery({
                        query: FETCH_POSTS,
                        data: { posts: posts.filter( post => post.id !== deletePost.id ) }
                      });
                    }}
                  >
                    { (deletePost, { data } ) => (
                        <section style= {{ background:'whitesmoke'}}>
                          <h1>{post.title}</h1>
                          <div>{post.body}</div>
                          <button onClick={async e=>{
                            await deletePost();
                          }}>Delete Post</button>
                        </section>)
                      }
                  </Mutation>
                ))
              }
            }
          </Query>

        </div>
      </ApolloProvider>
    );
  }
}

export default App;
