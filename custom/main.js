define([
	'dojo/parser',
	'custom/store/TrackableMemoryStore',
	'dijit/registry',

	'custom/widget/ListWidget',
	'dijit/form/Form',
	'dijit/form/Button',
	'dijit/form/TextBox',

	'dojo/domReady!'
], function (parser, TrackableMemoryStore, registry, ListWidget) {
	var store = new TrackableMemoryStore({
		idProperty: 'id'
	});

	parser.parse();

	var list = new ListWidget({
		store: store
	}, 'list').startup();

	var submitButton = registry.byId('submit');
	var textBox = registry.byId('text');

	submitButton.on('click', function (event) {
		// summary:
		//         add the entered text to the store and clear the text box
		event.preventDefault();

		store.add({
			text: textBox.get('value')
		});

		textBox.set('value', '');
	});
});
