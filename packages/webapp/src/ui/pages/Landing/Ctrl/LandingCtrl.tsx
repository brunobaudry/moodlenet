import { isJust } from '@moodlenet/common/lib/utils/array'
import { useMemo } from 'react'
import { useGlobalSearchQuery } from '../../../../context/Global/GlobalSearch/globalSearch.gen'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { defaultOrganization } from '../../../lib/static-data'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { FollowTag } from '../../../types'
import { useSearchUrlQuery } from '../../Search/Ctrl/useSearchUrlQuery'
import { LandingProps } from '../Landing'

export const useLandingCtrl: CtrlHook<LandingProps, {}> = () => {
  const { setText: setSearchText } = useSearchUrlQuery()
  const trendingQ = useGlobalSearchQuery({
    variables: {
      sortBy: 'Popularity',
      nodeTypes: ['Collection', 'SubjectField'],
      text: '',
    },
  })
  const tags = useMemo(
    () =>
      trendingQ.data?.globalSearch.edges
        .map(edge =>
          edge.node.__typename === 'SubjectField' || edge.node.__typename === 'Collection' ? edge.node : null,
        )
        .filter(isJust)
        .map<FollowTag>(node => ({
          name: node.name,
          type: 'Specific',
        })),
    [trendingQ.data?.globalSearch.edges],
  )
  const landingProps = useMemo<LandingProps>(
    () => ({
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}),
      organization: defaultOrganization,
      image: `https://picsum.photos/${defaultOrganization.name}/moodle/200/100`,
      trendCardProps: { tags: tags || [] },
      setSearchText,
    }),
    [tags, setSearchText],
  )
  // console.log({ landingProps })
  return [landingProps]
}
