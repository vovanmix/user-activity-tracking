function notFound(req, res) {
    res.status(404).json({
        error: 'not implented'
    });
}

module.exports = notFound;
