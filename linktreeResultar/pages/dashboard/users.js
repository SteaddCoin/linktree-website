import AdminMenu from "../../components/AdminMenu/AdminMenu";
import UserAdmin from "../../components/UserAdmin";
import api from "../../services/api";

const Users = (props) => {
	return (
		<div className="dashboard">
			<AdminMenu file_path={props.file_path} />
			<UserAdmin />
		</div>
	);
};

Users.getInitialProps = async ({ req }) => {
	let file_path = undefined;
	let user = req.headers.host.split(".")[0].split(":")[0];
	file_path = await api
		.get("read-logo/" + user)
		.then((r) => {
			return r.data.file_path;
		})
		.catch((e) => {
			if (e.response.status == 400) return undefined;
		});
	return { file_path: file_path };
};

export default Users;
