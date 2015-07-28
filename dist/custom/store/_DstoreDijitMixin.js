define("custom/store/_DstoreDijitMixin", [
	'dojo/_base/declare',
	'dojo/dom-construct'
], function (declare, domConstruct) {
	function isValidEvent(store, event) {
		return !('track' in store) ||
			typeof event.previousIndex !== 'undefined' ||
			typeof event.index !== 'undefined';
	}

	function isWidget(item) {
		// The existence of a `postCreate` method on the item
		// will indicate that it's a widget
		return typeof item.postCreate === 'function';
	}

	return declare(null, {
		insertPosition: 'last',
		store: null,
		_storeEvents: null,
		_viewsByItem: null,

		constructor: function () {
			this._viewsByItem = [];
		},

		_destroyItem: function (/*number*/ previousIndex) {
			var renderedItem = this._viewsByItem.splice(previousIndex, 1)[0];

			if (renderedItem) {
				// Since Dijit does not provide an `isWidget` method,
				// we rely on duck typing...
				if (isWidget(renderedItem)) {
					renderedItem.destroyRecursive();
				} else {
					domConstruct.destroy(renderedItem);
				}
			}
		},

		_destroyItems: function () {
			// summary:
			//        Destroy currently rendered items

			this._viewsByItem = [];

			// preserve the item DOM while destroying widgets
			// so we can remove all item DOM nodes in one shot
			var preserveDom = true;
			this.destroyDescendants(preserveDom);

			domConstruct.empty(this.containerNode || this.domNode);
		},

		_insertItem: function (item, index) {
			var renderedItem = this._renderItem(item, index);
			var nextItem = this._viewsByItem[index];
			var position = nextItem ? 'before' : this.insertPosition;

			if (isWidget(renderedItem)) {
				renderedItem.placeAt(nextItem || this, position);
			}
			else {
				domConstruct.place(
					renderedItem,
					nextItem || this.containerNode || this.domNode,
					position
				);
			}

			this._viewsByItem.splice(index, 0, renderedItem);
		},

		_registerStoreEvents: function () {
			// summary:
			//        Add events listeners to the store to handle view changes.

			var store = this.store;

			if (store) {
				var self = this;
				this._storeEvents = [];
				this._storeEvents.push(store.on('add', function (event) {
					if (isValidEvent(store, event)) {
						self._insertItem(event.target, event.index);
					}
				}));
				this._storeEvents.push(store.on('update', function (event) {
					if (isValidEvent(store, event)) {
						self._destroyItem(event.previousIndex);
						self._insertItem(event.target, event.index);
					}
				}));
				this._storeEvents.push(store.on('delete', function (event) {
					if (isValidEvent(store, event)) {
						self._destroyItem(event.previousIndex);
					}
				}));
			}
		},

		_render: function () {
			// summary:
			//        Render the widget contents

			// destroy any existing items
			this._destroyItems();
			this._renderItems();
		},

		_renderItem: function (item, index) {
		    // returns: DomNode|dijit/_WidgetBase
		},

		_renderItems: function () {
			// summary:
			//        Render store results

			this.store && this.store.forEach(this._insertItem, this);
		},

		_setStoreAttr: function (store) {
			this._set('store', (store && store.track ? store.track() : store));

			if (this._storeEvents) {
				// Remove all event listeners from the old store so that
				// changes to it do not continue to update this widget.
				this._storeEvents.forEach(function (handle) {
				    handle.remove();
				});
				this._storeEvents = null;
			}

			if (store) {
				this._registerStoreEvents();
				this._render();
			}
		}
	});
});
