export default function requestToBackend(method, url, bodyContent = {}, token, controller) {
    const requestOptions = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyContent),
    };

    if (method === 'GET' || method === 'DELETE') {
        delete requestOptions.body;
    }

    if (token) {
        requestOptions.headers.Authorization = `Bearer ${token}`;
    }

    if (controller) {
        requestOptions.signal = controller.signal;
    }

    return fetch(url, requestOptions);
}