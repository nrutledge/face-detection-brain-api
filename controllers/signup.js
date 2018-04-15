const handleSignup = (req, res, db, bcrypt) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res.status(400).json('Incorrect form submission.')
	}
	const saltRounds = 10;

	bcrypt.genSalt(saltRounds, function(err, salt) {
	    bcrypt.hash(password, salt, function(err, hash) {
			db('users')
				.returning(['id', 'name', 'email', 'entries', 'joined'])
				.insert({
					name: name,
					email: email,
					hash: hash
				})
				.then(user => res.json(user[0]))
				.catch(err => res.status(400).json('Unable to register'));		
			}
		)
	});
};

module.exports = {
	handleSignup: handleSignup
}