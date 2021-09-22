import { nodeSlugId } from '@moodlenet/common/lib/utils/content-graph/id-key-type-guards'
import { Routes } from '@moodlenet/common/lib/webapp/sitemap'
import { getContentNodeHomePageRoutePath } from '@moodlenet/common/lib/webapp/sitemap/helpers'
import { ctrlHook } from '../ui/lib/ctrl'
import { useResourceCtrl } from '../ui/pages/Resource/Ctrl/ResourcePageCtrl'
import { Resource } from '../ui/pages/Resource/Resource'
import { MNRouteProps, RouteFC } from './lib'

export const ResourceRouteComponent: RouteFC<Routes.ContentNodeHomePage> = ({
  match: {
    params: { slug },
  },
}) => {
  const id = nodeSlugId('Resource', slug)
  const props = ctrlHook(useResourceCtrl, { id }, `route-${id}`)
  return <Resource {...props} />
}

export const ResourceRoute: MNRouteProps<Routes.ContentNodeHomePage> = {
  component: ResourceRouteComponent,
  path: getContentNodeHomePageRoutePath('Resource'),
  exact: true,
}