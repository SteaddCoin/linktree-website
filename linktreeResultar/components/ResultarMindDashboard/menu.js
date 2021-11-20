import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function Menu() {
	const [menu, setMenu] = useState([]);
	const [id, setId] = useState("");

	useEffect(() => {
		api.get("/read-menu/" + localStorage.getItem("username"))
			.then((r) => {
				setId(r.data.id);
				setMenu(r.data.links);
			})
			.catch((e) => {
				catchErr(e, () => {
					setMenu([]);
					setId("");
				});
			});
	}, []);

	const addNew = (e) => {
		e.preventDefault();
		setMenu([...menu, { name: "", url: "" }]);
	};

	const change = (val, type, index) => {
		switch (type) {
			case "url":
				setMenu(
					menu.map((i, ind) => {
						ind == index ? (i.url = val) : null;
						return i;
					})
				);
				break;
			case "name":
				setMenu(
					menu.map((i, ind) => {
						ind == index ? (i.name = val) : null;
						return i;
					})
				);
				break;
			default:
				break;
		}
	};

	const deleteItem = (e, index) => {
		e.preventDefault();
		setMenu(menu.filter((i, ind) => (ind == index ? null : i)));
	};

	const submitMenu = (e) => {
		e.preventDefault();
		api.post(
			"/create-menu",
			{ id: id, links: menu },
			{
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			}
		).then();
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<h1>Menu</h1>
			<form className={"menu"}>
				{menu.map((i, index) => {
					return (
						<div key={index}>
							<input
								type={"text"}
								placeholder={"Name"}
								value={i.name}
								onChange={(e) =>
									change(e.target.value, "name", index)
								}
							/>
							<input
								type={"text"}
								placeholder={"Url"}
								value={i.url}
								onChange={(e) =>
									change(e.target.value, "url", index)
								}
							/>
							<button onClick={(e) => deleteItem(e, index)}>
								Apagar
							</button>
						</div>
					);
				})}
				<button onClick={addNew}>Adicionar novo link ao menu!</button>
				<button type={"submit"} onClick={submitMenu}>
					Guardar alterações
				</button>
			</form>
		</div>
	);
}

export default Menu;
