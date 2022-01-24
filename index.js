const {Deta} = require('deta');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const deta = new Deta();

// eslint-disable-next-line new-cap
const users = deta.Base('users');

const DEV_API_BASE = 'https://dev.to/api/';

(async () => {
	const allUsers = await fetchAllUsers();

	allUsers.forEach(async user => {
		const postStats = await fetchPostStats(user.apiKey);
		console.log({postStats});
	});
})()

async function fetchAllUsers(last = undefined) {
	const allUsers = [];
	const res = await users.fetch({last});

	if (res.items.length > 0) {
		allUsers.push(...res.items);
		allUsers.push(...fetchAllUsers(res.last));
	} else {
		return allUsers;
	}
}

function fetchPostStats(apiKey) {
	return fetchAllPosts(apiKey)
		.map(post => ({
			// Metadata
			title: post.title,
			url: post.url,
			date: post.published_timestamp,

			// Stats
			reactions: post.positive_reactions_count,
			views: post.page_views_count,
			comments: post.comments_count,
		}));
}

async function fetchAllPosts(apiKey, page = 1) {
	const posts = [];
	const {res, status} = await fetch(
		DEV_API_BASE + 'articles/me/published?per_page=100&page=' + page,
		{
			headers: new Headers({
				'Content-Type': 'application/json',
				'api-key': apiKey,
			}),
		},
	).then(res => ({res: res.json(), status: res.status}));

	if (status === 401) {
		throw new Error('Invalid API key');
	}

	posts.push(res);

	if (posts.length > 0) {
		posts.push(...fetchAllPosts(apiKey, page + 1));
	} else {
		return posts;
	}
}
