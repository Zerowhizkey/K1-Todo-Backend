const fs = require("fs/promises");
const crypto = require("crypto");

const stringJson = (data) => {
	try {
		const json = JSON.stringify(data);
		return json;
	} catch (e) {
		return null;
	}
};

const parseJson = (json) => {
	try {
		const data = JSON.parse(json);
		return data;
	} catch (e) {
		return null;
	}
};

async function readJson(path) {
	const buffer = await fs.readFile(path);
	return JSON.parse(buffer.toString());
}

async function writeJson(path, data) {
	const json = JSON.stringify(data);
	await fs.writeFile(path, json);
}

function getId() {
	return crypto.randomBytes(6).toString("hex");
}

function sendJson(res, data, statusCode = 200) {
	res.writeHead(statusCode, {
		"Content-Type": "application/json",
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
	getId,
	stringJson,
	parseJson,
};
