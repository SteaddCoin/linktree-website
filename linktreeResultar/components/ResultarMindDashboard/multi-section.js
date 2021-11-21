import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function MultiSection() {
	const [mainSection, setMainSection] = useState({});
	const [mainSectionItem, setMainSectionItem] = useState([]);

	useEffect(() => {
		api.get("/read-multi-sections/" + localStorage.getItem("username"))
			.then((r) => {
				setMainSection(r.data);
			})
			.catch((e) => {
				catchErr(e, () => setMainSection({ title: "", content: "" }));
			});
	}, []);

	const loadItem = () => {
		api.get("/read-multi-sections-item/" + localStorage.getItem("username"))
			.then((r) => {
				setMainSectionItem(
					r.data.map((i) => {
						i.image = "";
						i.created = true;
						return i;
					})
				);
			})
			.catch((e) => {
				catchErr(e, () => setMainSectionItem([]));
			});
	};

	useEffect(() => {
		loadItem();
	}, []);

	const addItem = () => {
		setMainSectionItem((prev) => [
			...prev,
			{
				id: "",
				title: "",
				content: "",
				tab: { name: "", icon: "" },
				button_link: { name: "", url: "" },
				image: "",
				image_path: "",
				created: false,
			},
		]);
	};

	const createItem = (e, item) => {
		e.preventDefault();
		const data = new FormData();

		data.append("title", item.title);
		data.append("content", item.content);
		data.append("tab", JSON.stringify(item.tab));
		data.append("button_link", JSON.stringify(item.button_link));
		data.append("image", item.image);

		api.post("/create-multi-sections-item", data, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	const deleteItem = (e, item) => {
		e.preventDefault();

		setMainSectionItem((prev) =>
			prev.filter((i) => {
				if (JSON.stringify(i) !== JSON.stringify(item)) {
					return i;
				}
			})
		);
		if (item.id !== "") {
			api.delete(`/delete-multi-section-item/${item.id}`, {
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			});
		}
	};

	const updateItem = (e, item) => {
		e.preventDefault();
		const data = new FormData();

		data.append("title", item.title);
		data.append("content", item.content);
		data.append("tab", JSON.stringify(item.tab));
		data.append("button_link", JSON.stringify(item.button_link));
		data.append("image", item.image);

		api.post("/update-multi-sections-item/" + item.id, data, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	const handleMainSectionSubmit = (e) => {
		e.preventDefault();

		api.post("/create-multi-sections", mainSection, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	if (Object.keys(mainSection).length === 0) {
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
			<h1>Multi Sections</h1>
			<form className={"menu-section"} onSubmit={handleMainSectionSubmit}>
				<div>
					<input
						type={"text"}
						placeholder={"Titulo"}
						value={mainSection.title}
						onChange={(e) =>
							setMainSection((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						type={"text"}
						placeholder={"Conteudo"}
						value={mainSection.content}
						onChange={(e) =>
							setMainSection((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
					/>
				</div>
				<button type={"submit"}>Guardar alterações</button>
			</form>
			<button type={"button"} onClick={addItem}>
				Adicionar item
			</button>
			<form>
				{mainSectionItem.map((i, index) => {
					return (
						<div key={index}>
							<div>
								<h4>Tab</h4>
								<div>
									<input
										type={"text"}
										placeholder={"Icon"}
										value={i.tab.icon}
										onChange={(e) =>
											setMainSectionItem((prev) =>
												prev.map((i, number) => {
													if (index === number) {
														i.tab.icon =
															e.target.value;
													}
													return i;
												})
											)
										}
									/>
								</div>
								<div>
									<input
										type={"text"}
										placeholder={"Nome"}
										value={i.tab.name}
										onChange={(e) =>
											setMainSectionItem((prev) =>
												prev.map((i, number) => {
													if (index === number) {
														i.tab.name =
															e.target.value;
													}
													return i;
												})
											)
										}
									/>
								</div>
							</div>

							<hr />
							<div>
								<input
									type={"text"}
									placeholder={"Titulo"}
									value={i.title}
									onChange={(e) =>
										setMainSectionItem((prev) =>
											prev.map((i, number) => {
												if (index === number) {
													i.title = e.target.value;
												}
												return i;
											})
										)
									}
								/>
							</div>

							<div>
								<input
									type={"text"}
									placeholder={"Conteudo"}
									value={i.content}
									onChange={(e) =>
										setMainSectionItem((prev) =>
											prev.map((i, number) => {
												if (index === number) {
													i.content = e.target.value;
												}
												return i;
											})
										)
									}
								/>
							</div>

							<hr />

							<div>
								{i.image_path !== "" ? (
									<img
										src={`${api.defaults.baseURL}${i.image_path}`}
										width="60px"
										height="60px"
									/>
								) : null}
								<input
									type={"file"}
									value={
										i.image === ""
											? i.image
											: i.image.filename
									}
									onChange={(e) => {
										setMainSectionItem((prev) =>
											prev.map((i, number) => {
												if (index === number) {
													i.image = e.target.files[0];
												}
												return i;
											})
										);
									}}
								/>
							</div>

							<hr />

							<div>
								<h4>Link</h4>
								<div>
									<input
										type={"text"}
										placeholder={"nome"}
										value={i.button_link.name}
										onChange={(e) =>
											setMainSectionItem((prev) =>
												prev.map((i, number) => {
													if (index === number) {
														i.button_link.name =
															e.target.value;
													}
													return i;
												})
											)
										}
									/>
								</div>
								<div>
									<input
										type={"text"}
										placeholder={"Url"}
										value={i.button_link.url}
										onChange={(e) =>
											setMainSectionItem((prev) =>
												prev.map((i, number) => {
													if (index === number) {
														i.button_link.url =
															e.target.value;
													}
													return i;
												})
											)
										}
									/>
								</div>
							</div>

							{!i.created ? (
								<button onClick={(e) => createItem(e, i)}>
									Criar
								</button>
							) : null}
							<button onClick={(e) => deleteItem(e, i)}>
								Apagar
							</button>
							{i.created ? (
								<button onClick={(e) => updateItem(e, i)}>
									Atualizar
								</button>
							) : null}
						</div>
					);
				})}
			</form>
		</div>
	);
}

export default MultiSection;
