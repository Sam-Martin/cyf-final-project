import { response, Router } from "express";
import passport from "passport";
import session from "express-session";
import { pool } from './db';
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = Router();

const GitHubStrategy = require("passport-github2").Strategy
const fs = require('fs');


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

router.post("/upload", ensureAuthenticated, upload.single("pic1"), (req, res) => {
	const filetypes = /jpeg|jpg|png|gif/;
	const mimetype = filetypes.test(req.file.mimetype);
	console.log(`${mimetype}: ${req.file.mimetype}`)
	if (!mimetype) {
		res.status(403).send(`{"error": "Bad file type, expected one of ${filetypes}, got ${req.file.mimetype}"}`)

		return
	}
	const contents = fs.readFileSync(req.file.path, { encoding: 'base64' });
	console.log('file data', req.file);
	console.log('file data', contents)
	pool.query(
		"INSERT INTO images(uploader, contents, mimetype,  dateadded ) VALUES ($1, $2, $3, $4)  RETURNING id", 
		['sam', contents, req.file.mimetype, '1'],
		(err, result) => {
			console.log(err, result);
			console.log(`Row IDL ${result.rows[0].id}`);
			res.send(`{"imageId": ${result.rows[0].id}}`)
		}
	);
	// res.sendStatus(200);
})

router.get("/image/:imageId", (req, res) => {
	pool.query(
		"SELECT contents, mimeType FROM images WHERE id = $1", [req.params.imageId],
		(err, result) => {
			var img = Buffer.from(result.rows[0].contents, 'base64');
			res.writeHead(200, {
				'Content-Type': result.rows[0].mimetype,
				'Content-Length': img.length
			  });
			res.end(img);
		}
	);
	
})

router.get("/auth/validate", (req, res) => {
	if (req.isAuthenticated()) {
		res.send(`{"authenticated":true}`)
	}
	res.send(`{"authenticated":false}`)
})

router.get(
	"/auth/github",
	passport.authenticate("github", { scope: ["user:email"] }), /// Note the scope here
	function (req, res) { }
)

router.get(
	"/auth/github/callback",
	// auth,
	passport.authenticate("github", { failureRedirect: "/login?error=failed" }),
	function (req, res) {
		console.log("Authenticated successfully")
		res.redirect("/upload")
	}
)

export default router;
