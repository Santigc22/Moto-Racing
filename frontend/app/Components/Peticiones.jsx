"use client";

import { useRouter } from "next/navigation";

const datapostputdelget = async (url, data, method) => {
	let result = "";
	if (method === "GET") {
		result = await fetch(`https://moto-racing.onrender.com${url}`, {
			method: method,
			headers: {
				"access-control-allow-origin": "*",
				"Content-Type": "application/json",
			},
		});
	} else {
		result = await fetch(`https://moto-racing.onrender.com${url}`, {
			method: method,
			headers: {
				"access-control-allow-origin": "*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
	}

	const dataResult = await result.json();

	if (url === "login") {
		const newToken = await Encryptdata(result.headers.get("authorization"));
		dataResult.token = newToken;
	}

	console.log("dataResult  ", dataResult);

	return dataResult;
};

///////////////////////////////////////

const datapostputdelgetNOJSON = async (url, data, method) => {
	let result = "";
	if (method === "GET") {
		result = await fetch(`https://moto-racing.onrender.com${url}`, {
			method: method,
			headers: {
				"access-control-allow-origin": "*",
			},
		});
	} else {
		result = await fetch(`https://moto-racing.onrender.com${url}`, {
			method: method,
			headers: {
				"access-control-allow-origin": "*",
			},
			body: data,
		});
	}

	const dataResult = await result.json();

	if (url === "login") {
		const newToken = await Encryptdata(result.headers.get("authorization"));
		dataResult.token = newToken;
	}

	return dataResult;
};

export { datapostputdelget, datapostputdelgetNOJSON };
