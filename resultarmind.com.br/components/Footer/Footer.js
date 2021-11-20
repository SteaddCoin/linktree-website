import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import LangIcon from "@material-ui/icons/Language";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import IconButton from "@material-ui/core/IconButton";
import logo from "~/public/images/saas-logo.svg";
import brand from "~/public/text/brand";
import { i18n } from "~/i18n";
import useStyles from "./footer-style";
import api from "../../services/api";

function Copyright() {
	return (
		<Typography
			variant="body2"
			display="block"
			align="center"
			color="textSecondary"
		>
			&copy;&nbsp;
			{brand.saas.footerText}
		</Typography>
	);
}

const footers = [
	{
		title: "Company",
		description: ["Team", "History", "Contact us", "Locations"],
		link: ["#team", "#history", "#contact-us", "#locations"],
	},
	{
		title: "Resources",
		description: [
			"Resource",
			"Resource name",
			"Another resource",
			"Final resource",
		],
		link: [
			"#resource",
			"#resource-name",
			"#another-resource",
			"#final-resource",
		],
	},
	{
		title: "Legal",
		description: ["Privacy policy", "Terms of use", "Terms Condition"],
		link: ["#privacy-policy", "#terms-of-use"],
	},
];

function Footer(props) {
	const [ctn, setCtn] = useState(null);
	const classes = useStyles();
	const { invert } = props;
	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [values, setValues] = useState({
		lang: "eng",
	});
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(window.location.host.split(".")[0].split(":")[0]);
	}, []);

	useEffect(() => {
		setValues({ lang: i18n.language });
		setCtn(document.getElementById("main-wrap"));
	}, []);

	function handleChange(event) {
		setValues((oldValues) => ({
			...oldValues,
			[event.target.name]: event.target.value,
		}));
		if (event.target.value === "ara") {
			i18n.changeLanguage("ara");
			props.toggleDir("rtl");
		} else {
			i18n.changeLanguage(event.target.value);
			props.toggleDir("ltr");
		}
	}

	const [imageP, setImageP] = useState("");

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

	const [footerData, setFooter] = useState({ social_media: [] });

	useEffect(() => {
		api.get("read-footer/" + user)
			.then((r) => {
				setFooter(r.data);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	return (
		<Container
			maxWidth="lg"
			component="footer"
			className={clsx(classes.footer, invert && classes.invert)}
		>
			<Grid container spacing={4}>
				<Grid item xs={12} md={3}>
					<div className={classes.logo}>
						<img
							src={`${api.defaults.baseURL}${imageP.substring(
								1
							)}`}
							alt="logo"
						/>{" "}
					</div>
					{/* <Copyright /> */}
				</Grid>
				<Grid item xs={12} md={6}>
					<Grid container spacing={4} justify="space-evenly">
						<Grid
							item
							xs={12}
							md={3}
							className={classes.siteMapItem}
						>
							{isDesktop && (
								<div>
									<Typography
										variant="h6"
										className={classes.title}
										color="textPrimary"
										gutterBottom
									>
										Address
									</Typography>
									<ul>
										<li>
											<Link
												variant="subtitle1"
												color="textSecondary"
											>
												{footerData.street}
											</Link>
										</li>
										<li>
											<Link
												variant="subtitle1"
												color="textSecondary"
											>
												{footerData.phone_number}
											</Link>
										</li>
										<li>
											<Link
												variant="subtitle1"
												color="textSecondary"
											>
												{footerData.contact}
											</Link>
										</li>
									</ul>
								</div>
							)}
							{isMobile && (
								<ExpansionPanel
									square
									classes={{
										root: classes.accordionRoot,
									}}
								>
									<ExpansionPanelSummary
										expandIcon={
											<ExpandMoreIcon
												className={
													classes.accordionIcon
												}
											/>
										}
										aria-controls="panel1a-content"
										id="panel1a-header"
										classes={{
											content: classes.accordionContent,
										}}
									>
										<strong>Address</strong>
									</ExpansionPanelSummary>
									<ExpansionPanelDetails>
										<ul>
											<li>
												<Link
													variant="subtitle1"
													color="textSecondary"
												>
													{footerData.street}
												</Link>
											</li>
											<li>
												<Link
													variant="subtitle1"
													color="textSecondary"
												>
													{footerData.phone_number}
												</Link>
											</li>
											<li>
												<Link
													variant="subtitle1"
													color="textSecondary"
												>
													{footerData.contact}
												</Link>
											</li>
										</ul>
									</ExpansionPanelDetails>
								</ExpansionPanel>
							)}
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} md={3}>
					<div className={classes.socmed}>
						{footerData.social_media.map((item, index) => (
							<a key={index} href={item.url}>
								<IconButton
									aria-label={index}
									className={classes.margin}
									size="small"
								>
									<i className={item.name} />
								</IconButton>
							</a>
						))}
						<IconButton
							aria-label="TW"
							className={classes.margin}
							size="small"
						>
							<i className="ion-logo-twitter" />
						</IconButton>
						<IconButton
							aria-label="IG"
							className={classes.margin}
							size="small"
						>
							<i className="ion-logo-instagram" />
						</IconButton>
						<IconButton
							aria-label="LI"
							className={classes.margin}
							size="small"
						>
							<i className="ion-logo-linkedin" />
						</IconButton>
					</div>
					<Select
						value={values.lang}
						onChange={handleChange}
						MenuProps={{
							container: ctn,
						}}
						startAdornment={
							<InputAdornment
								className={classes.icon}
								position="start"
							>
								<LangIcon />
							</InputAdornment>
						}
						className={classes.selectLang}
						input={
							<OutlinedInput
								labelWidth={200}
								name="lang"
								id="outlined-lang-simple"
							/>
						}
					>
						<MenuItem value="eng">English</MenuItem>
						<MenuItem value="deu">Deutsch</MenuItem>
						<MenuItem value="ara">العربيّة</MenuItem>
						<MenuItem value="ind">Bahasa Indonesia</MenuItem>
						<MenuItem value="prt">Português</MenuItem>
						<MenuItem value="zho">简体中文</MenuItem>
					</Select>
				</Grid>
			</Grid>
		</Container>
	);
}

Footer.propTypes = {
	invert: PropTypes.bool,
	toggleDir: PropTypes.func,
};

Footer.defaultProps = {
	invert: false,
	toggleDir: () => {},
};

export default Footer;
