import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

function Cards() {
	const [cards, setCards] = useState({});

	useEffect(() => {
		api.get("read-cards/" + localStorage.getItem("username"))
			.then((r) => {
				setCards(r.data);
			})
			.catch((e) => {
				catchErr(e, () =>
					setCards({
						title: "",
						content: "",
						cards: [],
					})
				);
			});
	}, []);

	const addCard = () => {
		setCards((prev) => ({
			...prev,
			cards: [...prev.cards, { title: "", content: "", icon_class: "" }],
		}));
	};

	const deleteCard = (index) => {
		setCards((prev) => ({
			...prev,
			cards: prev.cards.filter((item, i) => (i === index ? null : item)),
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		api.post("create-cards", cards, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		});
	};

	if (Object.keys(cards).length === 0) {
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
			<h1>Cards</h1>
			<form className={"cards"} onSubmit={handleSubmit}>
				<div>
					<input
						placeholder={"Titulo"}
						value={cards.title}
						onChange={(e) =>
							setCards((prev) => ({
								...prev,
								title: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<input
						placeholder={"Conteudo"}
						value={cards.content}
						onChange={(e) =>
							setCards((prev) => ({
								...prev,
								content: e.target.value,
							}))
						}
					/>
				</div>
				<div>
					<h4>Card</h4>
					{cards.cards.map((i, index) => (
						<div key={index}>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<div>
									<input
										placeholder={"Titulo"}
										value={i.title}
										onChange={(e) =>
											setCards((prev) => ({
												...prev,
												cards: cards.cards.map(
													(j, number) => {
														if (number === index) {
															j.title =
																e.target.value;
														}
														return j;
													}
												),
											}))
										}
									/>
								</div>
								<div>
									<input
										placeholder={"Conteudo"}
										value={i.content}
										onChange={(e) =>
											setCards((prev) => ({
												...prev,
												cards: cards.cards.map(
													(j, number) => {
														if (number === index) {
															j.content =
																e.target.value;
														}
														return j;
													}
												),
											}))
										}
									/>
								</div>
								<div>
									<input
										placeholder={"icon class"}
										value={i.icon_class}
										onChange={(e) =>
											setCards((prev) => ({
												...prev,
												cards: cards.cards.map(
													(j, number) => {
														if (number === index) {
															j.icon_class =
																e.target.value;
														}
														return j;
													}
												),
											}))
										}
									/>
								</div>
								<div>
									<button
										onClick={() => deleteCard(index)}
										type={"button"}
									>
										Apagar o card
									</button>
								</div>
							</div>
							<hr />
						</div>
					))}
					<button onClick={addCard} type={"button"}>
						Add card
					</button>
				</div>
				<button type={"submit"}>Guardar alterações</button>
			</form>
		</div>
	);
}

export default Cards;
