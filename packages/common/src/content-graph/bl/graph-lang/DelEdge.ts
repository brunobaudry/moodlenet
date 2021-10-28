import { Assumptions, BaseOperators } from '.'
import { EdgeType, NodeType } from '../../../graphql/types.graphql.gen'
import { SessionEnv } from '../../../types'
import { GraphEdgeIdentifier } from '../../types/edge'
import { GraphNodeIdentifier } from '../../types/node'
import { GraphOperators } from './graphOperators'

export type DelEdgeAssumptionsFactory = (_: {
  from: GraphNodeIdentifier
  edge: GraphEdgeIdentifier
  to: GraphNodeIdentifier
  sessionEnv: SessionEnv
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => Promise<Assumptions>

export type DelEdgeAssumptionsFactoryMap = Partial<
  Record<`${NodeType}_${EdgeType}_${NodeType}`, DelEdgeAssumptionsFactory>
>

export const getDelEdgeAssumptions = async ({
  edge,
  sessionEnv,
  from,
  map,
  to,
  baseOperators,
  graphOperators,
}: {
  from: GraphNodeIdentifier
  edge: GraphEdgeIdentifier
  to: GraphNodeIdentifier
  sessionEnv: SessionEnv
  map: DelEdgeAssumptionsFactoryMap
  graphOperators: GraphOperators
  baseOperators: BaseOperators
}) => {
  const assuptionsFactory = map[`${from._type}_${edge._type}_${to._type}`]
  if (!assuptionsFactory) {
    return undefined
  }
  return assuptionsFactory({ sessionEnv, from, edge, to, baseOperators, graphOperators })
}
