import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const publicUser = user => ({ id: user.id, name: user.name, email: user.email, role: user.role });
const makeToken = user => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, valid email, and password (min. 8 characters) are required' });
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ where: { email: normalizedEmail } })) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12) });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: String(email || '').trim().toLowerCase() } });
    if (!user || !await bcrypt.compare(password || '', user.password)) return res.status(401).json({ message: 'Email or password is incorrect' });
    res.json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) { next(e); }
}
export async function me(req, res) { res.json({ user: req.user }); }
