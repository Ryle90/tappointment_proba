import numberService from "../services/numberService.js";

const numberController = {
    async saveNumber(req, res, next) {
        const { number } = req.body;

        try {
            const savedNumber = await numberService.saveNumber(number);
            res.status(201);
            res.json({savedNumber});
        } catch (err) {
            next(err);
        }
    },

    async getNumber(req, res, next) {
        try {
            const number = await numberService.getNumber();
            res.json({number});
        } catch (err) {
            next(err);
        }
    }
}

export default numberController;