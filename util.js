// Modules

const fs = require("fs")
const callerID = require("caller-id")
const path = require("path")

// Utility functions

function casualLog(message) {
	var caller = callerID.getData()
	console.log(generateLogMessages(message, caller, -1))
}

function log(message, level = 0) {
	var caller = callerID.getData()
	console.log(generateLogMessages(message, caller, level))
}

function info(message, level = 1) {
	var caller = callerID.getData()
	console.info(generateLogMessages(message, caller, level))
}

function warn(message) {
	var caller = callerID.getData()
	console.warn(generateLogMessages(message, caller, 2))
}

function error(error) {
	var caller = callerID.getData()
	console.error(generateLogMessages(error, caller, 3))
}

function generateLogMessages(message, caller, level = 0) {
	const time = get_time()
	const date = time[0]
	const utc_time = time[1]
	const pt_time = time[2]

	// Construct error message
	
	var funcName = caller.functionName
	if (funcName == null)
		funcName = "[global scope or callback]"
	
	var data = `${date} ${utc_time} UTC ${pt_time} PT | ${message} `
	var color = '\x1b[36m'
	
	switch (level) {
		case 3:
			color = '\x1b[31m';
			data += `| run by "${funcName}" in file "${caller.filePath}" on line ${caller.lineNumber}`;
			break;
		case 2:
			color = '\x1b[33m';
			data += `| run by "${funcName}" in file "${formatAbsPath(caller.filePath)}"`;
			break;
		case 1:
			color = '\x1b[32m';
			data += `| run by file "${formatAbsPath(caller.filePath)}"`;
			break;
		case 0:
			break;
		default:
			color = '\x1b[0m'
			data = `${message}`;
			break;
	}
	
	return color + data + '\x1b[0m'
}

function formatAbsPath(Path) {
	return path.relative("E:/Programming/node js/officially knifty/", Path)
}

function parseNodes(file, cookies) {

	var sFile = file.toString()
	var elems = sFile.split("<")

	for (let i = 0; i < elems.length; i++) {
		elems[i] = getHTMLFromNodeName(elems[i], cookies)
	}

	var sFile = elems.join("<")

	return Buffer.from(sFile, "utf-8")
}

function getHTMLFromNodeName(elem, cookies) {
	if (elem.charAt(0).match(/[^A-Z]/)) return elem
	var nName = elem.split(">")[0]
	
	if (!(fs.existsSync("private/indexed/" + nName + ".html") || fs.existsSync("private/jsIncludes/" + nName + ".js"))) return elem
	var path = "private/indexed/" + nName + ".html"
	
	while (elem.charAt(elem.length - 1) != ">")
		elem = elem.slice(0, -1)
	
	var ending = ""
	if (elem.endsWith("-->"))
		ending += "-->"
	
	if (fs.existsSync("private/jsIncludes/" + nName + ".js") && nName.startsWith("JS")) return parseJSNode(nName, cookies) + ending
	
	var nfile = fs.readFileSync(path)
	
	return nfile.toString().substring(1) + ending
}

function parseJSNode(nodeName, cookie) {
	let node = require("./private/jsIncludes/" + nodeName + ".js")
	let cs = cookie.split("; ")
	let cookies = { unNamed: [] }
	cs.forEach(function(c) {
		// n is name, d is data, s is split
		// data defaults to current because cookies can contain values without a name
		let n = "", d = c, s = c.split("=")
		if (s.length > 1) {
			n = s.shift()
			d = s.join("=")
		}
		if (n != "" && n != "unNamed")
			cookies[n] = d
		else
			cookies.unNamed.append(d)
	})
	return node.generateHTML({ cookies: cookies })
}

function get_time() {
	// Constructor

	const d = new Date()

	// Date

	const year = d.getUTCFullYear()
	let month = (d.getUTCMonth() + 1).toString()
	let day = d.getUTCDate().toString()

	if (month.length == 1) {
		month = "0" + month
	}
	if (day.length == 1) {
		day = "0" + day
	}

	const date = `${year}-${month}-${day}`

	// Calculate time

	let utc_hours = d.getUTCHours()
	let pt_hours
	let prev_day = false
	if (utc_hours < 7) {
		prev_day = true
		pt_hours = 17 + utc_hours
	} else {
		pt_hours = utc_hours - 7
	}

	pt_hours = pt_hours.toString()
	if (pt_hours.length == 1) {
		pt_hours = "0" + pt_hours
	}

	utc_hours = utc_hours.toString()
	if (utc_hours.length == 1) {
		utc_hours = "0" + utc_hours
	}

	let minutes = d.getUTCMinutes().toString()
	if (minutes.length == 1) {
		minutes = "0" + minutes
	}

	let seconds = d.getUTCSeconds().toString()
	if (seconds.length == 1) {
		seconds = "0" + seconds
	}

	const utc_time = `${utc_hours}:${minutes}:${seconds}`
	let pt_time
	if (prev_day == false) {
		pt_time = `${pt_hours}:${minutes}:${seconds}`
	} else {
		pt_time = `[${pt_hours}:${minutes}:${seconds}]`
	}

	return [date, utc_time, pt_time]
}

function read_file(path) {
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(path)) return reject("file does not exist")

		// Read file

		fs.readFile(path, (error, data) => {
			// Error

			if (error) {
				reject(error)
				console.error(error)
				return
			}

			// File data

			if (path.endsWith(".json")) {
				resolve(JSON.parse(data))
			} else {
				resolve(data)
			}
		})
	})
}

// Exports

module.exports = {
	casualLog            :    casualLog,
	log                  :    log,
	info                 :    info,
	warn                 :    warn,
	error                :    error,
	read_file            :    read_file,
	parseNodes           :    parseNodes,
	generateLogMessages  :    generateLogMessages
}