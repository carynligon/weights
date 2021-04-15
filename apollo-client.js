import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.tvmaze.com/shows/174",
  cache: new InMemoryCache(),
});

export default client;
