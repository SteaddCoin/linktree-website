import React, { useEffect, useState } from "react";

import {
	Menu,
	MenuItem,
	ProSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "react-pro-sidebar";

import { FaList, FaPager } from "react-icons/fa";
import {
	FiArrowLeftCircle,
	FiArrowRightCircle,
	FiHome,
	FiLogOut,
} from "react-icons/fi";
import { BsPersonFill } from "react-icons/bs";
import { BiCog, BiImageAlt } from "react-icons/bi";

import api from "../../services/api.js";

import "react-pro-sidebar/dist/css/styles.css";

const Header = ({ file_path }) => {
	const [menuCollapse, setMenuCollapse] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		api.get("is-admin", {
			headers: { "jwt-token": "JWT " + localStorage.getItem("token") },
		})
			.then(() => {
				setIsAdmin(true);
			})
			.catch((e) => {
				if (e.response) {
					setIsAdmin(false);
				}
			});
	}, []);

	useEffect(() => {
		api.get("verify", {
			headers: { "jwt-token": "JWT " + localStorage.getItem("token") },
		})
			.then((r) => {
				r.status === 200 ? null : (window.location.href = "/admin");
			})
			.catch((e) => {
				console.log(e.response);
				e.response.status === 401
					? (window.location.href = "/admin")
					: null;
			});
	}, []);

	useEffect(() => {
		window.addEventListener("resize", (e) => {
			setMenuCollapse(e.target.innerWidth < 800 ? true : false);
		});
		setMenuCollapse(window.innerWidth < 800 ? true : false);
	}, []);
	const menuIconClick = () => {};

	return (
		<div style={{ height: "100%" }}>
			<div id="header">
				<ProSidebar collapsed={menuCollapse}>
					<SidebarHeader>
						<div className="logotext">
							{menuCollapse ? (
								<img
									src={`http://resultarmind.com.br:8000${file_path}`}
									width="50px"
									height="50px"
									style={{ borderRadius: "50%" }}
								/>
							) : (
								<img
									src={`http://resultarmind.com.br:8000${file_path}`}
									width="100px"
									height="100px"
									style={{ borderRadius: "50%" }}
								/>
							)}
						</div>
						<div className="closemenu" onClick={menuIconClick}>
							{menuCollapse ? (
								<FiArrowRightCircle />
							) : (
								<FiArrowLeftCircle />
							)}
						</div>
					</SidebarHeader>
					<SidebarContent>
						<Menu iconShape="square">
							<MenuItem
								active={true}
								icon={<FiHome />}
								onClick={() => {
									window.location.href = "/dashboard";
								}}
							>
								Home
							</MenuItem>
							<MenuItem
								icon={<FaList />}
								onClick={() => {
									window.location.href =
										"/dashboard/linktree";
								}}
							>
								LinkTree
							</MenuItem>
							<MenuItem
								icon={<BiImageAlt />}
								onClick={() => {
									window.location.href = "/dashboard/logo";
								}}
							>
								Logo
							</MenuItem>
							<MenuItem
								icon={<FaPager />}
								onClick={() => {
									window.location.href =
										"/dashboard/main-page";
								}}
							>
								Main page
							</MenuItem>
							<MenuItem
								icon={<BsPersonFill />}
								onClick={() => {
									window.location.href = "/dashboard/change";
								}}
							>
								Change
							</MenuItem>

							{isAdmin ? (
								<MenuItem
									icon={<BsPersonFill />}
									onClick={() => {
										window.location.href =
											"/dashboard/users";
									}}
								>
									Users
								</MenuItem>
							) : null}
						</Menu>
					</SidebarContent>
					<SidebarFooter>
						<Menu iconShape="square">
							<MenuItem
								icon={<FiLogOut />}
								onClick={() => {
									localStorage.removeItem("token");
									window.location.href = "/";
								}}
							>
								Logout
							</MenuItem>
						</Menu>
					</SidebarFooter>
				</ProSidebar>
			</div>
		</div>
	);
};

export default Header;
