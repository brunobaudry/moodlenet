import { IdKey, isNodeType } from '@moodlenet/common/lib/utils/content-graph'
import { createWriteStream, WriteStream } from 'fs'
import { join } from 'path'
import { EdgeType, NodeType } from '../../../ContentGraph.graphql.gen'
import { ShallowNode } from '../../../types.node'
import { GEN_DIR } from './env'

console.log(`bulk dir :${GEN_DIR}`)
const writers: { [type in NodeType | EdgeType]: WriteStream } = {} as any
const getOutFilename = (type: NodeType | EdgeType) => {
  const prefix = isNodeType(type) ? 'nodes' : 'edges'
  return join(GEN_DIR, `${prefix}_${type}`)
}
const getWriter = (type: NodeType | EdgeType) =>
  (writers[type] = writers[type] || createWriteStream(getOutFilename(type), { encoding: 'utf-8' }))

export const writeNode = (type: NodeType, node: WriteNode) =>
  new Promise<void>((res, rej) => {
    const writer = getWriter(type)
    const data = JSON.stringify(node) + '\n'
    writer.write(data, err => (err ? res() : rej(err)))
  })

export const finishWrite = () => {
  Object.keys(writers).map(type => {
    const writer = writers[type as NodeType]
    writer.close()
  })
}

type WriteNode = Omit<ShallowNode, 'id' | `_${string}`> & {
  _key: IdKey
  __typename: NodeType
}
