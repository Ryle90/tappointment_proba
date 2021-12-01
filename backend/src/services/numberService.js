import fs from 'fs';
import fsPromises from 'fs/promises';

import ValidationError from '../utils/validationError.js';
import ContentError from '../utils/contentError.js';

const numberService = {
    async saveNumber(number) {
        if(!number && number !== 0) {
            throw new ValidationError('Missing number');
        }

        if (!this.checkIsValidNumber(number)) {
            throw new ValidationError('This is not a number');
        }

        await fsPromises.writeFile('number.txt', JSON.stringify(number));
        
        return number
    },

    async getNumber () {

        if(fs.existsSync('number.txt')) {
            const content = await fsPromises.readFile('number.txt');
            const number = JSON.parse(content);
            return number
        } else {
            throw new ContentError('There is not saved number')
        }
    },

    async deleteNumber() {
        if (fs.existsSync('number.txt')) {
            await fsPromises.unlink('number.txt');
        }
        return
    },

    checkIsValidNumber(number) {
        return typeof(number) === "number"
    }
}

export default numberService;