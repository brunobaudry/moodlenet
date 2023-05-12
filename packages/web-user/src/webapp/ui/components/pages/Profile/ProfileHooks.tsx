import { CollectionContext } from '@moodlenet/collection/webapp'
import { ResourceContext } from '@moodlenet/ed-resource/webapp'
import { href } from '@moodlenet/react-app/common'
import { useMainLayoutProps } from '@moodlenet/react-app/webapp'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileFormValidationSchema } from '../../../../../common/profile/data.mjs'
import type { Profile } from '../../../../../common/types.mjs'
import { AuthCtx } from '../../../../context/AuthContext.js'
import { MainContext } from '../../../../context/MainContext.mjs'
import type { ProfileProps } from './Profile.js'

const __should_be_from_server_maxUploadSize = 1024 * 1024 * 50

export const useProfileProps = ({
  profileKey,
}: {
  profileKey: string
}): ProfileProps | undefined => {
  const nav = useNavigate()
  const {
    use: { me },
  } = useContext(MainContext)
  const resourceCtx = useContext(ResourceContext)
  const collectionCtx = useContext(CollectionContext)

  const { isAuthenticated, clientSessionData } = useContext(AuthCtx)
  const [profileResponse, setProfileResponse] = useState<{
    data: Profile
    canEdit: boolean
    ownResources: { _key: string }[]
    ownCollections: { _key: string }[]
  }>()

  // const toggleFollow = useCallback<ProfileProps['actions']['toggleFollow']>(async () => {
  //   throw new Error('not Implemented')
  // }, [])
  const editProfile = useCallback<ProfileProps['actions']['editProfile']>(
    async values => {
      const { aboutMe, displayName, location, organizationName, siteUrl } = values

      const res = await me.rpc['webapp/profile/edit']({
        _key: profileKey,
        displayName,
        aboutMe,
        location,
        organizationName,
        siteUrl,
      })
      // if (!res) {
      //   return
      // }
      setProfileResponse(res)
    },
    [me.rpc, profileKey],
  )

  useEffect(() => {
    me.rpc['webapp/profile/get']({ _key: profileKey }).then(res => {
      if (!res) {
        return
      }
      setProfileResponse(res)
    })
  }, [me.rpc, profileKey])

  const mainLayoutProps = useMainLayoutProps()

  const profileProps = useMemo<ProfileProps | undefined>(() => {
    if (!profileResponse) {
      return
    }
    const isAdmin = !!clientSessionData?.isAdmin
    const isCreator = clientSessionData?.myProfile?._key === profileKey

    // KEY LISTS FROM SERVER
    profileResponse.ownCollections
    profileResponse.ownResources

    const props: ProfileProps = {
      mainLayoutProps,
      access: {
        canEdit: profileResponse.canEdit,
        isAdmin,
        isAuthenticated,
        isCreator,
        canPublish: false, //@ETTO Needs to be implemented
        canFollow: true, //@ETTO Needs to be implemented
        canBookmark: true, //@ETTO Needs to be implemented
      },
      data: {
        userId: '12sadsadsad', //@ETTO Needs to be implemented
        displayName: profileResponse.data.displayName, //@ETTO Needs to be implemented
        avatarUrl: profileResponse.data.avatarUrl,
        backgroundUrl: profileResponse.data.backgroundUrl,
        profileHref: href('/profile'), //@ETTO Needs to be implemented
      },
      state: {
        profileUrl: 'https://moodle.net/profile', //@ETTO Needs to be implemented
        followed: false, //@ETTO Needs to be implemented
        numFollowers: 13, //@ETTO Needs to be implemented
      },
      actions: {
        editProfile,
        toggleFollow: () => alert('Needs to be implemented'), //@ETTO Needs to be implemented
        setAvatar: (avatar: File | undefined | null) => {
          console.log('setAvatar', avatar)
          me.rpc['webapp/upload-profile-avatar/:_key']({ file: [avatar] }, { _key: profileKey })
        },
        setBackground: (background: File | undefined | null) => {
          console.log('setBackground', background)
          me.rpc['webapp/upload-profile-background/:_key'](
            { file: [background] },
            { _key: profileKey },
          )
        },
        sendMessage: (message: string) =>
          me.rpc['webapp/send-message-to-user/:profileKey']({ message }, { profileKey }),
      },
      mainProfileCardSlots: {
        mainColumnItems: [],
        topItems: [],
        footerItems: [],
        subtitleItems: [],
        titleItems: [],
      },
      createCollection: () =>
        collectionCtx.createCollection().then(({ homePath }) => nav(homePath)),
      createResource: () => resourceCtx.createResource().then(({ homePath }) => nav(homePath)),
      resourceCardPropsList: [], //@ETTO Needs to be implemented - get it from server
      collectionCardPropsList: [], //@ETTO Needs to be implemented - get it from server
      mainColumnItems: [], //@ETTO Needs to be implemented - create registry for it
      sideColumnItems: [], //@ETTO Needs to be implemented - create registry for it
      overallCardItems: [],
      profileForm: profileResponse.data,
      // state: {
      //   followed: false,
      // },
      validationSchema: profileFormValidationSchema(__should_be_from_server_maxUploadSize), // FIXME
    }
    return props
  }, [
    clientSessionData?.isAdmin,
    clientSessionData?.myProfile?._key,
    collectionCtx,
    editProfile,
    isAuthenticated,
    mainLayoutProps,
    nav,
    profileKey,
    profileResponse,
    me.rpc,
    // toggleFollow,
    resourceCtx,
  ])
  return profileProps
}
