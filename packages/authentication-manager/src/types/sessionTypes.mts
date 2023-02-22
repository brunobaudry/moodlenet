import { UserDocument } from './storeTypes.mjs'
export * from './storeTypes.mjs'

export type SessionToken = string

export type ClientSession = UserClientSession | RootClientSession
export type UserClientSession = {
  user: UserDocument
  isRoot?: false
}
export type RootClientSession = {
  isRoot: true
  user?: undefined
}

export type AuthAsyncCtx = {
  currentSession?:
    | { type: 'auth-token-set'; authToken: string }
    | { type: 'client-session-fetched'; authToken: string; clientSession: ClientSession }
}