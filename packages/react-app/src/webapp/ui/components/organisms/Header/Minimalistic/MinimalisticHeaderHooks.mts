import { useMemo } from 'react'
import { href } from '../../../../../../common/lib.mjs'
import { useHeaderTitleProps } from '../../../atoms/HeaderTitle/HeaderTitleHooks.js'
import { MinimalisticHeaderProps } from './MinimalisticHeader.js'

export const useMinimalisticHeaderProps = (): MinimalisticHeaderProps => {
  const headerTitleProps = useHeaderTitleProps()
  const minimalisticHeaderProps = useMemo<MinimalisticHeaderProps>(() => {
    return {
      headerTitleProps,
      page: 'activation', //TODO //@BRU: ask to bru wich param
      //TODO //@ETTO: those access hrefs must be centralized in AuthCtx (present also in MainHeaderHooks)
      loginHref: href('/login'),
      signupHref: href('/signup'),
      centerItems: [], //TODO //@ETTO: needs a registry,,
      leftItems: [], //TODO //@ETTO: needs a registry,,
      rightItems: [], //TODO //@ETTO: needs a registry,,
    }
  }, [headerTitleProps])

  return minimalisticHeaderProps
}
