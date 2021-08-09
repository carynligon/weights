import { gql } from "apollo-server-micro";

export const typeDefs = gql`
  type Log {
    lift: String
    notes: String
    rating: Int
    reps: Int
    timestamp: String
    id: String
    weight: Int
  }
  type User {
    username: String
    first_name: String
    last_name: String
    logs: [Log]
  }
  type Lift {
    full_name: String
    id: String
  }
  type Query {
    getUsers: [User]
    getUser(uid: String!): User!
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
  input LiftInput {
    full_name: String!
  }
  type Mutation {
    addLog(user: String!, log: LogInput, existing_logs: [LogInput]): [Log]!
    addUserLog(uid: String!, log: LogInput): [Log]!
    addLift(lift: LiftInput!): Lift!
    deleteUserLog(uid: String!, id: String!): Log
  }
`;
