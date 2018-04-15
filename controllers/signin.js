const handleSignin = (req, res, db, bcrypt) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('Incorrect form submission.')
	}
	const errResponse = 'Wrong email or password.';
	db.select('*')
		.from('users')
		.where('email', email)
		.then(creds => {
			if (creds.length) {
				bcrypt.compare(password, creds[0].hash)
					.then(isValid => {
						if (isValid) {
							const { id, name, entries, joined } = creds[0];
							const user = {
								id, name, email, entries, joined
							}
							res.json(user);
						} else {
							res.status(400).json(errResponse)
						}
					})
					.catch(err => res.status(400).json(errResponse));
			} else res.status(400).json(errResponse);
		})
		.catch(err => res.status(400).json(errResponse));
}

module.exports = {
	handleSignin
}