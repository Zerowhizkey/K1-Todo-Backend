const http = require("http");
const port = 5000;
const { readJson, writeJson, sendJson, sendCode, getId } = require("./utils");

async function sendTodos(req, res, id = null) {
	let todos = await readJson("todos.json");
	switch (req.method) {
		case "POST":
			req.on("data", (chunk) => {
				const data = JSON.parse(chunk.toString());
				data.id = getId();
				todos.push(data);
			});
			req.on("end", async () => {
				await writeJson("todos.json", todos);

				sendCode(res, 201);
			});
			break;
		case "DELETE":
			todos = todos.filter((todo) => todo.id !== id);
			writeJson("todos.json", todos).then(() => sendCode(res, 200));
			break;
		case "GET":
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

		case "PUT":
			req.on("data", (chunk) => {
				const data = JSON.parse(chunk.toString());
				const index = todos.findIndex((todo) => todo.id === id);

				if (data.text && typeof data.isCompleted === "boolean") {
					todos[index] = {
						isCompleted: data.isCompleted,
						text: data.text,
						id: todos[index].id,
					};
					writeJson("todos.json", todos).then(() =>
						sendCode(res, 200)
					);
				}
			});
			break;

		case "PATCH":
			req.on("data", (chunk) => {
				const data = JSON.parse(chunk.toString());
				const index = todos.findIndex((todo) => todo.id === id);

				if (data.text) {
					todos[index].text = data.text;
				}
				if (typeof data.isCompleted === "boolean") {
					todos[index].isCompleted = data.isCompleted;
				}
				writeJson("todos.json", todos).then(() => sendCode(res, 200));
			});
			break;
		case "OPTIONS":
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
			sendCode(res, 200);

			break;

		default:
			break;
	}
}

const server = http.createServer((req, res) => {
	const [endPoint, id] = req.url.split("/").filter((item) => item.length > 0);

	console.log(`${req.method} till url: ${req.url}`);

	if (endPoint === "todos") {
		sendTodos(req, res, parseInt(id));
	} else {
		sendCode(res, 404);
	}
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
