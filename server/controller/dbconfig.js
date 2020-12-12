const QueryOpts = {
    new: true,
    runValidators: true,
    useFindAndModify: false,
    context: "query", // esta opcion es para que reemplace un valor unique
};

module.exports = {
    QueryOpts,
};