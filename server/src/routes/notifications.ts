
import { Request, Response } from "express"
import webpush from "../helpers/webPush.js"

let pushSubscription

export const notification = async (req:Request, res: Response) => {
  try {
    const { pushSubscription, userId } = req.body
    
    res.status(200).json()

    const payload = JSON.stringify({
      title: 'UVMDev Notification',
      message: 'Subscrito al servicio'
    })

    webpush.sendNotification(pushSubscription, payload)
  } catch (error) {
    console.log(error)
  }
}