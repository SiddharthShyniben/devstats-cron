const {fetchAllUsers, updateUser} = require('./get-users');
const {fetchPostStats} = require('./get-post-stats');
const {getAllFollowers} = require('./get-follower-stats');

(async () => {
	console.log('Starting...');
	const allUsers = await fetchAllUsers();
	console.log(allUsers.length, 'users found');

	allUsers.forEach(async user => {
		console.log('Fetching stats for user:', user.username);
		const postStats = await fetchPostStats(user.apiKey);
		const followers = await getAllFollowers(user.apiKey);

		updateUser({postStats, followers}, user.key);

		console.log(followers.length, 'followers found');
	});
})();

