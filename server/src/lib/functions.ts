import { pubsub } from "../graphql/resolvers/index.js"
import webpush from "../helpers/webPush.js"

type wsPublishTypes = {
  subscriptionName: string
  payloadName: string
  id: string
  username: string
  message: string
  link: string
  text?: string
}

export const wsPublish = async ({
  subscriptionName,
  id,
  username,
  message,
  text,
  payloadName,
  link
}: wsPublishTypes) => {
  const textFormated = text ? `${username} ${message} ${text}` : `${username} ${message}`
  
  const payload = JSON.stringify({
    title: 'UVMDev Notification',
    message: textFormated,
    url: link
  })

  // webpush.sendNotification(pushSubscription, payload)
  pubsub.publish(subscriptionName, {
    [payloadName]: {
      id,
      text: textFormated,
      link
    }
  })
}