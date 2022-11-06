module.exports = {
    findPostByName: function(data, query) {
        return data.filter(val => val.title.toLowerCase().includes(query.toLowerCase()));
    },

    checkTitle: function(queries) {
        return queries?.results[0]?.title && queries.query && queries?.results[0]?.title === queries.query;
    }
}