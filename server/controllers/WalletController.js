import Wallet from '../models/Wallet';
import responses from '../utils/responses';
import tracelogger from '../logger/tracelogger';

/**
 * @description Defines the actions to for the users endpoints
 * @class UsersController
 */
class WalletController {
    /**
     *@description Creates a new wallet
     *@static
     *@param  {Object} req - request
     *@param  {object} res - response
     *@returns {object} - status code, message and created wallet
     *@memberof UsersController
     */
    static async newWallet(req, res) {
        const balance = 0;
        const {
            userPhoneNumber
        } = req.body;
        try {
            const user = await Wallet.findOne({userPhoneNumber});

            if (user) {
                return res.status(400).json(
                    responses.error(400, 'Sorry, this phone number is taken already')
                );
            }
            if (!user) {
                const userObject = {
                    userPhoneNumber,
                    balance,
                };
                const createdWallet = await Wallet.create(userObject);
                return res.status(201).json(
                    responses.success(201, 'Wallet created successfully', createdWallet)
                );
            }

        } catch (error) {
            tracelogger(error);
        }
    }
}
export default WalletController;
