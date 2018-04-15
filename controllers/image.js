const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'dd1dcf869adb4f97a84e54a66d3b3290'
});

const handleImage = (db) => (req, res) => {
	const { id, imageURL} = req.body;
	app.models.predict(Clarifai.DEMOGRAPHICS_MODEL, imageURL)
	.then(faceData => {
		let found = false;
		db('users')
			.returning('entries')
			.where('id', id)
			.increment('entries', 1)
			.then(entries => {
				const response = {
					faceData: faceData,
					entries: entries[0]
				}
				res.json(response);
			})
			.catch(err => res.status(400).json('Unable to read image or update entries.'))
	})
	.catch(res => 'Problem reading image.')
}

module.exports = {
	handleImage
}

