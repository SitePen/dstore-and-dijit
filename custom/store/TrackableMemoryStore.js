define([
	'dojo/_base/declare',
	'dstore/Memory',
	'dstore/Trackable'
], function (declare, Memory, Trackable) {
	return declare([Memory, Trackable]);
});
