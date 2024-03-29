import { Router, Request, Response, NextFunction } from 'express'
import { UserStore } from './store'
import { UserService } from './service'
import jwt from 'jsonwebtoken'
import { omit } from 'lodash'
import dotenv from 'dotenv'
import { z } from 'zod'
import cookie from 'cookie'

dotenv.config()

const router = Router({ mergeParams: true })
const store = new UserStore()
const userService = new UserService(store)

router.post('/login', handleLogin)
router.post('/register', handleRegister)
router.get('/me', authenticateToken, handleMe)

async function handleLogin(req: Request, res: Response) {
  try {
    const user = await userService.login(req.body.email, req.body.password)

    const accessToken = jwt.sign(
      omit(user, 'password'),
      process.env.ACCESS_TOKEN_SECRET as string,
    )

    // set the token in an HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('auth', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      }),
    )

    res.json({ ...user, accessToken })
  } catch (e) {
    res.status(400).send('Invalid credentials')
  }
}

async function handleRegister(req: Request, res: Response) {
  // validate request
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(3),
  })

  try {
    schema.parse(req.body)
  } catch (e) {
    return res.status(400).send('Invalid request')
  }

  try {
    const newUser = await userService.register(req.body)
    res.json(newUser)
  } catch (e) {
    console.error(e)
    res.status(500).send()
  }
}

async function handleMe(req: Request, res: Response) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.json((req as any).user)
}

// Middleware to authenticate JWT
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(req as any).user = user
    next()
  })
}

export { router as userRouter, authenticateToken }
