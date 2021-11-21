import { useEffect, useState } from "react";
import AdminMenu from "../../components/AdminMenu/AdminMenu";
import api from "../../services/api";
import LinkTreeDashboard from "../../components/LinkTreeDashboard";

function Links() {
	let [path, setPath] = useState("");

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
	return (
		<div className={"dashboard"}>
			<AdminMenu file_path={path} />
			<LinkTreeDashboard />
		</div>
	);
}

export default Links;
