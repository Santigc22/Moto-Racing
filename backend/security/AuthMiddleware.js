const jwt = require("jsonwebtoken");
const { generateNewToken } = require("./extendTokenSession.js");
require("dotenv").config();

const cookieJwtAuthGeneral = async (req, res, next) => {
	const token = req.headers.authorization;

	try {
		if (!token) {
			return res.status(401).json({ error: "Usuario no logeado" });
		}

		jwt.verify(token, process.env.SECRET_TOKEN, async (err, decoded) => {
			if (err) {
				if (err.name === "TokenExpiredError") {
					return res.status(401).json({ error: "Token expirado" });
				}
				return res.status(403).json({ error: "Token no válido" });
			}

			// Check if the token is close to expiration and generate a new one if necessary
			const newToken = await generateNewToken(token);

			// console.log(newToken);
			if (newToken !== token) {
				res.setHeader("Authorization", newToken);
			} else {
				res.setHeader("Authorization", token);
			}

			req.user = decoded;
			next();
		});
	} catch (err) {
		return res.status(500).json({ error: "Error interno del servidor" });
	}
};

module.exports = {
	cookieJwtAuthGeneral,
};
