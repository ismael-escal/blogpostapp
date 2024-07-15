const jwt = require('jsonwebtoken');
const	secret = 'BlogPostAPI';

// [SECTION] JSON Web Token

// Token Creation
module.exports.createAccessToken = (user) => {

	// When the user logs in, a token will be created with the user's information
	const data = {
		id: user._id,
		userName: user.userName,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// the sign() method is used to generate a JSON web token/access token
	// it will generate a token with the user's information as the payload, secret code and no additional option (optional to put a time limit inside {})
	return jwt.sign(data, secret, {});
}

// Token Verification
module.exports.verify = (req, res, next) => {

	console.log(req.headers.authorization);

	// let token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2NiNzZkNWU5MmJmZjUwNTFlNmJlNSIsImVtYWlsIjoianNtaXRoQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxNTMzNTkzNn0.4mrMGeNdna0lJ069-AyBeWdJBlz9c7rTirVhuHsRBkM

	let token = req.headers.authorization;

	// if token has no value
	if(typeof token === 'undefined') {

		return res.status(200).send({ auth: 'Failed. No Token'});

	} else {

		console.log(token);
		token = token.slice(7, token.length); // sliced characters in token until index 7.
		// token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2NiNzZkNWU5MmJmZjUwNTFlNmJlNSIsImVtYWlsIjoianNtaXRoQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxNTMzNTkzNn0.4mrMGeNdna0lJ069-AyBeWdJBlz9c7rTirVhuHsRBkM

		console.log(token);

		// verify() method to decrypt the token
		jwt.verify(token, secret, function(err, decodedToken) {

			if(err){

				return res.status(403).send({
					auth: 'Failed',
					message: err.message
				})
			} else {

				/* this came from createAccessToken
					decodedToken =
						{
						  id: '663cb76d5e92bff5051e6be5',
						  email: 'jsmith@mail.com',
						  isAdmin: false,
						  iat: 1715335936
						}
				*/
				console.log('Result from verify method: ');
				console.log(decodedToken);
				req.user = decodedToken;

				/*
					req.user =
						{
						  id: '663cb76d5e92bff5051e6be5',
						  email: 'jsmith@mail.com',
						  isAdmin: false,
						  iat: 1715335936
						}
				*/

				next();	// allows us to move to next function.
			}
		})
	}
}

// Admin Verification
module.exports.verifyAdmin = (req, res, next) => {

	if (req.user.isAdmin) {

		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: 'Action Forbidden'
		})
	}
}

// Non-Admin Verification
module.exports.verifyNonAdmin = (req, res, next) => {

	if (!req.user.isAdmin) {

		next();
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: 'Admin is Forbidden'
		})
	}
}