import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import useSWR from "swr";
import List from "../components/List/List.js";
import Header from "../components/Header/Header.js";
import Register from "../components/Register";
import ReactAudioPlayer from "react-audio-player";
import api, { catchErr } from "../services/api";

const fetcher = (url) => api.get(url).then((r) => r.data);

function Home(props) {
	const [data, setData] = useState({});

	useEffect(() => {
		api.get("read-linktree/" + props.user)
			.then((r) => setData(r.data))
			.catch((e) => e.toJSON());
	}, []);

	if (Object.keys(data).length == 0) {
		return <h1>Loading ...</h1>;
	}

	return (
		<div className={styles.container}>
			<Header
				file_path={props.file_path}
				title={data.title.name}
				link={data.title.url}
			/>
			<ul>
				{data.links.map((p, i) => (
					<List key={i} links={p} />
				))}
				<div
					dangerouslySetInnerHTML={{
						__html: `<p>${data.content}</p>
`,
					}}
				></div>
			</ul>
			<Register />
			<ReactAudioPlayer src="lka.m4a" autoPlay controls loop />
		</div>
	);
}

Home.getInitialProps = async ({ req }) => {
	let file_path = undefined;
	let user = req.headers.host.split(".")[0].split(":")[0];
	file_path = await api
		.get("read-logo/" + user)
		.then((r) => {
			return r.data.file_path;
		})
		.catch((e) => {
			if (e.response?.status == 400) return undefined;
			catchErr(e, () => {});
		});

	let url = api.defaults.baseURL;
	return { file_path: url + file_path, user: user };
};

export default Home;
