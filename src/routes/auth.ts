import {Router} from 'express'
import {User} from '../models/User'
import {checkIfUserInDb} from '../helpers/checkIfUserInDb'

export const authRoutes = Router()

authRoutes.get('/', async (req, res, next) => {
	const {userId} = req.auth

	console.log(userId)
	//TODO: Aqui va la logica de guardar en el base de datos al usuario
	// Comprobar si ya esta en la base de datos. Si no lo esta guardarlo
	// Siempre devolviendo su clerkId
	const existsUser = await checkIfUserInDb({userId})
	if (!existsUser) {
		const newUser = new User({
			clerkId: userId,
		})
		console.log({user: newUser})
		newUser.save()
		res.status(201).json({user: newUser})
	} else {
		res.status(200).json({user: existsUser})
	}
	next()
})
