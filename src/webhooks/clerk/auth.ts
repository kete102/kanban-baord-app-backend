import {Webhook, WebhookRequiredHeaders} from 'svix'
import {CLERK_WEBHOOK_SECRET_KEY} from '../../config'
import {WebhookEvent} from '@clerk/clerk-sdk-node'
import {User} from '../../models/User'
import {Request, Response} from 'express'

export async function clerkWebhook(req: Request, res: Response) {
	try {
		const payloadString = req.body.toString()
		const svixHeaders = req.headers as unknown as WebhookRequiredHeaders

		const wh = new Webhook(CLERK_WEBHOOK_SECRET_KEY)
		const evt = wh.verify(payloadString, svixHeaders) as WebhookEvent
		const eventType = evt.type

		// Handle the webhooks
		//NOTE: New session
		if (eventType === 'session.created') {
			const {user_id} = evt.data
			console.log('New session: ', user_id)

			res.status(200).json({
				success: true,
				message: 'Webhook received',
			})
		}

		//NOTE: Close session
		if (eventType === 'session.removed') {
			const {user_id} = evt.data
			console.log('Session closed: ', user_id)

			res.status(200).json({
				success: true,
				message: 'Webhook received',
			})
		}

		//NOTE: Create user
		if (eventType === 'user.created') {
			try {
				const {email_addresses, id} = evt.data
				console.log(`User ${id} was ${eventType}`)

				const primaryEmail = email_addresses[0].email_address

				if (!primaryEmail) {
					console.log(`User ${id} has no primary email`)
					res.status(400).json({error: 'No primary email found'})
					return
				}

				const user = new User({
					clerkId: id,
					email: primaryEmail,
				})
				await user.save()

				res.status(200).json({
					success: true,
					message: `User ${id} saved in DB`,
				})
			} catch (error) {
				console.error('Error saving user in DB: ', error)
				res.status(400).json({error: 'Error saving user in DB'})
			}
		}
	} catch (error) {
		console.log('Webhook error: ', error)
		res.status(400).json({
			success: false,
			message: error,
		})
	}
}
