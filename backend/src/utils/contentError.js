export default class ContentError extends Error {
    constructor(message, status = 404) {
        super(message);
        this.name = 'Content error';
        this.status = status;
    }
}