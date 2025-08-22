import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { createUser, validateUser, findUserByEmail } from "./user.service";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  const exists = await findUserByEmail(email);
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = await createUser(email, password);

  // Return user data with token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    token,
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await validateUser(email, password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    user: {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    token,
  });
}
