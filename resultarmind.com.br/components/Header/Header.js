import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Hidden from "@material-ui/core/Hidden";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Scrollspy from "react-scrollspy";
import Settings from "./Settings";
import MobileMenu from "./MobileMenu";
import logo from "~/public/images/saas-logo.svg";
import brand from "~/public/text/brand";
import link from "~/public/text/link";
import { withTranslation } from "~/i18n";
import useStyles from "./header-style";
import api from "../../services/api";

let counter = 0;
function createData(name, url, offset) {
	counter += 1;
	return {
		id: counter,
		name,
		url,
		offset,
	};
}

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) {
	// eslint-disable-line
	return <AnchorLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

function Header(props) {
	const [fixed, setFixed] = useState(false);
	let flagFixed = false;
	const handleScroll = () => {
		const doc = document.documentElement;
		const scroll =
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
		const newFlagFixed = scroll > 100;
		if (flagFixed !== newFlagFixed) {
			setFixed(newFlagFixed);
			flagFixed = newFlagFixed;
		}
	};
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		console.log();
	}, []);
	const classes = useStyles();
	const theme = useTheme();
	const { onToggleDark, onToggleDir, invert, t } = props;
	const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [imageP, setImageP] = useState("");
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(window.location.host.split(".")[0].split(":")[0]);
	}, []);

	useEffect(() => {
		api.get("read-logo/" + user)
			.then((r) => {
				setImageP(r.data.file_path);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	useEffect(() => {
		api.get("read-menu/" + user)
			.then((r) => {
				setMenuList(r.data.links.map((i) => createData(i.name, i.url)));
				setNavMenu(r.data.links);
			})
			.catch((e) => {
				console.log(e);
				if (e.response?.status === 404) {
				}
			});
	}, [user]);
	const [menuList, setMenuList] = useState([]);
	const [navMenu, setNavMenu] = useState([]);
	const [openDrawer, setOpenDrawer] = useState(false);
	const handleOpenDrawer = () => {
		setOpenDrawer(!openDrawer);
	};
	return (
		<Fragment>
			{isMobile && (
				<MobileMenu open={openDrawer} toggleDrawer={handleOpenDrawer} />
			)}
			<AppBar
				component="header"
				position="relative"
				id="header"
				className={clsx(
					classes.header,
					fixed && classes.fixed,
					invert && classes.invert,
					openDrawer && classes.openDrawer
				)}
			>
				<Container fixed={isDesktop}>
					<div className={classes.headerContent}>
						<nav className={classes.navMenu}>
							{isMobile && (
								<IconButton
									onClick={handleOpenDrawer}
									className={clsx(
										"hamburger hamburger--spin",
										classes.mobileMenu,
										openDrawer && "is-active"
									)}
								>
									<span className="hamburger-box">
										<span
											className={clsx(
												classes.bar,
												"hamburger-inner"
											)}
										/>
									</span>
								</IconButton>
							)}
							<div className={classes.logo}>
								{invert ? (
									<Link href={link.saas.home}>
										<a>
											<img
												src={`${
													api.defaults.baseURL
												}${imageP.substring(1)}`}
												alt="logo"
											/>
											{!isMobile && brand.saas.name}
										</a>
									</Link>
								) : (
									<AnchorLink href="#home">
										<img
											src={`${
												api.defaults.baseURL
											}${imageP.substring(1)}`}
											alt="logo"
										/>
										{!isMobile && brand.saas.name}
									</AnchorLink>
								)}
							</div>
							{isDesktop && (
								<Scrollspy
									items={navMenu}
									currentClassName="active"
								>
									{menuList?.map((item) => (
										<li key={item.id.toString()}>
											{invert ? (
												// eslint-disable-next-line
												<Button
													offset={item.offset || 0}
													href={item.url}
												>
													{/*
                            {t('common:saas-landing.header_' + item.name)}

													*/}
													{t("" + item.name)}
												</Button>
											) : (
												<Button
													component={AnchorLink}
													offset={item.offset || 0}
													href={item.url}
												>
													{t("" + item.name)}
												</Button>
											)}
										</li>
									))}
								</Scrollspy>
							)}
						</nav>
						<nav className={classes.navMenu}>
							<Hidden xsDown>
								<Button
									href={link.saas.login}
									className={classes.textBtn}
								>
									{t("common:saas-landing.header_login")}
								</Button>
								<Button
									href={link.saas.register}
									variant="contained"
									color="secondary"
									className={classes.button}
								>
									{t("common:saas-landing.header_register")}
								</Button>
							</Hidden>
							<Settings
								toggleDark={onToggleDark}
								toggleDir={onToggleDir}
								invert={invert}
							/>
						</nav>
					</div>
				</Container>
			</AppBar>
		</Fragment>
	);
}

Header.propTypes = {
	onToggleDark: PropTypes.func.isRequired,
	onToggleDir: PropTypes.func.isRequired,
	invert: PropTypes.bool,
	t: PropTypes.func.isRequired,
};

Header.defaultProps = {
	sticky: false,
	invert: false,
};

export default withTranslation(["saas-landing"])(Header);
