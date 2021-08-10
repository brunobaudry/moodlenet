import { GraphNodeIdentifierSlug, GraphNodeType } from '@moodlenet/common/lib/content-graph/types/node'
import { aq } from '../../../../lib/helpers/arango/query'
import { AqlGraphNodeByType } from '../types'
import { documentByNodeIdSlug } from './helpers'
export const getNodeBySlugQ = <Type extends GraphNodeType = GraphNodeType>(slugId: GraphNodeIdentifierSlug) => {
  const q = aq<AqlGraphNodeByType<Type>>(`
    let node = ${documentByNodeIdSlug(slugId)}

    return node
  `)
  return q
}
