import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Log {
    lift: String
    notes: String
    rating: Int
    reps: Int
    timestamp: Int
    weight: Int
  }
  type User {
    first_name: String
    last_name: String
    logs: [Log]
  }
  type Lift {
    full_name: String
    lift_type: String
    lift_sub_type: String
  }
  type Query {
    getUsers: [User]
    getUser(name: String!): User!
    getLifts: [Lift]
  }
`;
