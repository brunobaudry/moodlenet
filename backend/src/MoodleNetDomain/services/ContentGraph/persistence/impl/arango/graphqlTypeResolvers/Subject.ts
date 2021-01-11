import { defaultFieldResolver } from 'graphql'
import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { DBReady } from '../ContentGraph.persistence.arango.env'
import { edgesResolver } from '../ContentGraph.persistence.arango.queries'

export const Subject = DBReady.then<Resolvers['Subject']>(
  ({ FollowsEdges, ReferencesEdges, db }) => ({
    followers: edgesResolver({
      db,
      collection: FollowsEdges,
      typenames: ['UserFollowsSubject'],
      reverse: true,
    }),
    collectionReferences: edgesResolver({
      db,
      collection: ReferencesEdges,
      typenames: ['CollectionReferencesSubject'],
      reverse: true,
    }),
    resourceReferences: edgesResolver({
      db,
      collection: ReferencesEdges,
      typenames: ['ResourceReferencesSubject'],
      reverse: true,
    }),
    _id: defaultFieldResolver,
    name: defaultFieldResolver,
  })
)
