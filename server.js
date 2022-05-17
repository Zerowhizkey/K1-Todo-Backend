const fs = require("fs/promises");

const http = require("http");
const port = 5000;

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

async function sendTodos(req, res, id = null) {
	const todos = await readJson("todos.json");
	switch (req.method) {
		case "POST":
			req.on("data", (chunk) => {
				const data = JSON.parse(chunk.toString());
				data.id = todos.length + 1;
				todos.push(data);
			});
			req.on("end", async () => {
				await writeJson("todos.json", todos);
				sendCode(res, 201);
			});
			break;
		default:
			if (!id) {
				sendJson(res, todos);
				return;
			}
			const item = todos.find((item) => parseInt(id) === item.id);
			if (!item) {
				sendCode(res, 404);
			} else {
				sendJson(res, item);
			}
			break;
	}
}

const server = http.createServer((req, res) => {
	const [endPoint, id] = req.url.split("/").filter((item) => item.length > 0);

	console.log(`${req.method} till url: ${req.url}`);

	if (endPoint === "todos") {
		sendTodos(req, res, id);
	} else {
		sendCode(res, 404);
	}
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
