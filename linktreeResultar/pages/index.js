import Head from "next/head";
import styles from "../styles/Home.module.css";
import useSWR from "swr";
import List from "../components/List/List.js";
import Header from "../components/Header/Header.js";
import Register from "../components/Register";
import ReactAudioPlayer from "react-audio-player";
import api, { catchErr } from "../services/api";

const fetcher = (url) => api.get(url).then((r) => r.data);

function Home(props) {
	const { data, error } = useSWR("read-linktree/" + props.user, fetcher);
	if (error) {
		return <div>Falha ao mostrar o resultado!</div>;
	}
	if (!data) return <div>Loading...</div>;

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
