import { useState, useEffect } from "react";
import Modal from "react-modal";
import { BsChevronContract } from "react-icons/bs";
import api from "../../services/api";

const Register = () => {
	const [isModal, setIsModal] = useState(false);
	const [err, setErr] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [pass, setPass] = useState("");
	const [contactNumber, setContact] = useState();

	useEffect(() => {
		api.get(
			"read-contact/" + window.location.host.split(".")[0].split(":")[0]
		)
			.then((r) => setContact(r.data))
			.catch((e) => {
				if (e.response?.status === 404) {
					setContact({ number: "" });
				}
			});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		api.post("register", {
			username: username,
			email: email,
			password: pass,
		})
			.then(() => {
				window
					.open(
						`https://wa.me/${contactNumber.number}?text=Confirme a minha conta com o Username: ${username} e o email ${email}.`,
						"_blank"
					)
					.focus();
			})
			.catch(() => {
				setErr("Ocurreu um erro!");
			});

		setIsModal(false);
	};

	return (
		<>
			<button onClick={() => setIsModal(!isModal)}>Registar</button>
			<Modal isOpen={isModal}>
				<div>
					<BsChevronContract
						onClick={() => setIsModal(!isModal)}
						style={{
							height: "30px",
							width: "30px",
							cursor: "pointer",
						}}
					/>
				</div>
				<div>
					{err}
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							placeholder="Username"
						/>
						<input
							type="email"
							onChange={(e) => {
								setEmail(e.target.value);
							}}
							value={email}
							placeholder="Email"
						/>
						<input
							type="password"
							value={pass}
							onChange={(e) => {
								setPass(e.target.value);
							}}
							placeholder="Password"
						/>
						<input type="submit" />
					</form>
				</div>
			</Modal>
		</>
	);
};

export default Register;
