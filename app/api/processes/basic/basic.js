const scripts = {
	doSomething: function(req, res){
		console.log('I did something')
		res.json({
			err: null,
			errMsg: null,
			result: 'I did something'
		})
	}
}

module.exports = {
	createDepart: scripts,
	
}