const fs = require("fs/promises");

async function readJson(path) {
	try {
		const buffer = await fs.readFile(path);
		return JSON.parse(buffer.toString());
	} catch (error) {
		throw error;
	}
}

async function writeJson(path, data) {
	try {
		const json = JSON.stringify(data);
		await fs.writeFile(path, json);
	} catch (error) {
		throw error;
	}
}

async function deleteJson(path, data) {
	try {
		await fs.unlink(path, data);
		console.log(`Deleted ${path}`);
	} catch (error) {
		console.error(
			`Got an error trying to delete the file: ${error.message}`
		);
	}
}

function sendJson(res, data) {
	res.writeHead(200, {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	});
	res.end(JSON.stringify(data));
}

function sendCode(res, code = 500) {
	res.statusCode = code;
	res.end();
}

module.exports = {
	readJson,
	writeJson,
	sendJson,
	sendCode,
	deleteJson,
};
