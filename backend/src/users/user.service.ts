import bcrypt from "bcryptjs";
import { User } from "./user.schema";

export async function createUser(
  email: string,
  password: string,
  role = "user"
) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, role });
  return user.save();
}

export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}

export async function validateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}
