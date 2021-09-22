import { ComponentMeta, ComponentStory } from '@storybook/react'
import { CollectionCard } from '../../../cards/CollectionCard/CollectionCard'
import { CollectionCardStoryProps } from '../../../cards/CollectionCard/CollectionCard.stories'
import { ResourceCard } from '../../../cards/ResourceCard/ResourceCard'
import { ResourceCardStoryProps } from '../../../cards/ResourceCard/ResourceCard.stories'
import { SmallProfileCard } from '../../../cards/SmallProfileCard/SmallProfileCard'
import { SmallProfileCardLoggedInStoryProps } from '../../../cards/SmallProfileCard/SmallProfileCard.stories'
import SubjectCard from '../SubjectCard/SubjectCard'
import { SubjectCardStoryProps } from '../SubjectCard/SubjectCard.stories'
import { ListCard, ListCardProps } from './ListCard'
const meta: ComponentMeta<typeof ListCard> = {
  title: 'Components/Organisms/Cards/ListCard',
  component: ListCard,
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
  excludeStories: [
    'SubjectListCardStoryProps',
    'CollectionListCardStoryProps',
    'ResourceListCardStoryProps',
    'PeopleListCardStoryProps',
  ],
}

const ListCardStory: ComponentStory<typeof ListCard> = args => <ListCard {...args} />

export const SubjectListCardStoryProps: ListCardProps = {
  className: 'subjects',
  content: ['#Education', '#Forestry', 'Enviromental Science'].map(x => (
    <SubjectCard {...{ ...SubjectCardStoryProps, title: x }} />
  )),
  noCard: false,
}

export const Subject = ListCardStory.bind({})
Subject.args = SubjectListCardStoryProps
Subject.decorators = [
  Story => (
    <div style={{ maxWidth: 800 }}>
      <Story />
    </div>
  ),
]

export const CollectionListCardStoryProps: ListCardProps = {
  className: 'collections',
  title: 'Juanito',
  content: [1, 2, 3].map(() => <CollectionCard {...CollectionCardStoryProps} />),
}

export const Collection = ListCardStory.bind({})
Collection.args = CollectionListCardStoryProps
Collection.decorators = [
  Story => (
    <div style={{ width: 300 }}>
      <Story />
    </div>
  ),
]

export const ResourceListCardStoryProps: ListCardProps = {
  className: 'resources',
  title: 'Lastest Resources',
  content: [1, 2, 3].map(() => <ResourceCard {...ResourceCardStoryProps} />),
  noCard: true,
}

export const Resource = ListCardStory.bind({})
Resource.args = ResourceListCardStoryProps
Resource.decorators = [
  Story => (
    <div style={{ width: 450 }}>
      <Story />
    </div>
  ),
]

export const PeopleListCardStoryProps: ListCardProps = {
  className: 'people',
  content: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => <SmallProfileCard {...SmallProfileCardLoggedInStoryProps(0)} />),
  noCard: false,
  minGrid: 140,
}

export const People = ListCardStory.bind({})
People.args = PeopleListCardStoryProps
People.decorators = [
  Story => (
    <div style={{ width: '450' }}>
      <Story />
    </div>
  ),
]

export default meta