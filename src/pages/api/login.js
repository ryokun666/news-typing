import session from "express-session";

const sessionMiddleware = session({
  secret: "aiueo",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
});

export default function handler(req, res) {
  // Apply the session middleware
  sessionMiddleware(req, res, async () => {
    if (req.method === "POST") {
      const { username } = req.body;
      req.session.username = username;
      res.status(200).json({ message: "Logged in" });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  });
}
