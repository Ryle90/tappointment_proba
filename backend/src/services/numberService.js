import fs from 'fs';

import ValidationError from '../utils/validationError.js';

const numberService = {
    async saveNumber(number) {
        if(!number) {
            throw new ValidationError('Missing number');
        }
        fs.writeFileSync('number.txt', JSON.stringify(number));
        
        return number
    }
}

export default numberService;