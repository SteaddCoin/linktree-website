import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

const Change = () => {
	const [me, setMe] = useState({ username: "", email: "", id: "" });
	const [password, setPassword] = useState("");
	useEffect(() => {
		api.get("get-me", {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		})
			.then((r) => setMe(r.data))
			.catch((e) =>
				catchErr(e, () => {
					setMe({ username: "", email: "", id: "" });
				})
			);
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		api.post("change-user", me, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	const handleSubmitPassword = (e) => {
		e.preventDefault();

		api.post(
			"change-password/" + localStorage.getItem("username"),
			{ password: password },
			{
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			}
		);
		setPassword("");
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<form onSubmit={handleSubmit}>
				<input
					type={"text"}
					placeholder={"Username"}
					value={me.username}
					onChange={(e) =>
						setMe((prev) => ({ ...prev, username: e.target.value }))
					}
				/>
				<input
					type={"email"}
					placeholder={"Email"}
					value={me.email}
					onChange={(e) =>
						setMe((prev) => ({ ...prev, email: e.target.value }))
					}
				/>
				<input type={"submit"} />
			</form>
			<form onSubmit={handleSubmitPassword}>
				<input
					type={"password"}
					placeholder={"Password"}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input type={"submit"} />
			</form>
		</div>
	);
};

export default Change;
