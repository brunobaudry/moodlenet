import { Href } from '@moodlenet/react-app/common'
import { Link } from '@moodlenet/react-app/ui'
import { ExitToApp } from '@mui/icons-material'
import { FC } from 'react'
import defaultAvatar from '../../../assets/img/default-avatar.svg'

export const SettingsLinkAvatarMenuComponent: FC<{ settingsHref: Href }> = ({ settingsHref }) => {
  return <Link href={settingsHref}>Settings</Link>
}

export const ProfileLinkAvatarMenuComponent: FC<{
  profileHref: Href
  avatarUrl: string | undefined
}> = ({ profileHref, avatarUrl = defaultAvatar }) => {
  return (
    <Link href={profileHref} className="avatar">
      <div
        style={{
          backgroundImage: 'url("' + avatarUrl + '")',
          backgroundSize: 'cover',
          borderRadius: '50%',
          height: '28px',
          width: '28px',
        }}
      />
      Profile
    </Link>
  )
}

export const SignoutAvatarMenuComponent: FC<{ signout(): void }> = ({ signout }) => {
  return (
    <span onClick={signout}>
      <ExitToApp /> Signout
    </span>
  )
}