import fs from 'fs';

import ValidationError from '../utils/validationError.js';
import ContentError from '../utils/contentError.js';

const numberService = {
    async saveNumber(number) {
        if(!number) {
            throw new ValidationError('Missing number');
        }

        if (!this.checkIsValidNumber(number)) {
            throw new ValidationError('This is not a number');
        }

        fs.writeFileSync('number.txt', JSON.stringify(number));
        
        return number
    },

    async getNumber () {

        if(fs.existsSync('number.txt')) {
            const number = JSON.parse(fs.readFileSync('number.txt'));
            return number
        } else {
            throw new ContentError('There is not saved number')
        }
    },

    checkIsValidNumber(number) {
        return typeof(number) === "number"
    }
}

export default numberService;