import { ApolloProvider } from "@apollo/client/react";
import "../styles/globals.scss";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Nav from "../components/Nav";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/db",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
