import { globalSearchNodeTypes, isGlobalSearchNodeType } from '@moodlenet/common/lib/content-graph/types/global-search'
import { validateCreateEdgeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createEdge'
import { validateCreateNodeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/createNode'
import { validateEditNodeInput } from '@moodlenet/common/lib/graphql/content-graph/inputStaticValidation/editNode'
import * as GQLTypes from '@moodlenet/common/lib/graphql/types.graphql.gen'
import {
  gqlEdgeId2GraphEdgeIdentifier,
  gqlNodeId2GraphNodeIdentifier,
  gqlNodeId2GraphNodeIdentifierOfType,
} from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { SignOptions } from 'jsonwebtoken'
import { JwtPrivateKey, signJwtActiveUser } from '../../lib/auth/jwt'
import { PasswordHasher } from '../../lib/auth/types'
import { QMino } from '../../lib/qmino'
import * as edgePorts from '../../ports/content-graph/edge'
import * as nodePorts from '../../ports/content-graph/node'
import * as profilePorts from '../../ports/content-graph/profile'
import * as searchPorts from '../../ports/content-graph/search'
import * as newUserPorts from '../../ports/user-auth/new-user'
import * as userPorts from '../../ports/user-auth/user'
import * as utilPorts from '../../ports/utils/utils'
import * as GQLResolvers from '../types.graphql.gen'
import {
  createEdgeMutationError,
  createNodeMutationError,
  deleteEdgeMutationError,
  deleteNodeMutationError,
  editNodeMutationError,
  graphEdge2GqlEdge,
  graphNode2GqlNode,
} from './helpers'
import { getINodeResolver } from './INode'
import { bakeEdgeDoumentData } from './prepareData/createEdge'
import { bakeCreateNodeDoumentData } from './prepareData/createNode'
import { bakeEditNodeDoumentData } from './prepareData/editNode'

export const getGQLResolvers = ({
  jwtPrivateKey,
  jwtSignOptions,
  // passwordVerifier,
  passwordHasher,
  qmino,
}: {
  jwtSignOptions: SignOptions
  jwtPrivateKey: JwtPrivateKey
  // passwordVerifier: PasswordVerifier
  passwordHasher: PasswordHasher
  qmino: QMino
}): GQLResolvers.Resolvers => {
  const INodeResolver = getINodeResolver({ qmino })
  return {
    Query: {
      async node(_root, { id }, ctx /*,_info */) {
        // console.log({ id })
        const parsed = gqlNodeId2GraphNodeIdentifier(id)
        if (!parsed) {
          return null
        }
        const maybeNode = await qmino.query(nodePorts.getBySlug({ ...parsed, env: ctx.authSessionEnv }), {
          timeout: 5000,
        })
        return maybeNode ? graphNode2GqlNode(maybeNode) : null
      },

      async globalSearch(_root, { sort, text, nodeTypes, page }, ctx) {
        const searchInput: searchPorts.GlobalSearchInput = {
          env: ctx.authSessionEnv,
          nodeTypes: (nodeTypes ?? globalSearchNodeTypes).filter(isGlobalSearchNodeType),
          page: {
            after: page?.after,
            before: page?.before,
            first: page?.first ?? 20,
            last: page?.last ?? 20,
          },
          sort,
          text,
        }
        // console.log({ nodeTypes, page, sort, text, _: '**' })

        const { items, pageInfo } = await qmino.query(searchPorts.byTerm(searchInput), { timeout: 5000 })

        return {
          __typename: 'SearchPage',
          pageInfo: {
            __typename: 'PageInfo',
            hasNextPage: pageInfo.hasNextPage,
            hasPreviousPage: pageInfo.hasPreviousPage,
            endCursor: pageInfo.endCursor,
            startCursor: pageInfo.startCursor,
          },
          edges: items.map(([cursor, item]) => {
            const edge: GQLTypes.SearchPageEdge = {
              __typename: 'SearchPageEdge',
              cursor,
              node: graphNode2GqlNode(item),
            }
            return edge
          }),
        }
      },

      async getSession(_root, _no_args, ctx) {
        if (!ctx.authSessionEnv) {
          return null
        }

        const mActiveUser = await qmino.query(userPorts.getActiveByEmail({ email: ctx.authSessionEnv.user.email }), {
          timeout: 5000,
        })
        // console.log({ mActiveUser })
        if (!mActiveUser) {
          return null
        }
        const mProfile = await qmino.query(profilePorts.getByAuthId({ authId: mActiveUser.authId }), { timeout: 5000 })
        // console.log({ mProfile })
        if (!mProfile) {
          return null
        }

        const email = mActiveUser.email
        const profile = graphNode2GqlNode(mProfile) as GQLTypes.Profile
        return {
          __typename: 'UserSession',
          email,
          profile,
        }
      },
    },
    Profile: INodeResolver,
    Collection: INodeResolver,
    IscedField: INodeResolver,
    IscedGrade: INodeResolver,
    Organization: INodeResolver,
    Resource: INodeResolver,
    FileFormat: INodeResolver,
    Language: INodeResolver,
    License: INodeResolver,
    ResourceType: INodeResolver,
    Mutation: {
      async recoverPassword(_root, { email } /* , ctx */) {
        qmino.callSync(userPorts.recoverPasswordEmail({ email }), { timeout: 5000 })
        return {
          __typename: 'SimpleResponse',
          success: true,
        }
      },
      async changeRecoverPassword(_root, { newPassword, token } /* , ctx */) {
        const activeUser = await qmino.callSync(
          userPorts.changeRecoverPassword({ newPasswordClear: newPassword, token }),
          { timeout: 5000 },
        )
        if (!activeUser) {
          return null
        }
        const jwt = signJwtActiveUser({ jwtPrivateKey, jwtSignOptions, user: activeUser })

        return {
          __typename: 'CreateSession',
          jwt,
        }
      },
      async createSession(_root, { password, email, activationEmailToken } /* , ctx */) {
        const sessionResp = await qmino.callSync(userPorts.createSession({ email, activationEmailToken, password }), {
          timeout: 5000,
        })
        if ('string' === typeof sessionResp) {
          return {
            __typename: 'CreateSession',
            message: sessionResp,
          }
        }
        return {
          __typename: 'CreateSession',
          ...sessionResp,
        }
      },
      async signUp(_root, { email, name, password } /* ,env */) {
        const hashedPassword = await passwordHasher(password)
        await qmino.callSync(newUserPorts.signUp({ email, displayName: name, hashedPassword }), { timeout: 5000 })

        return { __typename: 'SimpleResponse', success: true }
      },
      // async activateUser(_root, { password, activationToken, name } /*, ctx */) {
      //   // TODO: implement a port
      //   const hashedPassword = await passwordHasher(password)
      //   const activationresult = await qmino.callSync(
      //     newUserPorts.confirmSignup({ hashedPassword, profileName: name, token: activationToken }),
      //     {
      //       timeout: 5000,
      //     },
      //   )
      //   if ('string' === typeof activationresult) {
      //     return {
      //       __typename: 'CreateSession',
      //       jwt: null,
      //       message: activationresult,
      //     }
      //   }
      //   const jwt = signJwtActiveUser({ user: activationresult, jwtPrivateKey, jwtSignOptions })
      //   return {
      //     __typename: 'CreateSession',
      //     jwt,
      //   }
      // },
      async createNode(_root, { input }, ctx, _info) {
        if (!ctx.authSessionEnv) {
          return createNodeMutationError('NotAuthorized')
        }
        const { nodeType } = input
        const nodeInput = validateCreateNodeInput(input)
        if (nodeInput instanceof Error) {
          return createNodeMutationError('UnexpectedInput', nodeInput.message)
        }
        const data = await bakeCreateNodeDoumentData(nodeInput, nodeType, qmino)
        if ('__typename' in data) {
          return data
        }
        const graphNodeOrError = await qmino.callSync(
          nodePorts.createNode({
            nodeData: {
              ...data,
            },
            sessionEnv: ctx.authSessionEnv,
          }),
          { timeout: 5000 },
        )
        if (graphNodeOrError === 'unauthorized') {
          return createNodeMutationError('NotAuthorized')
        }
        if (!graphNodeOrError) {
          return createNodeMutationError('AssertionFailed')
        }
        const node = graphNode2GqlNode(graphNodeOrError)
        return {
          __typename: 'CreateNodeMutationSuccess',
          node,
        }
      },
      async editNode(_root, { input }, ctx, _info) {
        const { nodeType, id } = input
        const nodeId = gqlNodeId2GraphNodeIdentifier(id)
        if (!nodeId) {
          return editNodeMutationError('UnexpectedInput', `invalid id:${id}`)
        }

        if (!ctx.authSessionEnv) {
          return editNodeMutationError('NotAuthorized')
        }
        const nodeInput = validateEditNodeInput(input)
        if (nodeInput instanceof Error) {
          return editNodeMutationError('UnexpectedInput', nodeInput.message)
        }
        const data = await bakeEditNodeDoumentData(nodeInput, nodeType, qmino)
        if ('__typename' in data) {
          return data
        }
        const graphNodeOrError = await qmino.callSync(
          nodePorts.editNode({
            nodeData: {
              ...data,
            },
            nodeId,
            sessionEnv: ctx.authSessionEnv,
          }),
          { timeout: 5000 },
        )
        if (!graphNodeOrError) {
          return editNodeMutationError('AssertionFailed')
        }
        const node = graphNode2GqlNode(graphNodeOrError)
        return {
          __typename: 'EditNodeMutationSuccess',
          node,
        }
      },
      async createEdge(_root, { input }, ctx, _info) {
        if (!ctx.authSessionEnv) {
          return createEdgeMutationError('NotAuthorized')
        }
        const { edgeType, from, to } = input
        const fromIdentifier = gqlNodeId2GraphNodeIdentifier(from)
        const toIdentifier = gqlNodeId2GraphNodeIdentifier(to)
        if (!(fromIdentifier && toIdentifier)) {
          return createEdgeMutationError('UnexpectedInput', `can't parse node ids`)
        }

        const nodeInput = validateCreateEdgeInput(input)
        if (nodeInput instanceof Error) {
          return createEdgeMutationError('UnexpectedInput', nodeInput.message)
        }
        const data = await bakeEdgeDoumentData(nodeInput, edgeType, qmino)
        if ('__typename' in data) {
          return data
        }
        const graphEdgeOrError = await qmino.callSync(
          edgePorts.createEdge({
            newEdge: {
              ...data,
            },
            sessionEnv: ctx.authSessionEnv,
            from: fromIdentifier,
            to: toIdentifier,
          }),
          { timeout: 5000 },
        )
        if (!graphEdgeOrError) {
          return createEdgeMutationError('AssertionFailed')
        }
        const edge = graphEdge2GqlEdge(graphEdgeOrError)
        return {
          __typename: 'CreateEdgeMutationSuccess',
          edge,
        }
      },
      async deleteEdge(_root, { input }, ctx /*,  _info */) {
        const edge = gqlEdgeId2GraphEdgeIdentifier(input.id)
        if (!edge) {
          return deleteEdgeMutationError('UnexpectedInput')
        }
        if (!ctx.authSessionEnv) {
          return deleteEdgeMutationError('NotAuthorized')
        }
        const deleteResult = await qmino.callSync(
          edgePorts.deleteEdge({
            sessionEnv: ctx.authSessionEnv,
            edge,
          }),
          { timeout: 5000 },
        )
        if (deleteResult === false) {
          return deleteEdgeMutationError('UnexpectedInput', null)
        }
        const successResult: GQLTypes.DeleteEdgeMutationSuccess = {
          __typename: 'DeleteEdgeMutationSuccess',
          edgeId: input.id,
        }
        return successResult
      },
      async deleteNode(_root, { input }, ctx /*,  _info */) {
        const node = gqlNodeId2GraphNodeIdentifier(input.id)
        if (!node) {
          return deleteNodeMutationError('UnexpectedInput')
        }
        if (!ctx.authSessionEnv) {
          return deleteNodeMutationError('NotAuthorized')
        }
        const deleteResult = await qmino.callSync(
          nodePorts.deleteNode({
            sessionEnv: ctx.authSessionEnv,
            node,
          }),
          { timeout: 5000 },
        )
        if (deleteResult === false) {
          return deleteNodeMutationError('UnexpectedInput', null)
        }
        const successResult: GQLTypes.DeleteNodeMutationSuccess = {
          __typename: 'DeleteNodeMutationSuccess',
          nodeId: input.id,
        }
        return successResult
      },
      async sendEmailToProfile(_root, { text, toProfileId }, ctx) {
        const toProfileIdentifier = gqlNodeId2GraphNodeIdentifierOfType(toProfileId, 'Profile')
        if (!(ctx.authSessionEnv?.user && toProfileIdentifier)) {
          return false
        }
        const sendResult = await qmino.callSync(
          utilPorts.sendEmailToProfile({ env: ctx.authSessionEnv, text, toProfileId: toProfileIdentifier }),
          { timeout: 5000 },
        )
        return sendResult
      },
    },
  }
}