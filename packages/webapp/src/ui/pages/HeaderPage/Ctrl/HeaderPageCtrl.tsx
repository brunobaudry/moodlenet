import { isJust } from '@moodlenet/common/lib/utils/array'
import { useEffect, useMemo } from 'react'
import { useSession } from '../../../../context/Global/Session'
import { useHeaderCtrl } from '../../../components/Header/Ctrl/HeaderCtrl'
import { SubHeaderProps } from '../../../components/SubHeader/SubHeader'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { FollowTag } from '../../../types'
import { HeaderPageProps } from '../HeaderPage'
import { useHeaderPagePinnedLazyQuery } from './HeaderPageCtrl.gen'

export const useHeaderPageCtrl: CtrlHook<HeaderPageProps, {}> = () => {
  const { currentProfile } = useSession()
  const [queryPinned, pinned] = useHeaderPagePinnedLazyQuery()

  useEffect(() => {
    if (currentProfile) {
      queryPinned({ variables: { currentProfileId: currentProfile.id } })
    }
  }, [currentProfile, queryPinned])

  const subHeaderProps = useMemo<SubHeaderProps | null>(() => {
    const tags = pinned.data?.node?.pinnedList.edges
      .map(edge => (edge.node.__typename === 'SubjectField' ? edge.node : null))
      .filter(isJust)
      .map<FollowTag>(({ name }) => ({
        name,
        type: 'General',
      }))
    return tags
      ? {
          tags,
        }
      : null
  }, [pinned.data?.node?.pinnedList.edges])

  const headerPageProps = useMemo<HeaderPageProps>(() => {
    const headerPageProps: HeaderPageProps = {
      subHeaderProps,
      headerProps: ctrlHook(useHeaderCtrl, {}, 'Header'),
    }
    return headerPageProps
  }, [subHeaderProps])

  return [headerPageProps]
}
