function notFound(req, res) {
    res.status(404).json({
        error: 'not implemented'
    });
}

module.exports = notFound;
