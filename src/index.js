import _get from "lodash.get";

export function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	}

	return parseJSONError(response);
}

function parseJSONError(response) {
	return new Promise((resolve, reject) => {
		//try to parse the JSON before erroring
		response.json().then(data => {
			//replace the existing body with the JSON response
			response.body = data;

			//try to look for a message or exception message - fall back to statusText
			const msg = _get(data, "message", _get(data, "exceptionMessage", response.statusText));

			let error = new Error(response.statusText);
			error.response = response;

			reject(error);
		}).catch(parseErr => {
			//there was an error trying to parse the JSON body (maybe it's not JSON?)
			//just ignore it and return an error with the original response without a parsed body
			let error = new Error(response.statusText);
			error.response = response;
			reject(error);
		});
	});
}

export function parseJSON(response) {
	return response.json();
}
