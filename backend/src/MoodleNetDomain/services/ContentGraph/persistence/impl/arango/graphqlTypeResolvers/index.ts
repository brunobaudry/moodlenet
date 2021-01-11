import { Resolvers } from '../../../../ContentGraph.graphql.gen'
import { Query } from './Query'
import { Collection } from './Collection'
import { Resource } from './Resource'
import { Subject } from './Subject'
import { User } from './User'

export const getGraphQLTypeResolvers = async (): Promise<
  Omit<Resolvers, 'Mutation'>
> => {
  return {
    User: await User,
    Subject: await Subject,
    Query: await Query,
    Collection: await Collection,
    Resource: await Resource,
    //
    // default resolvers
    //
    Likes: {} as any,
    Follows: {} as any,
    GraphEdge: {} as any,
    GraphVertex: {} as any,
    IUserFollowsSubject: {} as any,
    IUserFollowsUser: {} as any,
    Page: {} as any,
    PageInfo: {} as any,
    SubjectFollower: {} as any,
    SubjectFollowersPage: {} as any,
    UserFollowsSubject: {} as any,
    UserFollowsSubjectPage: {} as any,
    UserFollowsUser: {} as any,
    UserFollowsUserPage: {} as any,
    SessionAccount: {} as any,
    GraphPageEdge: {} as any,
    ISubjectFollower: {} as any,
    IUserFollower: {} as any,
    SubjectFollowerEdge: {} as any,
    UserFollower: {} as any,
    UserFollowerEdge: {} as any,
    UserFollowerPage: {} as any,
    UserFollowsSubjectEdge: {} as any,
    UserFollowsUserEdge: {} as any,
    CollectionFollower: {} as any,
    CollectionFollowerEdge: {} as any,
    CollectionFollowersPage: {} as any,
    ICollectionFollower: {} as any,
    IUserFollowsCollection: {} as any,
    UserFollowsCollection: {} as any,
    UserFollowsCollectionEdge: {} as any,
    UserFollowsCollectionPage: {} as any,
    CollectionContainsResource: {} as any,
    CollectionContainsResourceEdge: {} as any,
    CollectionContainsResourcePage: {} as any,
    Contains: {} as any,
    ICollectionContainsResource: {} as any,
    IResourceContainer: {} as any,
    ResourceContainer: {} as any,
    ResourceContainerEdge: {} as any,
    ResourceContainersPage: {} as any,
    IResourceLiker: {} as any,
    IUserLikesResource: {} as any,
    ResourceLiker: {} as any,
    ResourceLikerEdge: {} as any,
    ResourceLikersPage: {} as any,
    UserLikesResource: {} as any,
    UserLikesResourceEdge: {} as any,
    UserLikesResourcePage: {} as any,
    CollectionReferencesSubject: {} as any,
    CollectionReferencesSubjectEdge: {} as any,
    CollectionReferencesSubjectPage: {} as any,
    ICollectionReferencesSubject: {} as any,
    IResourceReferencesSubject: {} as any,
    ISubjectCollectionReference: {} as any,
    ISubjectResourceReference: {} as any,
    References: {} as any,
    ResourceReferencesSubject: {} as any,
    ResourceReferencesSubjectEdge: {} as any,
    ResourceReferencesSubjectPage: {} as any,
    SubjectCollectionReference: {} as any,
    SubjectCollectionReferenceEdge: {} as any,
    SubjectCollectionReferencesPage: {} as any,
    SubjectResourceReference: {} as any,
    SubjectResourceReferenceEdge: {} as any,
    SubjectResourceReferencesPage: {} as any,
  }
}
