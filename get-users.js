const {Deta} = require('deta');
const deta = new Deta();

// eslint-disable-next-line new-cap
const users = deta.Base('users');

async function fetchAllUsers(last = undefined) {
	console.log('Fetching users from', last);
	const allUsers = [];
	const res = await users.fetch({last});

	allUsers.push(...res.items);

	if (res.last) {
		allUsers.push(...await fetchAllUsers(res.last));
	} else {
		return allUsers;
	}
}

function updateUser(updates, key) {
	const update = {
		postStats: users.util.append(updates.postStats),
		followers: updates.followers,
		followerCount: updates.followers.length,
	};

	var util = require('util');

	util.inspect(update, false, 2, true)

	return users.update(update, key);
}

module.exports = {fetchAllUsers, updateUser};
