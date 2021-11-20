import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { Parallax, ParallaxProvider } from "react-scroll-parallax";
import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ReactWOW from "react-wow";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withTranslation } from "~/i18n";
import { useTextAlign, useText } from "~/theme/common";
import imgAPI from "~/public/images/imgAPI";
import ParallaxMedium from "../Parallax/Medium";
import ParallaxLarge from "../Parallax/Large";
import Title from "../Title";
import useStyles from "./feature-style";
import api from "../../services/api";

function Feature(props) {
	const classes = useStyles();
	const text = useText();
	const align = useTextAlign();
	const theme = useTheme();

	const [value, setValue] = useState(0);
	const { t } = props;
	const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const [section, setSection] = useState({});
	const [mSection, setMSection] = useState({});
	const [mSectionItem, setMSectionItem] = useState([]);
	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(window.location.host.split(".")[0].split(":")[0]);
	}, []);

	useEffect(() => {
		api.get("read-section/" + user)
			.then((r) => {
				setSection(r.data);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	useEffect(() => {
		api.get("read-multi-sections/" + user)
			.then((r) => {
				setMSection(r.data);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	useEffect(() => {
		api.get("read-multi-sections-item/" + user)
			.then((r) => {
				setMSectionItem(r.data);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	return (
		<div className={classes.root}>
			<div className={classes.decoration}>
				<svg className={classes.wave}>
					<use xlinkHref="/images/saas/deco-bg.svg#main" />
				</svg>
			</div>
			<Container fixed={isDesktop}>
				<ParallaxProvider>
					<div className={classes.item}>
						<Grid
							container
							direction={isMobile ? "column-reverse" : "row"}
						>
							<Grid item md={6} xs={12}>
								<div className={classes.illustrationLeft}>
									<Parallax
										y={isMobile ? [10, 10] : [10, -25]}
										tagOuter="section"
									>
										<figure
											className={clsx(
												classes.figure,
												classes.screen
											)}
										>
											<img
												src={
													`${
														api.defaults.baseURL
													}${section.image_path?.substring(
														1
													)}` /* imgAPI.saas[0] */
												}
												alt="screen"
											/>
										</figure>
									</Parallax>
									{/* <Hidden smDown>
                    <Parallax
                      y={isMobile ? [0, 0] : [-10, 20]}
                      tagOuter="section"
                    >
                      <figure className={clsx(classes.figure, classes.graphic)}>
                        <img src={imgAPI.saas[1]} alt="illustration" />
                      </figure>
                    </Parallax>
                  </Hidden> */}
									<ParallaxMedium />
								</div>
							</Grid>
							<Grid item md={6} xs={12}>
								<ReactWOW
									animation="fadeInLeftShort"
									offset={-100}
									delay="0.2s"
									duration="0.4s"
								>
									<div>
										<Title
											align={isMobile ? "center" : "left"}
										>
											{t("" + section.title)}
										</Title>
										<Typography
											display="block"
											component="h6"
											className={text.subtitle2}
											align={isMobile ? "center" : "left"}
										>
											{t("" + section.content)}
										</Typography>
										<a
											href={section.button_link?.url}
											style={{ textDecoration: "none" }}
										>
											<Button
												variant="contained"
												color="primary"
												size="large"
												className={classes.btn}
											>
												{t(
													"" +
														section.button_link
															?.name
												)}
											</Button>
										</a>
									</div>
								</ReactWOW>
							</Grid>
						</Grid>
					</div>
					<div className={classes.item}>
						<Grid container>
							<Grid item md={6} xs={12}>
								<ReactWOW
									animation="fadeInRightShort"
									offset={-100}
									delay="0.2s"
									duration="0.4s"
								>
									<div>
										<Title
											align={
												isMobile ? "center" : "right"
											}
										>
											{t(
												"common:saas-landing.feature_title1"
											)}
											&nbsp;
											<strong>
												{t(
													"common:saas-landing.feature_titlestrong2"
												)}
											</strong>
										</Title>
										<Typography
											display="block"
											component="h6"
											className={text.subtitle2}
											align={
												isMobile ? "center" : "right"
											}
										>
											{t(
												"common:saas-landing.feature_desc2"
											)}
										</Typography>
										<div
											className={
												isMobile
													? align.textCenter
													: align.textRight
											}
										>
											<Button
												variant="contained"
												color="primary"
												size="large"
												className={classes.btn}
											>
												{t(
													"common:saas-landing.see_detail"
												)}
											</Button>
										</div>
									</div>
								</ReactWOW>
							</Grid>
							<Grid item md={6} xs={12}>
								<div className={classes.illustrationRight}>
									<Parallax
										y={isMobile ? [10, 10] : [10, -25]}
										tagOuter="section"
									>
										<figure
											className={clsx(
												classes.figure,
												classes.screen
											)}
										>
											<img
												src={imgAPI.saas[2]}
												alt="screen"
											/>
										</figure>
									</Parallax>
									<Hidden smDown>
										<Parallax
											y={
												isMobile
													? [-25, -25]
													: [-25, 25]
											}
											tagOuter="section"
										>
											<figure className={classes.graphic}>
												<img
													src={imgAPI.saas[3]}
													alt="illustration"
												/>
											</figure>
										</Parallax>
									</Hidden>
									<ParallaxMedium />
								</div>
							</Grid>
						</Grid>
					</div>
					<div className={clsx(classes.item, classes.last)}>
						<Title align="center">{t("" + mSection.title)}</Title>
						<div className={classes.tab}>
							<Grid container spacing={6}>
								{!isMobile && <Grid item md={1} xs={12} />}
								<Grid item md={10} xs={12}>
									<Tabs
										value={value}
										onChange={handleChange}
										indicatorColor="primary"
										textColor="primary"
										centered
									>
										{mSectionItem.map((i, index) => (
											<Tab
												classes={{
													root: classes.tabLabel,
													selected: classes.selected,
												}}
												key={index}
												label={i.tab.name}
											/>
										))}
									</Tabs>
									<div className={classes.tabContent}>
										{mSectionItem.map((i, index) => (
											<div
												key={index}
												style={{
													display:
														index === value
															? "block"
															: "none",
												}}
											>
												<section>
													<Typography
														component="h6"
														display="block"
														align="center"
														className={
															text.subtitle2
														}
													>
														{t("" + i.content)}
													</Typography>
													<div
														className={
															classes.illustrationCenter
														}
													>
														<figure
															className={clsx(
																classes.figure,
																classes.screen
															)}
														>
															<img
																src={`${
																	api.defaults
																		.baseURL
																}${i.image_path.substring(
																	1
																)}`}
																alt="screen"
															/>
														</figure>
													</div>
												</section>
											</div>
										))}
										<ParallaxLarge />
									</div>
								</Grid>
							</Grid>
						</div>
					</div>
				</ParallaxProvider>
			</Container>
		</div>
	);
}

Feature.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation(["saas-landing"])(Feature);
