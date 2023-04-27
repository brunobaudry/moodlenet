import { EntityCollectionDef, registerEntities } from '@moodlenet/system-entities/server'
import { shell } from './shell.mjs'
import { IscedFieldDataType, IscedGradeDataType } from './types.mjs'

export const { IscedField, IscedGrade } = await shell.call(registerEntities)<{
  IscedField: EntityCollectionDef<IscedFieldDataType>
  IscedGrade: EntityCollectionDef<IscedGradeDataType>
}>({
  IscedField: {},
  IscedGrade: {},
})
// export const { IscedField } = await shell.call(registerEntities)<{
//   IscedField: EntityCollectionDef<IscedFieldDataType>
// }>({
//   IscedField: {},
// })
// export const { IscedGrade } = await shell.call(registerEntities)<{
//   IscedGrade: EntityCollectionDef<IscedGradeDataType>
// }>({
//   IscedGrade: {},
// })

console.log({ IscedField, IscedGrade })
