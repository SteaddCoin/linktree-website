import axios from "axios";

const api = axios.create({
	baseURL: "http://steadd.com:8000",
});

export const catchErr = (e, fofH) => {
	if (e.response?.status === 404) {
		fofH();
	}

	if (e.response?.status === 401) {
		window.location.href = "/admin";
	}
};

export const contactNumber = "";

export default api;
