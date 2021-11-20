import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function Banner() {
	const [banner, setBanner] = useState({});

	useEffect(() => {
		api.get("read-banner/" + localStorage.getItem("username"))
			.then((r) => {
				setBanner(r.data);
			})
			.catch((e) => {
				catchErr(e, () =>
					setBanner({ id: "", youtube: "", content: "", title: "" })
				);
			});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();

		api.post("create-banner", banner, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	if (Object.keys(banner).length === 0) {
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
			<h1>Banner</h1>
			<form className={"banner"} onSubmit={handleSubmit}>
				<div>
					<input
						placeholder={"Titulo"}
						value={banner.title}
						onChange={(e) =>
							setBanner((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Conteudo"}
						value={banner.content}
						onChange={(e) =>
							setBanner((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Youtube link"}
						value={banner.youtube}
						onChange={(e) =>
							setBanner((prev) => ({
								...prev,
								youtube: e.target.value,
							}))
						}
					/>
				</div>
				<button type={"submit"}>Guardar alterações</button>
			</form>
		</div>
	);
}

export default Banner;
