import { IscedField } from '@moodlenet/ed-meta/server'
import { sysEntitiesDB } from '@moodlenet/system-entities/server'
import { par } from '../types.mjs'
export default async function () {
  const dataCursor = await sysEntitiesDB.query<[name: string, code: string]>(
    `FOR f IN @@collection
FILTER f.published && LENGTH(f.codePath) == 3
RETURN [f.name,f._key]`,
    {
      '@collection': IscedField.collection.name,
    },
  )
  const data = await dataCursor.all()
  dataCursor.kill()

  const openaiSystem = [
    `you are a specialist in categorizing an educational resource by the most suitable isced-field code`,
    `use the following standard ${par('iscedFieldCode')} code-mapping:
${data.map(([name, code]) => `"${code}": "${name}"`).join('\n')}`,
  ]
  return {
    data,
    openaiSystem,
  }
}
