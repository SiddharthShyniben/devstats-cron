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

function updateUser(...args) {
	return users.update(...args);
}

module.exports = {fetchAllUsers, updateUser};
