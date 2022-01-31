const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const DEV_API_BASE = 'https://dev.to/api/';

async function fetchPostStats(apiKey) {
	console.log('Fetching post stats for', apiKey);
	const posts = await fetchAllPosts(apiKey);

	return posts
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
	const res = await fetch(
		`${DEV_API_BASE}articles/me/published?per_page=100&page=${page}`,
		{
			headers: {
				'Content-Type': 'application/json',
				'api-key': apiKey,
			},
		},
	);
	const content = await res.json();
	const {status} = res;

	if (status === 401) {
		throw new Error('Invalid API key');
	}

	posts.push(...content);

	if (content.length > 0) {
		return posts.concat(await fetchAllPosts(apiKey, page + 1));
	}

	return posts;
}

module.exports = {
	fetchPostStats,
	fetchAllPosts
};
