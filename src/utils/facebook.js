import _ from 'lodash';

// read permissions required by this app
export const requiredReadPermissions = ['user_friends', 'public_profile'];
export const desiredReadPermissions = requiredReadPermissions.concat(['email']);

console.info('required read permissions: ', requiredReadPermissions);
console.info('desired read permissions: ', desiredReadPermissions);