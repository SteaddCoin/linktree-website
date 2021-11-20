import { useState } from "react";
import api from "../../services/api";
import AdminMenu from "../../components/AdminMenu/AdminMenu";

function Logo(props) {
	const [img, setImg] = useState(null);
	const [path, setPath] = useState(props.file_path);

	const reloadImg = () => {
		api.get("read-logo/" + localStorage.getItem("username")).then((r) =>
			setPath(r.data.file_path)
		);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		let data = new FormData();
		if (!img) return;
		data.append("file", img);
		await api
			.delete("/delete-logo", {
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			})
			.catch((e) => {
				if (e.response.status == 401) {
					window.location.href = "/admin";
				}
			});

		await api
			.post("/create-logo", data, {
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			})
			.then(() => {
				console.log("Here?");
				reloadImg();
			})
			.catch((e) => {
				if (e.response.status == 401) {
					window.location.href = "/admin";
				}
			});
	};

	return (
		<div className={"dashboard"}>
			<AdminMenu file_path={path} />
			<div>
				<div>
					<img src={`${"http://steadd.com:8000"}${path}`} />
				</div>
				<form onSubmit={handleSubmit}>
					<input
						type={"file"}
						onChange={(e) => setImg(e.target.files[0])}
					/>
					<input type={"submit"} />
				</form>
			</div>
		</div>
	);
}

Logo.getInitialProps = async ({ req }) => {
	let file_path = undefined;
	let user = req.headers.host.split(".")[0].split(":")[0];
	file_path = await api
		.get("/read-logo/" + user)
		.then((r) => {
			return r.data.file_path;
		})
		.catch((e) => {
			if (e.response.status == 400) return undefined;
		});
	return { file_path: file_path };
};

export default Logo;
