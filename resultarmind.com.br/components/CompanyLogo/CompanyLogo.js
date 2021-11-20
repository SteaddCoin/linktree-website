import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import useStyles from "./logo-style";
import api from "../../services/api";

const logos = [
	"/images/logos/architect.png",
	"/images/logos/cloud.png",
	"/images/logos/coin.png",
	"/images/logos/mobile.png",
	"/images/logos/profile.png",
	"/images/logos/saas.png",
];

function CompanyLogo() {
	const classes = useStyles();
	const [filePath, setFilePath] = useState("");
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(window.location.host.split(".")[0].split(":")[0]);
	}, []);

	useEffect(() => {
		api.get("read-logo/" + user)
			.then((r) => {
				setFilePath(r.data.file_path);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);
	return (
		<Container fixed>
			<div className={classes.root}>
				<img
					src={`${api.defaults.baseURL}${filePath.substring(1)}`}
					alt="Logo"
				/>
			</div>
		</Container>
	);
}

export default CompanyLogo;
