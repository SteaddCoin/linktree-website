import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import clsx from "clsx";
import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { useText } from "~/theme/common";
import { withTranslation } from "~/i18n";
import ParallaxMedium from "../Parallax/Medium";
import illustration from "~/public/images/saas/faq.png";
import Title from "../Title";
import useStyles from "./faq-style";
import api from "../../services/api";

const faqData = [
	{
		q: "Pellentesque ac bibendum tortor?",
		a: "Vivamus sit amet interdum elit. Proin lacinia erat ac velit tempus auctor. ",
	},
	{
		q: "In mi nulla, fringilla vestibulum?",
		a: "Vivamus sit amet interdum elit. Proin lacinia erat ac velit tempus auctor. ",
	},
	{
		q: "Quisque lacinia purus ut libero?",
		a: "Vivamus sit amet interdum elit. Proin lacinia erat ac velit tempus auctor. ",
	},
	{
		q: "Quisque ut metus sit amet augue?",
		a: "Vivamus sit amet interdum elit. Proin lacinia erat ac velit tempus auctor. ",
	},
	{
		q: "Pellentesque ac bibendum tortor?",
		a: "Vivamus sit amet interdum elit. Proin lacinia erat ac velit tempus auctor. ",
	},
];

function Faq(props) {
	const classes = useStyles();
	const text = useText();
	const [expanded, setExpanded] = useState(0);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const [questions, setQuestions] = useState([]);
	const [questionSec, setQuestionSec] = useState({});

	const [user, setUser] = useState("");

	useEffect(() => {
		setUser(window.location.host.split(".")[0].split(":")[0]);
	}, []);

	useEffect(() => {
		api.get("read-question/" + user)
			.then((r) => {
				setQuestions(r.data);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	useEffect(() => {
		api.get("read-questions/" + user)
			.then((r) => {
				setQuestionSec(r.data);
			})
			.catch((e) => {
				if (e.response?.status === 404) {
				}
			});
	}, [user]);

	const { t } = props;
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};
	return (
		<div className={classes.root}>
			<Container fixed>
				<Grid container spacing={6}>
					<Grid item md={6}>
						<Title align={isMobile ? "center" : "left"}>
							<strong>{questionSec.title}</strong>
						</Title>
						<Typography
							className={clsx(classes.text, text.subtitle2)}
							align={isMobile ? "center" : "left"}
							component="p"
						>
							{t("" + questionSec.content)}
						</Typography>
						<Hidden smDown>
							<div className={classes.illustration}>
								<ParallaxMedium />
								<img src={illustration} alt="illustration" />
							</div>
						</Hidden>
					</Grid>
					<Grid item md={6}>
						<div className={classes.accordion}>
							{questions.map((item, index) => (
								<div
									className={classes.item}
									key={index.toString()}
								>
									<Accordion
										classes={{
											root: classes.paper,
										}}
										expanded={expanded === index}
										onChange={handleChange(index)}
									>
										<AccordionSummary
											classes={{
												content: classes.content,
												expanded: classes.expanded,
											}}
										>
											<Typography
												className={classes.heading}
											>
												{item.question}
											</Typography>
											<ExpandMoreIcon
												className={classes.icon}
											/>
										</AccordionSummary>
										<AccordionDetails
											classes={{
												root: classes.detail,
											}}
										>
											<Typography
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<img
													width="50px"
													height="50px"
													src={`${
														api.defaults.baseURL
													}${item.image_path.substring(
														1
													)}`}
												/>
												{item.answer}
											</Typography>
										</AccordionDetails>
									</Accordion>
								</div>
							))}
						</div>
					</Grid>
				</Grid>
			</Container>
		</div>
	);
}

Faq.propTypes = {
	t: PropTypes.func.isRequired,
};

export default withTranslation(["saas-landing"])(Faq);
