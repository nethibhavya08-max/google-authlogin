import { Router } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User";

const router = Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 🔐 Google login
router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload?.email });

    if (!user) {
      user = await User.create({
        name: payload?.name,
        email: payload?.email,
        picture: payload?.picture,
      });
    }
const accessToken = jwt.sign(
  {
    id: user._id,
    name: user.name,
    email: user.email,
    picture: user.picture,
    role: user.role,
  },
  process.env.JWT_SECRET!,
  { expiresIn: "15m" }
);

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    user.accessToken = accessToken;
    await user.save();

    res.json({ accessToken, refreshToken, user });
  } catch {
    res.status(401).json({ message: "Auth failed" });
  }
});

// 🔄 Refresh
router.post("/Access", async (req, res) => {
  const { accessToken } = req.body;

  const user = await User.findOne({ accessToken });
  if (!user) return res.sendStatus(403);

  const newrefreshToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  res.json({ refreshToken: newrefreshToken });
});

export default router;