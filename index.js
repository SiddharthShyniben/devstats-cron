const {fetchAllUsers, updateUser} = require('./get-users');
const {fetchPostStats} = require('./get-post-stats');

(async () => {
	console.log('Starting...');
	const allUsers = await fetchAllUsers();
	console.log(allUsers.length, 'users found');

	allUsers.forEach(async user => {
		console.log('Fetching stats for user:', user.username);
		const postStats = await fetchPostStats(user.apiKey);
		updateUser(postStats, user.key);
	});
})();

