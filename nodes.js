const fs = require("fs")
const util = require("./util")

var lastIndexed = Date.now()

function indexNodes() {
	let mili = Date.now()

	if (mili - lastIndexed <= 1000) return;
	util.casualLog("Indexing Nodes...")

	let nodes = fs.readdirSync("private/includes/").filter(file => file.endsWith(".html"))

	for (var i = 0; i < nodes.length; i++) {
		let file = fs.readFileSync("private/includes/" + nodes[i])
		fs.writeFileSync("private/indexed/" + nodes[i], file)

		let nfile = fs.readFileSync("private/indexed/" + nodes[i])
		let ifile = util.parseNodes(nfile)

		fs.writeFileSync("private/indexed/" + nodes[i], ifile)
	}

	lastIndexed = mili
}

module.exports = {
	indexNodes: indexNodes
}