const {
	readJson,
	writeJson,
	sendJson,
	sendCode,
	deleteJson,
} = require("./utils");

const http = require("http");
const port = 5000;

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
		case "DELETE":
			deleteJson("todos.json", todos.id);

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
