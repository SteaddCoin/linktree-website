import { useState, useEffect } from "react";
import AdminMenu from "../../components/AdminMenu/AdminMenu";
import UserAdmin from "../../components/UserAdmin";
import api from "../../services/api";

const Users = () => {
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

	return (
		<div className="dashboard">
			<AdminMenu file_path={path} />
			<UserAdmin />
		</div>
	);
};

export default Users;
