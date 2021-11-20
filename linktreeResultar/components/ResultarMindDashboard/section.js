import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function Section() {
	const [section, setSection] = useState({});

	const loadInfo = () => {
		api.get("read-section/" + localStorage.getItem("username"))
			.then((r) => setSection({ ...r.data, image: "" }))
			.catch((e) => {
				catchErr(e, () =>
					setSection({
						title: "",
						content: "",
						image_path: "",
						button_link: { name: "", url: "" },
						image: "",
					})
				);
			});
	};

	useEffect(() => {
		loadInfo();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		if (section.image) {
			data.append("image", section.image, section.image.name);
		}

		data.append("title", section.title);
		data.append("content", section.title);
		data.append("btn", JSON.stringify(section.button_link));

		await api
			.post("/create-section", data, {
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
					"Content-Type": "multipart/form-data",
				},
			})
			.then(() => {
				loadInfo();
			});
	};

	if (Object.keys(section).length === 0) {
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
			<h1>Main Section</h1>
			<form className={"m-section"} onSubmit={handleSubmit}>
				<div>
					<input
						placeholder={"Titulo"}
						value={section.title}
						onChange={(e) =>
							setSection((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Conteudo"}
						value={section.content}
						onChange={(e) =>
							setSection((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					{section.image_path !== "" ? (
						<img
							src={`${api.defaults.baseURL}${section.image_path}`}
							width="80px"
							height="80px"
						/>
					) : null}
					<input
						placeholder={"Image"}
						type={"file"}
						value={
							section.image === ""
								? section.image
								: section.image.file_name
						}
						onChange={(e) =>
							setSection((prev) => ({
								...prev,
								image: e.target.files[0],
							}))
						}
					/>
				</div>
				<div>
					<h4>Button</h4>
					<div>
						<input
							placeholder={"Button Name"}
							value={section.button_link.name}
							onChange={(e) =>
								setSection((prev) => ({
									...prev,
									button_link: {
										...section.button_link,
										name: e.target.value,
									},
								}))
							}
						/>
					</div>
					<div>
						<input
							placeholder={"Button Url"}
							value={section.button_link.url}
							onChange={(e) =>
								setSection((prev) => ({
									...prev,
									button_link: {
										...section.button_link,
										url: e.target.value,
									},
								}))
							}
						/>
					</div>
				</div>
				<button type={"submit"}>Guardar alterações</button>
			</form>
		</div>
	);
}

export default Section;
