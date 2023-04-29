import {
  CollectionCardAccess,
  CollectionCardActions,
  CollectionCardData,
  CollectionCardState,
} from '@moodlenet/collection/common'
import { CollectionCard, CollectionCardProps } from '@moodlenet/collection/ui'
import { ContentBackupImages } from '@moodlenet/component-library'
import { overrideDeep } from '@moodlenet/component-library/common'
import { href } from '@moodlenet/react-app/common'
import { SmallFollowButton } from '@moodlenet/web-user/ui'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { PartialDeep } from 'type-fest'

const meta: ComponentMeta<typeof CollectionCard> = {
  title: 'Molecules/CollectionCard',
  component: CollectionCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'CollectionCardStoryProps',
    'CollectionCardLoggedInStoryProps',
    'CollectionCardLoggedOutStoryProps',
    'CollectionCardfollowedStoryProps',
    'CollectionCardBookmarkedStoryProps',
    'CollectionCardOwnerStoryProps',
    'CollectionCardOwnerPrivateStoryProps',
  ],
  decorators: [
    Story => (
      <div style={{ height: 100, width: 300 }}>
        <Story />
      </div>
    ),
  ],
}

export const getCollectionCardStoryProps = (
  overrides?: PartialDeep<CollectionCardProps>,
): CollectionCardProps => {
  const data: CollectionCardData = {
    collectionId: `${Math.floor(Math.random() * ContentBackupImages.length)}`,
    title: 'Such a great collection',
    imageUrl: 'https://picsum.photos/300/200',
    collectionHref: href('Pages/Collection/Logged In'),
  }

  const state: CollectionCardState = {
    numResources: 5,
    isPublished: true,
    numFollowers: 32,
    followed: false,
    ...overrides?.state,
    // bookmarked: false,
  }

  const actions: CollectionCardActions = {
    publish: action('publish resource'),
    unpublish: action('unpublish resource'),
    toggleFollow: linkTo('Molecules/CollectionCard', 'followed'),
    // toggleBookmark: linkTo('Molecules/CollectionCard', 'Bookmarked'),
  }

  const access: CollectionCardAccess = {
    isCreator: false,
    canPublish: true,
    canFollow: true,
    isAuthenticated: true,
    ...overrides?.access,
  }

  const isPublished =
    overrides?.state?.isPublished !== undefined ? overrides?.state?.isPublished : true

  const slots: Pick<CollectionCardProps, 'mainColumnItems' | 'topLeftItems' | 'topRightItems'> = {
    topLeftItems: [],
    topRightItems: [
      isPublished
        ? {
            Item: () => (
              <SmallFollowButton
                canFollow={access.canFollow}
                followed={state.followed}
                isAuthenticated={access.isAuthenticated}
                isCreator={access.isCreator}
                toggleFollow={actions.toggleFollow}
                numFollowers={state.numFollowers}
              />
            ),
            key: 'follow-button',
          }
        : null,
    ],
    mainColumnItems: [],
  }

  return overrideDeep<CollectionCardProps>(
    {
      ...slots,
      data: data,
      state: state,
      actions: actions,
      access: access,
    },
    overrides,
  )
}

export const CollectionCardLoggedInStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps(),
}

export const CollectionCardfollowedStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    state: {
      // followed: true,
    },
    actions: {
      // toggleFollow: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
    },
  }),
}

export const CollectionCardBookmarkedStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    state: {
      // bookmarked: true,
    },
    actions: {
      // toggleBookmark: linkTo('Molecules/CollectionCard', 'LoggedIn'), // Strangely not working}
    },
  }),
}

export const CollectionCardLoggedOutStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    data: {
      collectionHref: href('Pages/Collection/Logged Out'),
    },
    state: {},
    actions: {},
    access: {},
  }),
}

export const CollectionCardOwnerStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardLoggedInStoryProps,
    data: {
      collectionHref: href('Pages/Collection/Owner'),
    },
    state: {
      isPublished: true,
      // followed: true,
    },
    actions: {},
    access: {
      isCreator: true,
    },
  }),
}

export const CollectionCardOwnerPrivateStoryProps: CollectionCardProps = {
  ...getCollectionCardStoryProps({
    ...CollectionCardOwnerStoryProps,
    data: {},
    state: {
      isPublished: false,
    },
    actions: {},
    access: {},
  }),
}

const CollectionCardStory: ComponentStory<typeof CollectionCard> = args => (
  <CollectionCard {...args} />
)

export const LoggedIn = CollectionCardStory.bind({})
LoggedIn.args = CollectionCardLoggedInStoryProps

export const followed = CollectionCardStory.bind({})
followed.args = CollectionCardfollowedStoryProps

export const Bookmarked = CollectionCardStory.bind({})
Bookmarked.args = CollectionCardBookmarkedStoryProps

export const LoggedOut = CollectionCardStory.bind({})
LoggedOut.args = CollectionCardLoggedOutStoryProps

export const Owner = CollectionCardStory.bind({})
Owner.args = CollectionCardOwnerStoryProps

export const Public = CollectionCardStory.bind({})
Public.args = CollectionCardOwnerStoryProps

export const Private = CollectionCardStory.bind({})
Private.args = CollectionCardOwnerPrivateStoryProps

export default meta