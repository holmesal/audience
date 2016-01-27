export default log = {

    info: function() {
        console.info.apply(console, arguments);
    },

    warn: function() {
        console.warn.apply(console, arguments);
    },

    error: function() {
        console.error.apply(console, arguments);
    }
}