import api from "../../services/api";
import AdminMenu from "../../components/AdminMenu/AdminMenu";
import { useEffect, useState } from "react";

function Dashboard() {
	const [user, setUser] = useState("");
	const [path, setPath] = useState("");

	useEffect(() => {
		let user = localStorage.getItem("username");
		api.get("/read-logo/" + user)
			.then((r) => {
				setPath(r.data.file_path);
			})
			.catch((e) => {
				if (e.response.status == 400) return undefined;
			});
	}, []);

	useEffect(() => {
		setUser(localStorage.getItem("username"));
	}, []);

	return (
		<div className={"dashboard"}>
			<AdminMenu file_path={path} />
			<div style={{ textAlign: "center", fontSize: "5rem" }}>
				Welcome {user}
			</div>
		</div>
	);
}

export default Dashboard;
