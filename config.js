const { FilterType, ScraperRuleType, Days, SelectorType } = require('./enums');

module.exports = {
    screenshotsOutputDir: "./screenshots",
    sites: [
        {
            name: "Zen Thai",
            active: true,
            url: "http://www.zenthai.se/",
            scraperRules: [
                {
                    type: ScraperRuleType.Weekly,
                    items: {
                        selectorType: SelectorType.CSS,
                        selector: "#page-zones__main-widgets__content > .bk-content-text > p",
                    },
                    label: {
                        selectorType: SelectorType.CSS,
                        selector: "strong",
                    },
                    dish: {
                        selectorType: SelectorType.CSS,
                        selector: ":scope",
                        filters: [{
                            type: FilterType.RegExp,
                            argument: "(?:\\n|\n)(.+)"
                        }]
                    }
                }
            ]
        },
        {
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
                        filters: [{
                            type: FilterType.Override,
                            argument: "Dagens"
                        }],
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
                        filters: [{
                            type: FilterType.Override,
                            argument: "Vegetarisk"
                        }],
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
        },
        {
            name: "p2",
            active: true,
            url: "https://www.restaurangp2.se/lunch",
            scraperRules: [
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Monday,
                    items: {
                        selectorType: SelectorType.CSS,
                        selector: "#monday tr"
                    },
                    label: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_type > p"
                    },
                    dish: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_description > p",
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Tuesday,
                    items: {
                        selectorType: SelectorType.CSS,
                        selector: "#tuesday tr"
                    },
                    label: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_type > p"
                    },
                    dish: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_description > p"
                    }
                },
                {

                    type: ScraperRuleType.Daily,
                    day: Days.Wednesday,
                    items: {
                        selectorType: SelectorType.CSS,
                        selector: "#wednesday tr"
                    },
                    label: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_type > p"
                    },
                    dish: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_description > p"
                    },
                },
                {

                    type: ScraperRuleType.Daily,
                    day: Days.Thursday,
                    items: {
                        selectorType: SelectorType.CSS,
                        selector: "#thursday tr"
                    },
                    label: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_type > p"
                    },
                    dish: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_description > p"
                    },
                },
                {

                    type: ScraperRuleType.Daily,
                    day: Days.Friday,
                    items: {
                        selectorType: SelectorType.CSS,
                        selector: "#friday tr"
                    },
                    label: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_type > p"
                    },
                    dish: {
                        selectorType: SelectorType.CSS,
                        selector: ".course_description > p"
                    },
                },
            ]
        }]
};
