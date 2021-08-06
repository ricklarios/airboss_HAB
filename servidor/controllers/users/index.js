// const {newUser} = require('./newUser');
const { validateUser } = require('./validateUser');
const { loginUser } = require('./loginUser');
const { editUser } = require('./editUser');
const { editUserPass } = require('./editUserPass');
const { recoverUserPass } = require('./recoverUserPass');
const { resetUserPass } = require('./resetUserPass');
const { deleteUser } = require('./deleteUser');
const { newUser } = require('./newUser');
const { validateToken } = require('./validateToken')
const { changeAvatar } = require('./changeAvatar');
module.exports = {
    validateUser,
    loginUser,
    editUser,
    editUserPass,
    recoverUserPass,
    resetUserPass,
    deleteUser,
    newUser,
    validateToken,
    changeAvatar
};
