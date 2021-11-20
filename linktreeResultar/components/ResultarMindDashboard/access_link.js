import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function AccessLink() {
	const [access, setAccess] = useState({});

	useEffect(() => {
		api.get("read-access-link/" + localStorage.getItem("username"))
			.then((r) => {
				setAccess(r.data);
			})
			.catch((e) => {
				catchErr(e, () =>
					setAccess({ id: "", link: { name: "", url: "" } })
				);
			});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		api.post("create-access-link", access, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	if (Object.keys(access).length === 0) {
		return <h1>Loading...</h1>;
	}

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<h1>Link de acesso</h1>
			<form className={"access-link"} onSubmit={handleSubmit}>
				<div>
					<input
						placeholder={"name"}
						value={access.link.name}
						onChange={(e) =>
							setAccess((prev) => ({
								...prev,
								link: { ...prev.link, name: e.target.value },
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Conteudo"}
						value={access.link.url}
						onChange={(e) =>
							setAccess((prev) => ({
								...prev,
								link: { ...prev.link, url: e.target.value },
							}))
						}
					/>
				</div>
				<button type={"submit"}>Guardar alterações</button>
			</form>
		</div>
	);
}

export default AccessLink;
