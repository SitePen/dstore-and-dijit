define("custom/widget/ListWidget", [
	'dojo/_base/declare',
	'dojo/dom-construct',
	'dojo/on',
	'dojo/_base/lang',

	'dijit/_WidgetBase',
	'custom/store/_DstoreDijitMixin',

	'dojo/query'
], function (declare, domConstruct, on, lang, _WidgetBase, _DstoreDijitMixin) {
	return declare([_WidgetBase, _DstoreDijitMixin], {
		postCreate: function () {
			this.inherited(arguments);

			on(this, 'div:click', lang.hitch(this, 'removeItemFromStore'));
		},

		removeItemFromStore: function (event) {
			var id = parseFloat(event.target.id, 10);

			this.store.remove(id);
		},

		_renderItem: function (item, index) {
			return domConstruct.create('div', {
				textContent: item.text,
				id: item.id
			});
		}
	});
});
