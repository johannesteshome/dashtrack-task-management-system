const bcrypt = require("bcryptjs");
const { USER_PERMISSIONS } = require("../constants/constants");

const encrypt = async (data) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(data, salt);
};

const compare = async (data, encryptedData) => {
	console.log(data, encryptedData);
	return await bcrypt.compare(data, encryptedData);
};

// Compare the loggedin user id with the user id on which the operation is being performed
const checkOwnership = (loggedinUserId, userId) => {
	console.log("checkOwnership", loggedinUserId, userId);
	return loggedinUserId === userId;
};

const isAccountActive = (user) => {
	if (!user?.isactivated) {
		throw new Error(
			"This account is not ready for use. Please wait until it is activated"
		);
	}
};

const hasRoles = (userRoles, roles) => {
	for (let role of userRoles) {
		if (roles.includes(user.role)) {
			return true;
		}
	}

	return false;
};

const isTeamMember = (teamMembers, userId) => {
	return teamMembers.some((member) => member.member == userId);
};

const isProjectMember = (projectUsers, userId) => {
	return projectUsers.some(
		(userData) => userData.isInvitationAccepted && userData.user == userId
	);
};
const isProjectCreator = (creator, userId) => {
	return creator == userId;
};

const isProjectAdmin = (projectUsers, userId) => {
	return projectUsers.some(
		(userData) =>
			userData.isInvitationAccepted &&
			userData.user == userId &&
			userData.permissions.includes(USER_PERMISSIONS.WRITE)
	);
};

module.exports = {
	encrypt,
	compare,
	checkOwnership,
	isAccountActive,
	hasRoles,
	isTeamMember,
	isProjectCreator,
	isProjectMember,
	isProjectAdmin,
};
