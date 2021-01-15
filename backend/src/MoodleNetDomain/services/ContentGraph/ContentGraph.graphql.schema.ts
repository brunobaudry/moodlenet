import { ServiceExecutableSchemaDefinition } from '../../MoodleNetGraphQL'
import { followUserResolver as followUser } from './apis/ContentGraph.Follows.Create_User_Follows_User'
import { getContentGraphPersistence } from './ContentGraph.env'
import { Resolvers } from './ContentGraph.graphql.gen'

export const getContentGraphServiceExecutableSchemaDefinition = async (): Promise<ServiceExecutableSchemaDefinition> => {
  const { graphQLTypeResolvers } = await getContentGraphPersistence()

  const resolvers: Resolvers = {
    ...graphQLTypeResolvers,
    Mutation: {
      followUser,
    } as any,
  }

  return { resolvers }
}
