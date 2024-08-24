import { pubsub } from "../graphql/resolvers/index.js"

type wsPublishTypes = {
  subscriptionName: string
  payloadName: string
  id: string
  username: string
  message: string
  text?: string
}

export const wsPublish = async ({
  subscriptionName,
  id,
  username,
  message,
  text,
  payloadName
}: wsPublishTypes) => {
  pubsub.publish(subscriptionName, {
    [payloadName]: {
      id,
      text: `${username} ${message} ${text}`,
    }
  })
}