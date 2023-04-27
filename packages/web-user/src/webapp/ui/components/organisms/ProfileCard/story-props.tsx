import {
  getRandomSortedArrayElements,
  peopleFactory,
  PeopleFactory,
} from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { OverallCardStories } from '@moodlenet/react-app/stories'
import { action } from '@storybook/addon-actions'
import { PartialDeep } from 'type-fest'
import { ProfileCardProps } from './ProfileCard.js'

export const getProfileCardFactory = (
  profileFactory?: PeopleFactory,
  overrides?: PartialDeep<ProfileCardProps>,
): ProfileCardProps => {
  const profile = profileFactory ?? peopleFactory[Math.floor(Math.random() * peopleFactory.length)]
  return overrideDeep<ProfileCardProps>(
    {
      mainColumnItems: [],
      overallCardProps: OverallCardStories.OverallCardNoCardStoryProps,
      data: {
        userId: 'saddsadsa-21321312',
        backgroundUrl: profile?.backgroundUrl ?? null,
        avatarUrl: profile?.avatarUrl ?? null,
        profileHref: href('Pages/Profile/Logged In'),
        displayName: profile?.displayName ?? '',
        organizationName: profile?.organization ?? '',
        username: profile?.username ?? '',
      },
      state: {
        profileUrl: 'https://moodle.net/profile',
        // followed: false,
      },
      actions: {
        editProfile: action('edit profile'),
        sendMessage: action('send message'),
        // toggleFollow: action('toogleFollow'),
      },
      access: {
        isAdmin: false,
        canEdit: false,
        isCreator: false,
        isAuthenticated: false,
      },
    },
    { ...overrides },
  )
}

export const getProfileCardsStoryProps = (
  amount = 8,
  overrides?: PartialDeep<ProfileCardProps>,
): ProfileCardProps[] => {
  return getRandomSortedArrayElements(
    peopleFactory.map(profile => getProfileCardFactory(profile)),
    amount,
  ).map(profile => {
    return overrideDeep<ProfileCardProps>(profile, { ...overrides })
  })
}