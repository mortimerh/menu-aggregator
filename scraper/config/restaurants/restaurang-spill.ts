import { FilterType, SelectorType } from "../../../shared/enums";

module.exports = {
    name: "Restaurang Spill",
    active: true,
    url: "https://restaurangspill.se/",
    scraperRules: [
        {
            items: {
                selectorType: SelectorType.CSS,
                selector: "#dagens"
            },
            label: {
                selectorType: SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: SelectorType.CSS,
                selector: ":scope > div > div.space-y-4 > div > div > div.space-y-4 > div"
            }
        },
        {
            items: {
                selectorType: SelectorType.CSS,
                selector: "#dagens"
            },
            label: {
                selectorType: SelectorType.Manual,
                selector: "Vegetarisk"
            },
            dish: {
                selectorType: SelectorType.CSS,
                selector: ":scope > div > div.space-y-4 > div > div > div.space-y-4 > p > div",
                filters: [{
                    type: FilterType.RegExp,
                    argument: "(.+?)(?=\n)"
                }]
            }
        }
    ]
};