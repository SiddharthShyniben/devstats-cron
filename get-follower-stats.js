const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const DEV_API_BASE = 'https://dev.to/api/';

async function getAllFollowers(apiKey, page = 1) {
	const followers = [];
	const res = await fetch(
		`${DEV_API_BASE}/followers/users?per_page=1000&sort=-created_at&page=${page}`,
		{
			headers: {
				'Content-Status': 'application/json',
				'api-key': apiKey,
			},
		},
	);

	const content = await res.json();
	const {status} = res;

	if (status === 401) {
		throw new Error('Invalid API key');
	}

	followers.push(...content);

	if (followers.length > 0) {
		return followers.concat(await getAllFollowers(apiKey, page + 1));
	}

	return followers;
}

module.exports = {getAllFollowers};
