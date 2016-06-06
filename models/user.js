module.exports = function (sequlize, DataTypes) {
    return sequlize.define('user', {
        "email": {
            "type": DataTypes.STRING
            , "allowNull": false
            , "unique": true
            , "validate": {
                "isEmail": true
            }
        }
        , "password": {
            "type": DataTypes.STRING
            , "allowNull": false
            , "validate": {
                "len": [7, 100]
            }
        }
    });
};