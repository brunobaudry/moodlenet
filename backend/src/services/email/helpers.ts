import { SendEmailProgress, SendEmailProgressOK } from './types'
import { v4 as uuidv4 } from 'uuid'

export const uuid: () => string = uuidv4
export const isResultOk = (_: SendEmailProgress): _ is SendEmailProgressOK => 'id' in _
