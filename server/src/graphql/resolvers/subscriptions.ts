import { SUBSCRIPTIONS_EVENTS } from '../../lib/constant.js';
import { pubsub } from './index.js';

export const newFollower = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.NEW_FOLLOWER])
}

export const postCreated = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.POST_CREATED])
}

export const postEdited = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.POST_EDITED])
}

export const postDeleted = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.POST_DELETED])
}

export const postCommented = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.POST_COMMENTED])
}

export const postRated = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.POST_RATED])
}

export const postSaved = {
  subscribe: () => pubsub.asyncIterator([SUBSCRIPTIONS_EVENTS.POST_SAVED])
}