const Nodemailer = require("nodemailer");
require("dotenv").config();

const transport = Nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true, // Use `true` for port 465, `false` for all other ports
	auth: {
		user: "moto.racing.ix@gmail.com",
		pass: process.env.PASS_EMAIL,
	},
});

transport.verify().then(() => {
	console.log("Ready for send emails");
});

async function sendOtpEmail(user) {
	// console.log(user);
	const { correo, nombre, apellido, otp } = user;

	// Plantilla HTML para el correo OTP
	const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <h1 style="color: #4CAF50;">Tu Código OTP</h1>
            <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
            <p>Gracias por utilizar nuestros servicios. Tu código OTP es:</p>
            <p style="font-size: 24px; font-weight: bold; color: #4CAF50;">${otp}</p>
            <p>Este código es válido solo por un tiempo limitado. Si no solicitaste este código, por favor ignora este correo.</p>
            <p>Saludos,<br>El equipo de Moto-Racing</p>
        </div>
    `;

	const mailOptions = {
		from: '"Moto-Racing" <moto.racing.ix@gmail.com>', // Dirección del remitente
		to: correo, // Dirección del destinatario
		subject: "Tu Código OTP", // Asunto del correo
		html: htmlContent, // Contenido HTML del correo
	};

	try {
		const info = await transport.sendMail(mailOptions);
		console.log("Correo enviado:", info.response);
	} catch (error) {
		console.log("Error al enviar el correo:", error);
	}
}
// Función para enviar el correo
async function sendEmail(userEmail, patrocinio) {
	// Plantilla de correo
	const mailOptions = {
		from: '"Moto-Racing" <moto.racing.ix@gmail.com>', // Correo del remitente
		to: userEmail.correo, // Correo del destinatario
		subject: "Detalles del Patrocinio",
		html: `
			<h2>Hola ${userEmail.nombre} ${userEmail.apellido},</h2>
			<p>Gracias por tu patrocinio. Aquí tienes los detalles:</p>
			<ul>
				<li><strong>Subtotal del Patrocinio:</strong> $${patrocinio.subtotal}</li>
				<li><strong>Total del Patrocinio (con aumento):</strong> $${patrocinio.total}</li>
			</ul>
			<p>Gracias por tu colaboración.</p>
		`,
	};

	// Enviar el correo
	try {
		await transport.sendMail(mailOptions);
		console.log("Correo enviado exitosamente a " + userEmail.correo);
	} catch (error) {
		console.error("Error al enviar el correo:", error);
	}
}
module.exports = { sendOtpEmail, sendEmail };
