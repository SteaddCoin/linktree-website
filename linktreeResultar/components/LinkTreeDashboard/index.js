import { useEffect, useState } from "react";
import api from "../../services/api";

function LinkTreeDashboard() {
	const [data, setData] = useState({});
	const [links, setLinks] = useState([]);
	const [titleName, setTitleName] = useState("");
	const [titleUrl, setTitleUrl] = useState("");
	const [content, setContent] = useState("");
	const [successMsg, setSuccessMsg] = useState("");

	const requestNewData = () => {
		api.get("/read-linktree/" + localStorage.getItem("username"))
			.then((r) => {
				setData(r.data);
			})
			.catch((err) => {
				if (err.response.status == 404) {
					setData({ title: "", content: "", links: [] });
				}
			});
	};

	useEffect(() => {
		requestNewData();
	}, []);

	useEffect(() => {
		if (Object.keys(data).length > 0) {
			setLinks(
				data.links.map((i, index) => {
					i["id"] = index;
					return i;
				})
			);
			setContent(data.content);
			setTitleName(data.title.name);
			setTitleUrl(data.title.url);
		}
	}, [data]);

	const handleChange = (item, value, type) => {
		if (type == "name") {
			setLinks(
				links.map((i) => {
					i.id == item.id ? (i.name = value) : null;
					return i;
				})
			);
		} else if (type == "url") {
			setLinks(
				links.map((i) => {
					i.id == item.id ? (i.url = value) : null;
					return i;
				})
			);
		}
	};

	const handleDelete = (e) => {
		e.preventDefault();
		api.delete(`delete-linktree/${data.id}`, {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		})
			.then(() => {
				setSuccessMsg("Deleted with success");
				setTimeout(() => {
					setSuccessMsg("");
				}, 2000);
			})
			.catch((e) => {
				if (e.response.status == 401) {
					window.location.href = "/admin";
				}
			});
	};

	const handleDeleteLink = (i) => {
		setLinks(links.filter((j) => (j.id === i.id ? null : j)));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		let title = { name: titleName, url: titleUrl };
		if (data.id) {
			api.put(
				`update-linktree/${data.id}`,
				{ content: content, links: links, title: title },
				{
					headers: {
						"jwt-token": `JWT ${localStorage.getItem("token")}`,
					},
				}
			)
				.then(() => {
					setSuccessMsg("Saved with success!");
					setTimeout(() => {
						setSuccessMsg("");
					}, 2000);
				})
				.catch((e) => {
					if (e.response.status == 401) {
						window.location.href = "/admin";
					}
				});
		} else {
			api.post(
				`create-linktree`,
				{ content: content, links: links },
				{
					headers: {
						"jwt-token": `JWT ${localStorage.getItem("token")}`,
					},
				}
			)
				.then(() => {
					requestNewData();
					setSuccessMsg("Created with success!");
					setTimeout(() => {
						setSuccessMsg("");
					}, 2000);
				})
				.catch((e) => {
					if (e.response.status == 401) {
						window.location.href = "/admin";
					}
				});
		}
	};

	if (Object.keys(data).length === 0 && links.length == 0 && content == "") {
		return <h1>Loading...</h1>;
	}

	return (
		<div>
			{successMsg == "" ? null : (
				<div className={"success"}>{successMsg}</div>
			)}
			<form onSubmit={handleSubmit} className={"linktree-form"}>
				<input
					placeholder={"Title"}
					type={"text"}
					value={titleName}
					onChange={(e) => setTitleName(e.target.value)}
				/>
				<input
					placeholder={"Link to title"}
					type={"text"}
					value={titleUrl}
					onChange={(e) => setTitleUrl(e.target.value)}
				/>
				<textarea
					onChange={(e) => setContent(e.target.value)}
					style={{ height: "20vh", width: "35vw" }}
					value={content}
				/>
				<div>
					<button
						type={"button"}
						onClick={() => {
							setLinks([
								...links,
								{
									id: links.length,
									name: "",
									url: "",
								},
							]);
						}}
					>
						Add new links
					</button>
				</div>
				<div>
					{links.map((i, index) => {
						return (
							<div key={index}>
								<input
									onChange={(e) =>
										handleChange(i, e.target.value, "name")
									}
									value={i.name}
									placeholder={"name"}
								/>
								<input
									onChange={(e) =>
										handleChange(i, e.target.value, "url")
									}
									value={i.url}
									placeholder={"url"}
								/>
								<button
									onClick={() => handleDeleteLink(i)}
									type={"button"}
								>
									Delete
								</button>
							</div>
						);
					})}
				</div>
				<input type={"submit"} />
			</form>
			<button onClick={handleDelete}>Delete everything</button>
		</div>
	);
}

export default LinkTreeDashboard;
