const UserModel = require('./models/UserModel');

const hasUserRated = async (ratedId, raterId) => {
    return new Promise((resolve, reject) => {
        UserModel.findById(ratedId)
            .then(user => {
                if (!user) {
                    console.log('User not found');
                    return false;
                }

                const raterIds = user.rating.map(rating => rating.raterId);
                const isUserRated = raterIds.includes(raterId);

                console.log(raterIds);
                console.log(isUserRated);

                if (isUserRated) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(error => {
                console.error('Error finding user:', error);
                reject(error);
            });
    })
}

module.exports = { hasUserRated }