const jwt = require("jsonwebtoken");

async function generateNewToken(token) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
			if (err) {
				console.error("Error al verificar el token:", err);
				return resolve(token); // Si hay un error, devolver el token original
			}

			const currentTime = Date.now();
			const expirationTime = decoded.exp * 1000;
			const timeUntilExpiration = expirationTime - currentTime;

			// Verificar si el token está cerca de expirar (entre 15 minutos y 1 minuto antes de expirar)
			if (timeUntilExpiration < 900000) {
				// Determinar el tiempo de expiración según el tipo de usuario
				let expiresIn = "1h"; // valor por defecto

				const newToken = jwt.sign(
					{
						user_id: decoded.user_id,
						user_name: decoded.user_name,
						user_doc: decoded.user_doc,
					},
					process.env.SECRET_TOKEN,
					{ expiresIn }
				);

				return resolve(newToken); // Devolver el nuevo token
			} else {
				return resolve(token); // Si no es necesario renovar, devolver el token original
			}
		});
	});
}

module.exports = {
	generateNewToken,
};
