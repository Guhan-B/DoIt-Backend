import { gql } from 'apollo-server-express';

export default gql`
type Query {
  me: User!
  getLogs: [Log]!
  getTasks(logId: ID!): [Task]!
}

type Mutation {
  registerUser(name: String! email: String! password: String!):Boolean!
  generateNewToken: AuthResponse!
  loginUser(email: String! password: String!):AuthResponse!
  createLog(title: String!):Log!
  deleteLog(id: ID!):Log!
  createTask(title: String! logId: ID! priority: Int!):Task!
  deleteTask(taskId: ID! logId: ID!):Task!
  logout(refreshToken: String!):Boolean!
}

type AuthResponse {
  accessToken: String!
  refreshToken: String!
  expiryTime: Float!
}

type User {
  name: String!
  email: String!
  logs: [Log]!
}

type Log {
  id: ID!
  title: String!
  tasks: [Task]!
}

type Task {
  id: ID!
  logId: ID!
  title: String!
  priority: Int!
}
`;