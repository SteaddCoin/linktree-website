import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import brand from "~/public/text/brand";
import logo from "~/public/images/saas-logo.svg";
import routeLink from "~/public/text/link";
import { withTranslation } from "~/i18n";
import { useText } from "~/theme/common";
import Checkbox from "./Checkbox";
import useStyles from "./form-style";
import { contactNumber } from "../../services/api";

function Contact(props) {
	const classes = useStyles();
	const text = useText();
	const { t } = props;
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [values, setValues] = useState({
		name: "",
		email: "",
		phone: "",
		company: "",
		message: "",
	});

	useEffect(() => {
		ValidatorForm.addValidationRule("isTruthy", (value) => value);
	});

	const [openNotif, setNotif] = useState(false);

	const [check, setCheck] = useState(false);

	const handleChange = (name) => (event) => {
		setValues({ ...values, [name]: event.target.value });
	};

	const handleCheck = (event) => {
		setCheck(event.target.checked);
	};

	const handleSubmit = () => {
		setNotif(true);
	};

	const handleClose = () => {
		setNotif(false);
	};

	const handleContact = () => {
		var url =
			`https://wa.me/${contactNumber}?text=` +
			"Nome: " +
			values.name +
			"%0a" +
			"Telemovel: " +
			values.phone +
			"%0a" +
			"Email: " +
			values.email +
			"%0a" +
			"Mensagem: " +
			values.message;
		window.open(url, "_blank").focus();
	};

	return (
		<div className={classes.pageWrap}>
			<Snackbar
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				key="top right"
				open={openNotif}
				autoHideDuration={4000}
				onClose={handleClose}
				ContentProps={{
					"aria-describedby": "message-id",
				}}
				message={<span id="message-id">Message Sent</span>}
			/>
			<Hidden mdUp>
				<div className={clsx(classes.logo, classes.logoHeader)}>
					<a href={routeLink.saas.home}>
						<img src={logo} alt="logo" />
						<Typography component="span" className={text.title}>
							{brand.saas.projectName}
						</Typography>
					</a>
				</div>
			</Hidden>
			<Container maxWidth="md" className={classes.innerWrap}>
				<IconButton
					href={routeLink.saas.home}
					className={classes.backtohome}
				>
					<i className="ion-ios-home-outline" />
					<i className="ion-ios-arrow-round-back" />
				</IconButton>
				<div className={classes.decoration}>
					<svg className={classes.leftDeco}>
						<use xlinkHref="/images/saas/deco-bg-left.svg#main" />
					</svg>
					<svg className={classes.rightDeco}>
						<use xlinkHref="/images/saas/deco-bg-right.svg#main" />
					</svg>
				</div>
				<Paper className={clsx(classes.formBox, "fragment-fadeUp")}>
					<div className={classes.fullFromWrap}>
						<Typography
							variant="h3"
							align="center"
							className={clsx(classes.title, text.title)}
							gutterBottom
						>
							{t("common:contact_title2")}
						</Typography>
						<Typography
							className={clsx(classes.desc, text.subtitle2)}
						>
							{t("common:contact_subtitle")}
						</Typography>
						<div className={classes.form}>
							<ValidatorForm
								onSubmit={handleSubmit}
								onError={(errors) => console.log(errors)}
							>
								<Grid container spacing={6}>
									<Grid item md={6} xs={12}>
										<TextValidator
											variant="filled"
											className={clsx(
												classes.input,
												classes.light
											)}
											label={t("common:form_name")}
											onChange={handleChange("name")}
											name="Name"
											value={values.name}
											validators={["required"]}
											errorMessages={[
												"This field is required",
											]}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextValidator
											variant="filled"
											className={clsx(
												classes.input,
												classes.light
											)}
											label={t("common:form_email")}
											onChange={handleChange("email")}
											name="Email"
											value={values.email}
											validators={["required", "isEmail"]}
											errorMessages={[
												"This field is required",
												"email is not valid",
											]}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextValidator
											variant="filled"
											className={clsx(
												classes.input,
												classes.light
											)}
											label={t("common:form_phone")}
											onChange={handleChange("phone")}
											name="Phone"
											value={values.phone}
										/>
									</Grid>
									<Grid item md={6} xs={12}>
										<TextValidator
											variant="filled"
											className={clsx(
												classes.input,
												classes.light
											)}
											label={t("common:form_company")}
											onChange={handleChange("company")}
											name="Company"
											value={values.company}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextValidator
											variant="filled"
											multiline
											rows="6"
											className={clsx(
												classes.input,
												classes.light
											)}
											label={t("common:form_message")}
											onChange={handleChange("message")}
											name="Message"
											value={values.message}
										/>
									</Grid>
								</Grid>
								<div
									className={clsx(
										classes.btnArea,
										classes.flex
									)}
								>
									<FormControlLabel
										control={
											<Checkbox
												validators={["isTruthy"]}
												errorMessages="This field is required"
												checked={check}
												value={check}
												onChange={(e) => handleCheck(e)}
												color="secondary"
											/>
										}
										label={
											<span>
												{t("common:form_terms")}
												<br />
												<a href="#">
													{t("common:form_privacy")}
												</a>
											</span>
										}
									/>
									<Button
										variant="contained"
										fullWidth={isMobile}
										type="submit"
										color="secondary"
										size="large"
										onClick={handleContact}
									>
										{t("common:form_send")}
									</Button>
								</div>
							</ValidatorForm>
						</div>
					</div>
				</Paper>
			</Container>
		</div>
	);
}

Contact.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation(["common"])(Contact);
