// Files

console.log("Importing files...")
const config = require("./config.js").config
const util = require("./util.js")
const route = require("./route.js").route
const nodes = require("./nodes.js")

util.casualLog("log tests")
util.log("log")
util.info("info")
util.warn("warn")
util.error("error")

// Startup

util.log("Starting [Officially Knifty]...")

// Modules

util.log("Importing modules...")
const axios = require("axios")
const http = require("http")
const url = require("url")

util.log("Indexing Nodes...")
nodes.indexNodes()

// HTTP server

const server = http.createServer((req, res) => {
	console.log(req.headers.cookie)

	// Access-Control-Allow-Origin

	if (req.headers.origin) {
		res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
	} else {
		res.setHeader("Access-Control-Allow-Origin", "*")
	}

	// Handle requests

	if (req.method == "GET") {
		// Route request

		route(url.parse(req.url).pathname, req.headers.cookie).then(result => {
			if (result != 404 && result[0] != 301) {
				// Content-Type

				if (!res.headersSent)
					res.setHeader("Content-Type", result[0])

				// Response

				res.writeHead(200)
				res.write(result[1])
				res.end()

				nodes.indexNodes()
			} else if (result[0] == 301) {
				// Redirect

				res.writeHead(301, {
					Location: result[1]
				})
				res.end()
			} else if (result == 404) {
				// 404

				util.read_file("public/errors/404.html").then(file => {
					res.writeHead(404)
					res.write(file)
					res.end()
				})
			} else {
				// Internal error

				util.read_file("public/errors/500.html").then(file => {
					res.writeHead(500)
					res.write(file)
					res.end()
				})

				util.error("ERROR: INVALID RESULT", true)
			}
		}).catch(error => {
			// Internal error

			util.read_file("public/errors/500.html").then(file => {
				res.writeHead(500)
				res.write(file)
				res.end()
			})

			util.error(error)
		})
	} else if (req.method == "POST") {
		// Check origin

		
	} else {
		// Invalid request type

		res.writeHead(400)
		res.write("ERROR: INVALID REQUEST TYPE")
		res.end()
	}
}).listen(config.port)

function check_origin(origin) {
	// Check request origin

	for (let o = 0; o < config.origins.length; o ++) {
		if (origin.startsWith(config.origins[o])) {
			return true
		}
	}

	return false
}

server.on("listening", function() {
	util.log(`HTTP server listening on port ${config.port}`)
})