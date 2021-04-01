const handlebars = require("handlebars")
const fs = require("fs")

const indexHtml = fs.readFileSync('./views/index.html', "utf8");
const template = handlebars.compile(indexHtml)

module.exports = {
	

}
