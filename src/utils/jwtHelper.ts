import jwt from "jsonwebtoken";

export function createToken(userId: string): string {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
  return `Bearer ${token}`;
}