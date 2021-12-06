import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const user = {
	id: 1,
	username: "nigel",
	firstName: "Nigel",
	lastName: "Richter",
	email: "nigel@gmail.com"
}

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
};

const decodeJwt = (token) => {
	let base64Url = token.split('.')[1];
	let base64 = base64Url.replace('-', '+').replace('_', '/');
	let decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
	return decodedData;
}

app.get('/', (req, res) => {
	res.json({
		message: "welcome to the api"
	});
});
app.post('/maintain-login', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			const data = decodeJwt(req.token);
			res.json({
				user: data.user
			});
		}
	});
});

app.post('/posts/create', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				message: 'Post created...',
				authData
			});
		}
	});
});

app.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if (username === 'nigel' && password === '123') {
		jwt.sign({ user }, 'secretkey', { expiresIn: '20s' }, (err, token) => {
			res.json({
				user,
				token
			});
		})
	} else {
		res.sendStatus(403);
	}
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`))