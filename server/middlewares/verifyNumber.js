const verifyNumber = {
    numberChecker: (req, res, next) => {
        const {
            userPhoneNumber
        } = req.body;
        const validPhoneNumber = /^[0-9 +]+$/;
        if (userPhoneNumber) {
            if (!userPhoneNumber.match(validPhoneNumber)) {
                return res.status(400).json({
                    errors: ['Phone number can only be a number']
                });
            }
        }
        return next();
    }
};

export default verifyNumber;
