const fs = require("fs/promises");
const crypto = require("crypto");

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

// const VALID_METHODS = {
// 	withId: ["OPTIONS", "GET", "PUT", "PATCH", "DELETE"],
// 	withoutId: ["OPTIONS", "GET", "POST"],
// };
// function validateReq(req) {
// 	const hasId = /^(\/todos\/\d+)\/?$/.test(req.url);
// 	const hasNoId = /^(\/todos)\/?$/.test(req.url);
// 	if (hasId)
// 		return {
// 			urlIsValid: true,
// 			methodIsValid: VALID_METHODS.withId.includes(req.method),
// 			reqId: Number(req.url.match(/\d+/g)[0]),
// 		};
// 	else if (hasNoId)
// 		return {
// 			urlIsValid: true,
// 			methodIsValid: VALID_METHODS.withoutId.includes(req.method),
// 			reqId: null,
// 		};
// 	return {
// 		urlIsValid: false,
// 		methodIsValid: false,
// 		reqId: null,
// 	};
// }

module.exports = {
	readJson,
	writeJson,
	sendJson,
	sendCode,
	getId,
};
