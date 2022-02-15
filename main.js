import { engine as handlebarsEngine } from "express-handlebars";
import express from "express";
import bodyParser from "body-parser";

const app = express();

app.engine("handlebars", handlebarsEngine());
app.set("view engine", "handlebars");
app.set("views", "./pages");

const users = {
	mage: {
		data: {
			"deck-master": {
				highscores: 30
			}
		}
	}
};

app.get("/:user/", (req, res) => {
	res.render("profile", { name: req.params.user });
});

app.get("/:user/api/:game", (req, res) => {
	res.json(
		users[req.params.user]?.data?.[req.params.game] ?? { error: "Not Found." }
	);
});

app.put("/:user/api/:game", bodyParser.json(), (req, res) => {
	if (users[req.params.user]) {
		users[req.params.user].data[req.params.game] = {
			...(users[req.params.user].data[req.params.game] ?? {}),
			...req.body
		};
		res.json({ result: "Updated data.", error: false }).status(200);
	} else res.json({ result: "User not found.", error: true }).status(404);
});

app.listen(process.env.PORT || 3000);
