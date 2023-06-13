import session from "express-session";

const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
});

export default function handler(req, res) {
  sessionMiddleware(req, res, () => {
    if (req.method === "GET") {
      res.status(200).json({ username: req.session.username });
    } else {
      res.status(405).end(); // Method Not Allowed
    }
  });
}
