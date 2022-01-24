const {Deta} = require('deta');
const deta = new Deta();

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

module.exports = {fetchAllUsers};
