const enums = require('../common/enums');
const dockansHamnkrog = require('./restaurants/dockans-hamnkrog');
const restaurangP2 = require('./restaurants/restaurang-p2');
const restaurangSpill = require('./restaurants/restaurang-spill');
const zenThai = require('./restaurants/zen-thai');

module.exports = {
    global: {
        filters: [
            {
                type: enums.FilterType.Trim
            }
        ]
    },
    sites: [
        dockansHamnkrog,
        restaurangP2,
        restaurangSpill,
        zenThai
    ]
};
