const http = require("http");
const port = 5000;
const {
	readJson,
	writeJson,
	sendJson,
	sendCode,
	getId,
	parseJson,
} = require("./utils");

async function sendTodos(req, res, id = null) {
	let todos = await readJson("todos.json");

	if (id && todos.findIndex((todo) => todo.id === id) === -1) {
		sendJson(res, { error: "Not Found" }, 404);
		return;
	}

	switch (req.method) {
		case "GET":
			if (!id) {
				sendJson(res, todos);
				return;
			}
			const item = todos.find((item) => id === item.id);

			sendJson(res, item);

			break;

		case "POST":
			req.on("data", async (chunk) => {
				const data = parseJson(chunk.toString());
				if (!data) {
					sendJson(
						res,
						{
							error: "Invalid JSON Format",
						},
						400
					);
					return;
				}
				if (!data.text) {
					sendJson(res, { error: "Data Is Invalid" }, 400);
					return;
				}
				todos.push({
					id: getId(),
					text: data.text,
					isCompleted: false,
					createdAt: Date.now(),
					completedAt: 0,
				});
				await writeJson("todos.json", todos);
				sendJson(
					res,
					{
						status: "Successfully Created",
					},
					201
				);
			});

			break;

		case "DELETE":
			todos = todos.filter((todo) => todo.id !== id);
			if (!id) {
				sendJson(res, { error: "Method Not Allowed" }, 405);
				return;
			}
			await writeJson("todos.json", todos);

			sendJson(
				res,
				{
					status: "Successfully Deleted",
				},
				200
			);

			break;

		case "PATCH":
			req.on("data", async (chunk) => {
				if (!id) {
					sendJson(res, { error: "Method Not Allowed" }, 405);
					return;
				}
				const data = parseJson(chunk.toString());
				const index = todos.findIndex((todo) => todo.id === id);
				if (!data) {
					sendJson(
						res,
						{
							error: "Invalid JSON Format",
						},
						400
					);
					return;
				}
				if (
					!data.text &&
					typeof data.isCompleted !== "boolean" &&
					typeof data.completedAt !== "number"
				) {
					sendJson(
						res,
						{
							error: "Data is invalid",
						},
						400
					);
					return;
				}

				if (data.text) {
					todos[index].text = data.text;
				}
				if (typeof data.isCompleted === "boolean") {
					todos[index].isCompleted = data.isCompleted;
				}
				if (typeof data.completedAt === "number") {
					todos[index].completedAt = data.completedAt;
				}
				await writeJson("todos.json", todos);
				sendJson(
					res,
					{
						status: "Successfully edited",
					},
					200
				);
			});
			break;

		case "PUT":
			req.on("data", async (chunk) => {
				if (!id) {
					sendJson(res, { error: "Method not allowed" }, 405);
					return;
				}
				const data = parseJson(chunk.toString());
				const index = todos.findIndex((todo) => todo.id === id);
				if (!data) {
					sendJson(
						res,
						{
							error: "Invalid JSON Format",
						},
						400
					);
					return;
				}
				if (
					!data.text ||
					typeof data.isCompleted !== "boolean" ||
					typeof data.completedAt !== "number"
				) {
					sendJson(
						res,
						{
							error: "Data is invalid",
						},
						400
					);
					return;
				}

				todos[index] = {
					...todos[index],
					isCompleted: data.isCompleted,
					text: data.text,
					completedAt: data.completedAt,
				};
				await writeJson("todos.json", todos);
				sendJson(
					res,
					{
						status: "Successfully edited",
					},
					200
				);
			});
			break;

		case "OPTIONS":
			sendCode(res, 204);
			break;

		default:
			sendCode(res, 400);
			break;
	}
}

const server = http.createServer((req, res) => {
	const [endPoint, id] = req.url.split("/").filter((item) => item.length > 0);
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, PATCH, DELETE, OPTIONS, POST, PUT"
	);
	console.log(`${req.method} till url: ${req.url}`);

	if (endPoint === "todos") {
		sendTodos(req, res, id);
	} else {
		sendJson(
			res,
			{
				error: "Not Found",
			},
			404
		);
	}
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
