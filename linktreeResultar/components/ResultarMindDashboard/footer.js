import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function Footer() {
	const [footer, setFooter] = useState({});

	useEffect(() => {
		api.get("/read-footer/" + localStorage.getItem("username"))
			.then((r) => {
				setFooter(r.data);
			})
			.catch((e) => {
				catchErr(e, () =>
					setFooter({
						street: "",
						phone_number: "",
						contact: "",
						social_media: [],
					})
				);
			});
	}, []);

	const addSocial = () => {
		setFooter((prev) => ({
			...prev,
			social_media: [...prev.social_media, { name: "", url: "" }],
		}));
	};

	const deleteSocial = (index) => {
		setFooter((prev) => ({
			...prev,
			social_media: prev.social_media.filter((i, number) =>
				index === number ? null : i
			),
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		api.post("/create-footer", footer, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	if (Object.keys(footer).length === 0) {
		return <h1>Loading ...</h1>;
	}

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<h1>Footer</h1>
			<form className={"footer"} onSubmit={handleSubmit}>
				<div>
					<input
						placeholder={"Rua"}
						value={footer.street}
						onChange={(e) =>
							setFooter((prev) => ({
								...prev,
								street: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Numero"}
						value={footer.phone_number}
						onChange={(e) =>
							setFooter((prev) => ({
								...prev,
								phone_number: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Contact"}
						value={footer.contact}
						onChange={(e) =>
							setFooter((prev) => ({
								...prev,
								contact: e.target.value,
							}))
						}
					/>
				</div>
				<h3>Redes sociais</h3>
				{footer.social_media.map((i, index) => {
					return (
						<div key={index}>
							<hr />
							<input
								placeholder={"Nome"}
								value={i.name}
								onChange={(e) =>
									setFooter((prev) => ({
										...prev,
										social_media: prev.social_media.map(
											(i, number) => {
												if (number == index) {
													i.name = e.target.value;
												}
												return i;
											}
										),
									}))
								}
							/>
							<input
								placeholder={"URL"}
								value={i.url}
								onChange={(e) =>
									setFooter((prev) => ({
										...prev,
										social_media: prev.social_media.map(
											(i, number) => {
												if (number == index) {
													i.url = e.target.value;
												}
												return i;
											}
										),
									}))
								}
							/>
							<button
								type={"button"}
								onClick={(e) => deleteSocial(index)}
							>
								Apagar
							</button>
							<hr />
						</div>
					);
				})}
				<button type={"button"} onClick={(e) => addSocial()}>
					Adicionar rede social
				</button>
				<button type={"submit"}>Guardar alterações</button>
			</form>
		</div>
	);
}

export default Footer;
