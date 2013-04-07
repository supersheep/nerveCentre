var require_engine = require('../../lib/require-engine');
var renderer = require('../../lib/renderer');

exports.render = function(info) {
    return renderer.render(info.route.template, info.data);
};

