var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../../backend/schema/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
