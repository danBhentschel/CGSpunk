var QueryStringHelper =
(function() {
    'use strict';

    // http://stackoverflow.com/a/11774985/3119991
    function getParameter(url, name) {
        let queryString = /^[^#?]*(\?[^#]+|)/.exec(url)[1];
        return getParameterByName(queryString, name);
    }
    
    function getParameterByName(queryString, name) {
        name = name.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
        let regex = new RegExp('(?:[?&]|^)' + name + '=([^&#]*)');
        let results = regex.exec(queryString);
        return decodeURIComponent(results[1].replace(/\+/g, ' ')) || '';
    }

    return new function() {
        let helper = this;

        helper.getParameter = getParameter;
    };
})();
