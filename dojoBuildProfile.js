var profile = (function(){
		return {
				basePath: "",
				releaseDir: "./",
				releaseName: "dist",
				action: "release",

				packages:[ {
						name: "dojo",
						location: "dojo"
				}, {
						name: "dijit",
						location: "dijit"
				}, {
					name: "dstore",
					location: "dstore"
				}, {
						name: "custom",
						location: "custom",
						resourceTags: {
							amd: function (filename, mid) {
								return /^custom/.test(mid);
							}
						}
				} ],

				layers: {
						"dojo/dojo": {
								include: [ "dojo/dojo", "dojo/i18n", "dojo/domReady",
										"custom/main" ],
								boot: true
						}
				}
		};
})();
