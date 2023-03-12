const enums = require("../../common/enums");

module.exports = {
    name: "p2",
    active: true,
    url: "https://www.restaurangp2.se/lunch",
    scraperRules: [
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Monday,
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#monday tr"
            },
            label: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_type > p"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_description > p",
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Tuesday,
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#tuesday tr"
            },
            label: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_type > p"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_description > p"
            }
        },
        {

            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Wednesday,
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#wednesday tr"
            },
            label: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_type > p"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_description > p"
            },
        },
        {

            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Thursday,
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#thursday tr"
            },
            label: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_type > p"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_description > p"
            },
        },
        {

            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Friday,
            items: {
                selectorType: enums.SelectorType.CSS,
                selector: "#friday tr"
            },
            label: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_type > p"
            },
            dish: {
                selectorType: enums.SelectorType.CSS,
                selector: ".course_description > p"
            },
        },
    ]
};