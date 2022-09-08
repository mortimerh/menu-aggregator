const enums = require("../../common/enums");

module.exports = {
    name: "Restaurang Spill",
    active: true,
    url: "https://restaurangspill.se/",
    scraperRules: [
        {
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#dagens"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ":scope > div > div.space-y-4 > div > div > div.space-y-4 > div"
            }
        },
        {
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#dagens"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Vegetarisk"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ":scope > div > div.space-y-4 > div > div > div.space-y-4 > p > div",
                filters: [{
                    type: enums.FilterType.RegExp,
                    argument: "(.+?)(?=\n)"
                }]
            }
        }
    ]
};