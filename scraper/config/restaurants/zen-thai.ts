import { SelectorType, MenuItemType } from "../../../shared/enums";

module.exports = {
    name: "Zen Thai",
    active: true,
    url: "http://www.zenthai.se/",
    scraperRules: [
        {
            type: MenuItemType.Weekly,
            items: {
                selectorType: SelectorType.CSS,
                selector: "#page-zones__main-widgets__content > .bk-content-text > p",
            },
            label: {
                selectorType: SelectorType.CSS,
                selector: "strong",
            },

            dish: {
                selectorType: SelectorType.XPath,
                selector: "./strong/following::br/following::text()"
            }
        }
    ]
};