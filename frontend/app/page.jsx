"use client";
import styles from "./page.module.css";
import { useState } from "react";
import VideoBackground from "./Components/VideoBackground";
import { useRouter } from "next/navigation";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
	const [showPass, setShowPass] = useState("password");

	const [showPassIcon, setShowPassIcon] = useState("bi bi-eye");

	const router = useRouter();

	const [username, setUsername] = useState("");

	const [Password, setPassword] = useState("");

	const [AuthCode, setAuthCode] = useState("");

	///

	const [showModal, setShowModal] = useState(false);

	const toggleModal = () => {
		setShowModal(!showModal);
	};
	/////

	const UsernameHandler = (e) => {
		setUsername(e);
	};

	const PasswordHandler = (e) => {
		setPassword(e);
	};

	const showPassHandler = (e) => {
		e.preventDefault();
		setShowPass(showPass == "password" ? "text" : "password");
		setShowPassIcon(
			showPassIcon == "bi bi-eye" ? "bi bi-eye-slash" : "bi bi-eye"
		);
	};

	const SubmitHandler = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(
				"https://moto-racing.onrender.com/usuarios/login",
				{
					method: "POST",
					body: JSON.stringify({
						username: username,
						password: Password,
					}),
					headers: {
						"content-type": "application/json",
					},
				}
			);

			if (response.ok) {
				toggleModal();
				// router.push("/dashboard");
			} else {
				alert("Algo ha salido mal");
			}

			console.log(response.json);
		} catch (error) {
			console.log(error);
		}
	};

	const validateOtp = async () => {
		try {
			const response = await fetch(
				"https://moto-racing.onrender.com/usuarios/verifyOTP",
				{
					method: "POST",
					body: JSON.stringify({
						correo: username,
						otp: AuthCode,
					}),
					headers: {
						"content-type": "application/json",
					},
				}
			);

			const token = await response.json();
			console.log(token);
			if (response.ok) {
				sessionStorage.setItem("authToken", token.authorization);
				sessionStorage.setItem("tipo_usuario", token.user_tipe);
				router.push("/dashboard");
			} else {
				alert("Algo ha salido mal");
			}

			console.log(response.json);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="d-flex flex-column align-items-center vh-100 justify-content-center">
			<div>
				{/* Modal */}
				{showModal && (
					<div className="modal show d-block" tabIndex="-1" role="dialog">
						<div className="modal-dialog" role="document">
							<div className={`modal-content ${styles.customModalContent}`}>
								<div className="modal-header justify-content-between">
									<h5 className="modal-title">Autenticación 2FA</h5>
									<button type="button" className="close" onClick={toggleModal}>
										<span>&times;</span>
									</button>
								</div>
								<div className={`modal-body ${styles.customModalBody}`}>
									<p>
										Hemos enviado un código a tu correo. Por favor digita el
										código
									</p>
									<input
										onChange={(e) => setAuthCode(e.target.value)}
										type="number"
										className={`${styles.customModalInput}`}
									></input>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={validateOtp}
									>
										Iniciar sesión
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Backdrop para el modal */}
				{showModal && (
					<div className="modal-backdrop fade show" onClick={toggleModal}></div>
				)}
			</div>

			<VideoBackground />
			<main className={styles.main}>
				<form
					onSubmit={(e) => SubmitHandler(e)}
					className={`position-relative vw-75 overflow-hidden rounded border border-gray-100 ${styles.customShadow}`}
				>
					<div
						className={`d-flex flex-column align-middle justify-content-center border-bottom border-gray-200 px-5 py-2 pt-4 text-center ${styles.customBackground}`}
					>
						<h3 className="h5 text-white text-uppercase font-weight-bold">
							Inicio de sesión
						</h3>
						<p className="small text-white-50">
							Usa tu correo y contraseña para acceder
						</p>
					</div>

					<div
						className={`d-flex flex-column gap-1 px-5 py-4 px-sm-5 ${styles.customBackground}`}
					>
						<label
							htmlFor="username_input"
							className="form-label text-uppercase text-white"
						>
							Nombre de usuario
						</label>

						<input
							onChange={(e) => {
								UsernameHandler(e.target.value);
							}}
							id="username_input"
							type="text"
							placeholder="user@acme.com"
							required
							className={`mt-1 form-control rounded border border-gray-200 shadow-sm text-black ${styles.customInput}`}
						></input>

						<br></br>

						<div>
							<label
								htmlFor="password"
								className="form-label text-uppercase text-white"
							>
								Contraseña
							</label>
							<div className="d-flex">
								<input
									placeholder={"Contraseña"}
									onChange={(e) => {
										PasswordHandler(e.target.value);
									}}
									id="password"
									required
									className={`form-control rounded border border-gray-200 mx-1 text-black shadow-sm ${styles.customInput}`}
									type={`${showPass}`}
									name="password"
								></input>

								<button
									type="button"
									onClick={showPassHandler}
									className={`btn text-uppercase text-white btn-white border border-gray-200 d-flex align-items-center justify-content-center w-30 ${styles.customHoverEffect}`}
									style={{ height: "38px" }}
								>
									<i className={`${showPassIcon}`}></i>
								</button>
							</div>
						</div>

						<br></br>

						<button
							type="submit"
							aria-disabled="false"
							className={`btn text-uppercase text-white btn-white border border-gray-200 d-flex align-items-center justify-content-center w-100 ${styles.customHoverEffect}`}
							style={{ height: "40px" }}
						>
							Iniciar sesión
						</button>

						<a href="./registro">¿No tienes cuenta?</a>
					</div>
				</form>

				{/* Modal */}
			</main>
		</div>
	);
}
