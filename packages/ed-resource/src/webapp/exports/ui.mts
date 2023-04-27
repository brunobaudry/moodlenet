// @index(['../components/**/!(*.stories|*Hooks|*Hook|*Container)*.{mts,tsx}'], f => `export * from '${f.path}${f.ext==='.tsx'?'.js':f.ext==='.mts'?'.mjs':f.ext}'`)
export * from '../components/molecules/ResourceContributorCard/ResourceContributorCard.js'
export * from '../components/organisms/Header/HeaderResource.js'
export * from '../components/organisms/lists/LandingResourceList/LandingResourceList.js'
export * from '../components/organisms/lists/ProfileResourceList/ProfileResourceList.js'
export * from '../components/organisms/lists/SearchResourceList/SearchResourceList.js'
export * from '../components/organisms/MainResourceCard/MainResourceCard.js'
export * from '../components/organisms/ResourceCard/ResourceCard.js'
export * from '../components/organisms/ResourceCard/story-props.js'
export * from '../components/organisms/UploadResource/UploadResource.js'
export * from '../components/pages/Resource/formResourceCollection.js'
export * from '../components/pages/Resource/Resource.js'
export * from '../components/pages/Resource/ResourcePageRoute.js'
// @endindex