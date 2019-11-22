!function (e) {
	!function t(n) {
		const [d, o] = e[n], r = {
			exports: {}
		};
		return d((function (e) {
			return t(o[e])
		}), r, r.exports), r.exports
	}("177c8080-0d0e-11ea-87de-f97528a25b5b")
}({
	"177c8080-0d0e-11ea-87de-f97528a25b5b": [function (e, t, n) {
		"use strict";
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		var d = e("./world"),
			o = e("./random"),
			r = function () {
				return "hello " + d.default() + " " + o.default()
			};
		console.log(r()), n.default = r
	}, {
		"./world": "177de010-0d0e-11ea-87de-f97528a25b5b",
		"./random": "177e2e30-0d0e-11ea-87de-f97528a25b5b"
	}],
	"177de010-0d0e-11ea-87de-f97528a25b5b": [function (e, t, n) {
		"use strict";
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		n.default = function () {
			return "world"
		}
	}, {}],
	"177e2e30-0d0e-11ea-87de-f97528a25b5b": [function (e, t, n) {
		"use strict";
		Object.defineProperty(n, "__esModule", {
			value: !0
		});
		n.default = function () {
			return "I am working"
		}
	}, {}]
});