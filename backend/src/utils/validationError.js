export default class ValidationError extends Error {
    constructor(message, status = 404) {
        super(message);
        this.name = 'Validation error';
        this.status = status;
    }
}