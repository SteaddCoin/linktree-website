import { useState } from "react";
import api from "../services/api";

function Admin() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const [err, setErr] = useState("");

	const submit = (e) => {
		e.preventDefault();
		if (username == "" || password == "") {
			return;
		}

		let data = { username: username, password: password };
		api.post("/login", data, {
			headers: { "Content-Type": "application/json" },
		})
			.then((r) => {
				localStorage.setItem("token", r.data.token);
				localStorage.setItem("username", username);
				window.location.href = "/dashboard";
			})
			.catch((e) => {
				if (e.response?.status === 400) {
					setErr("Algo deu errado!");
				}
			});
	};
	return (
		<div>
			{err}
			<form onSubmit={submit}>
				<input
					type={"text"}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type={"password"}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input type={"submit"} />
			</form>
		</div>
	);
}

export default Admin;
