import { PkgExpose, PkgIdentifier } from '@moodlenet/core'
import { ComponentType, PropsWithChildren } from 'react'
import { WebPkgDeps } from '../../common/types.mjs'
import { LocateRpc } from '../web-lib/pri-http/xhr-adapter/callPkgApis.mjs'

export type ReactAppMainComponent = ComponentType<PropsWithChildren>

export type UsePkgHandle<TargetPkgExpose extends PkgExpose> = {
  pkgId: PkgIdentifier
  rpc: LocateRpc<TargetPkgExpose>
}
export type PkgContextT<
  UsesPkgDeps extends WebPkgDeps /* | Record<string, never>  */ = Record<string, never>,
> = {
  myId: PkgIdentifier
  use: {
    [key in keyof UsesPkgDeps]: UsePkgHandle<UsesPkgDeps[key]>
  }
}