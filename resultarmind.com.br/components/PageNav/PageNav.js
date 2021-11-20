import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import AnchorLink from "react-anchor-link-smooth-scroll";
import Scrollspy from "react-scrollspy";
import Fab from "@material-ui/core/Fab";
import ArrowIcon from "@material-ui/icons/ArrowUpward";
import Tooltip from "@material-ui/core/Tooltip";
import { withTranslation } from "~/i18n";
import useStyles from "./pagenav-style";
import api from "../../services/api";

function createData(id, name, url) {
	return {
		id,
		name,
		url,
	};
}

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) {
	// eslint-disable-line
	return <AnchorLink to={props.to} {...props} />; // eslint-disable-line
});

function PageNav(props) {
	const { t } = props;
	const [show, setShow] = useState(false);
	let flagShow = false;
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(window.location.host.split(".")[0].split(":")[0]);
	}, []);

	const handleScroll = () => {
		const doc = document.documentElement;
		const scroll =
			(window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
		const newFlagShow = scroll > 500;
		if (flagShow !== newFlagShow) {
			setShow(newFlagShow);
			flagShow = newFlagShow;
		}
	};
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		console.log();
	}, []);
	const classes = useStyles();
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

	return (
		<div className={clsx(classes.pageNav, show && classes.show)}>
			<nav className={classes.sectionNav}>
				<Scrollspy items={navMenu} currentClassName="active">
					{menuList.map((item, index) => (
						<li
							key={index.toString()}
							style={{ top: 30 * (navMenu.length - index) }}
							data-id={index}
						>
							<Tooltip
								title={t("" + item.name)}
								placement="left"
								classes={{
									tooltip: classes.tooltip,
								}}
							>
								<AnchorLink href={item.url} />
							</Tooltip>
						</li>
					))}
				</Scrollspy>
			</nav>
			<Tooltip
				title="To Top"
				placement="left"
				classes={{
					tooltip: classes.tooltip,
				}}
			>
				<Fab
					color="primary"
					aria-label="To top"
					component={LinkBtn}
					href="#home"
					className={classes.fab}
				>
					<ArrowIcon />
				</Fab>
			</Tooltip>
		</div>
	);
}

PageNav.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation(["saas-landing"])(PageNav);
