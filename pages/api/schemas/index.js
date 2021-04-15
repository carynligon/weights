import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Log {
    lift: String
    notes: String
    rating: Int
    reps: Int
    timestamp: String
    weight: Int
  }
  type User {
    username: String
    first_name: String
    last_name: String
    logs: [Log]
  }
  type Lift {
    id: String
    full_name: String
    lift_type: String
    lift_sub_type: String
  }
  type Query {
    addLog(user: String!, log: LogInput): Log!
    getUsers: [User]
    getUser(username: String!): User!
    getLifts: [Lift]
  }
  input LogInput {
    lift: String
    notes: String
    rating: Int
    reps: Int
    timestamp: String
    weight: Int
  }
  type Mutation {
    addLog(user: String!, log: LogInput, existing_logs: [LogInput]): [Log]!
  }
`;
