var consecutiveNumber = 0;

var Util = {
  serializeArray: function (form) {
    var serialized = [];
    // https://github.com/jquery/jquery/blob/2.1-stable/src/serialize.js#L12
    var rCRLF = /\r?\n/g,
      rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
      rsubmittable = /^(?:input|select|textarea|keygen)/i,
      rcheckableType = /^(?:checkbox|radio)$/i;

    var nodeIterator = document.createNodeIterator(
      form,
      NodeFilter.SHOW_ELEMENT,
      function (node) {
        // The .serializeArray() method uses the standard W3C rules for
        // successful controls to determine which elements it should include;
        // in particular the element cannot be disabled and must contain a name
        // attribute. No submit button value is serialized since the form was
        // not submitted using a button. Data from file select elements is not
        // serialized.
        var type = node.type;

        return node.name &&
          !node.disabled &&
          rsubmittable.test(node.nodeName) &&
          !rsubmitterTypes.test(type) &&
          (node.checked || !rcheckableType.test(type))
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
      },
      false
    );
    var field;
    /*eslint-disable no-cond-assign */
    while (field = nodeIterator.nextNode()) {
      var val = field.value.replace(rCRLF, "\r\n");
      if (field.type === "number") {
        let number = parseFloat(val);
        val = !isNaN(number) ? number : val;
      }
      if (field.type === "checkbox") {
        val = !!val;
      }
      if (val != null) {
        serialized.push({name: field.name, value: val});
      }
    }
    /*eslint-enable no-cond-assign */
    return serialized;
  },
  initKeyValue: function (obj, key, value) {
    if (obj[key] === undefined) {
      obj[key] = value;
    }
  },
  isArray: Array.isArray || function (obj) {
    return toString.call(obj) === "[object Array]";
  },
  isNumber: function (obj) {
    return toString.call(obj) === "[object Number]";
  },
  isString: function (obj) {
    return toString.call(obj) === "[object String]";
  },
  isObject: function (obj) {
    return toString.call(obj) === "[object Object]";
  },
  isEmptyString: function (str) {
    return this.isString(str) && (str == null || str === "");
  },
  hasClass: function (element, className) {
    return element.className &&
      element.className.match(/\S+/g).indexOf(className) > -1;
  },
  noop: function () {},
  extendObject: function (...sources) {
    return Object.assign({}, ...sources);
  },
  getUniqueId: function () {
    return ++consecutiveNumber;
  },
  detectObjectPaths: function (obj, startKey, excludePaths = []) {
    var paths = [];

    var detect = (o, p) => {
      if (!this.isObject(o)) {
        paths.push(p);
      } else {
        Object.keys(o).forEach((key) => {
          let path = p != null
            ? `${p}.${key}`
            : key;
          if (excludePaths.indexOf(path) === -1) {
            detect(o[key], path);
          } else {
            paths.push(path);
          }
        });
      }
    };

    if (startKey != null) {
      detect(obj[startKey], startKey);
    } else {
      detect(obj);
    }

    return paths;
  }
};

module.exports = Util;
