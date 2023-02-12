function importAll(basePath) {
    require("fs").readdirSync(__dirname + '\\' + basePath).forEach(function (file) {
        require('./' + basePath + '/' + file);
    });
}

(async () => {
    try {
        const database = require('./db');
        importAll('model');
        importAll('relationships');
        // database.sequelize.query(
        //     'CREATE TRIGGER historyRegistry AFTER UPDATE ON rooms ' +
        //     'WHEN NEW.roomStatusId <> OLD.roomStatusId BEGIN INSERT INTO roomHistoryLog (id, createAt, updateAt,roomId,roomStatusId) ' +
        //     'VALUES (null, null, null,NEW.id, NEW.roomStatusId); END;'
        // );
        await database.sync();
    } catch (error) {
        console.log(error);
    }
})();