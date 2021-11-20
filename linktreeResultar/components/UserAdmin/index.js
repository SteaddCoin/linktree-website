import { useEffect, useState } from "react";
import api, { catchErr } from "../../services/api";

const UserAdmin = () => {
	const [users, setUsers] = useState([]);

	const loadUsers = () => {
		api.get("list-users", {
			headers: { "jwt-token": `JWT ${localStorage.getItem("token")}` },
		})
			.then((r) => {
				setUsers(r.data);
			})
			.catch((e) => {
				if (e.response?.status !== 500) {
					catchErr(e);
				}
			});
	};

	useEffect(() => {
		loadUsers();
	}, []);

	const changeActive = (user) => {
		if (user.active === false) {
			user.active = true;
		} else {
			user.active = false;
		}

		api.post(
			"update-user/" + user.id,
			{ active: user.active, permissions: user.permissions },
			{
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			}
		);

		loadUsers();
	};

	const changePermissions = (user) => {
		if (user.permissions === 1) {
			user.permissions = 0;
		} else {
			user.permissions = 1;
		}

		api.post(
			"update-user/" + user.id,
			{ active: user.active, permissions: user.permissions },
			{
				headers: {
					"jwt-token": `JWT ${localStorage.getItem("token")}`,
				},
			}
		);
		loadUsers();
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<table>
				<tr>
					<th className="user-th">Nome</th>
					<th className="user-th">Email</th>
					<th className="user-th">Permissao</th>
					<th className="user-th">Ativo?</th>
				</tr>
				{users.map((i) => (
					<tr key={i.username}>
						<td className="user-th">{i.username}</td>
						<td className="user-th">{i.email}</td>
						<td className="user-th">
							<button
								onClick={() => changePermissions(i)}
								style={{ width: "100%" }}
							>
								{i.permissions}
							</button>
						</td>
						<td className="user-th">
							<button
								onClick={() => changeActive(i)}
								style={{ width: "100%" }}
							>
								{i.active ? "Yes" : "No"}
							</button>
						</td>
					</tr>
				))}
			</table>
		</div>
	);
};

export default UserAdmin;
