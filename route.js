// Files and modules

const util = require("./util.js")
const fs = require("fs")

// Routing

function route(path, cookies) {
	return new Promise((resolve, reject) => {
		// Home page

		if (path == "/" || path == "/~") {
			util.read_file("public/pages/home.html").then(home => {
				resolve(["text/html", util.parseNodes(home, cookies)])
			}).catch(error => {
				reject(error)
			})
		}

		// Files

		else if (path.startsWith("/public")) {
			// Find file

			path = path.substr(1)
			if (fs.existsSync(path) && fs.lstatSync(path).isFile()) {
				// File
				
				util.read_file(path).then(file => {
					if (path.includes("/images")) {
						resolve(["image", file])
					} else if (path.includes("/pages")) {} else {
						const ext = path.split(".")[path.split(".").length - 1]
						if (ext == "html") {
							resolve(["text/plain", file])
						} else {
							resolve([`text/${ext}`, file.toString()])
						}
					}
				}).catch(error => {
					reject(error)
				})
			} else {
				// Not found

				resolve(404)
			}
		}

		// Favicon

		else if (path == "/favicon.svg" || path == "/favicon.png") {
			util.read_file("public/images/favicon" + path).then(file => {
				resolve(["image", file])
			})
		}

		// Manifest

		else if (path == "/manifest.json") {
			util.read_file("public/meta/manifest.json").then(file => {
				resolve(["application/json", JSON.stringify(file)])
			})
		}

		// Service Worker

		else if (path == "/sw.js") {
			util.read_file("sw.js").then(file => {
				resolve(["text/js"], file)
			})
		}

		// Not found

		else {
			try {
				var pages = fs.readdirSync("public/pages").filter(file => file.endsWith('.html')).filter(file => '/' + file == path + '.html')
				if (pages.length < 1) return resolve(404)

				util.read_file("public/pages/" + pages[0]).then(page => {
					resolve(["text/html", util.parseNodes(page, cookies)])
				})
			} catch {
				resolve(404)
			}
		}
	})
}

// Exports

module.exports = {
	route: route
}