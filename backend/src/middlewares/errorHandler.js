import logger from '../logger.js';

export default (err, req, res, next) => {
    logger.error(
        `${err.status || 500} - ${err.name}: ${err.message} - ${req.originalUrl} - ${req.method
        } - ${req.ip}`,
    );
    res.status(err.status || 500);
    res.json({
        message:
            req.app.get('env') === 'development' || req.app.get('env') === 'test'
                ? `${err.name}: ${err.message}`
                : 'Unknown error happened',
    });
};