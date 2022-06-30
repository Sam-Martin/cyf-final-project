import { Router } from "express";
import passport from "passport";
import session from "express-session";

const router = Router();

const GitHubStrategy = require("passport-github2").Strategy


router.get("/", (_, res) => {
	res.json({ message: "Hello, world!" });
});

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET
const GITHUB_CALLBACK_URL = "http://localhost:3000/api/auth/github/callback" // or get from process.env.GITHUB_CALLBACK_URL


passport.serializeUser(function (user, done) {
	done(null, user)
})

passport.deserializeUser(function (obj, done) {
	done(null, obj)
})

passport.use(
	new GitHubStrategy(
		{
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			callbackURL: GITHUB_CALLBACK_URL
		},
		function (accessToken, refreshToken, profile, done) {
			// asynchronous verification, for effect...
			console.log({ accessToken, refreshToken, profile })
			return done(null, profile)
		}
	)
)
const pgSession = require('connect-pg-simple')(session);

router.use(
	session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
)
router.use(passport.initialize())
router.use(passport.session())


function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect("/login")
}

router.get("/secret", ensureAuthenticated, (req, res) => {
	res.send(`<h2>Hello ${req.user.displayName}</h2>`)
})

router.get(
	"/auth/github",
	passport.authenticate("github", { scope: ["user:email"] }), /// Note the scope here
	function (req, res) { }
)

router.get(
	"/auth/github/callback",
	// auth,
	passport.authenticate("github", { failureRedirect: "/login?error=failed"}),
	function (req, res) {
		console.log("Authenticated successfully")
		res.redirect("/api/secret")
	}
)

export default router;
