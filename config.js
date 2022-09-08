const { FilterType, ScraperRuleType, Days} = require('./enums');

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
                    itemSelector: "#page-zones__main-widgets__content > .bk-content-text > p",
                    labelSelector: "strong",
                    dishSelector: ":scope",
                    dishFilters: [{
                        type: FilterType.RegExp,
                        argument: "(?:\\n|\n)(.+)"
                    }]
                }
            ]
        },
        {
            name: "Restaurang Spill",
            active: true,
            url: "https://restaurangspill.se/",
            scraperRules: [
                {
                    itemSelector: "#dagens",
                    labelFilters: [{
                        type: FilterType.Override,
                        argument: "Dagens"
                    }],
                    dishSelector: ":scope > div > div.space-y-4 > div > div > div.space-y-4 > div"
                },
                {
                    itemSelector: "#dagens",
                    labelFilters: [{
                        type: FilterType.Override,
                        argument: "Vegetarisk"
                    }],
                    dishSelector: ":scope > div > div.space-y-4 > div > div > div.space-y-4 > p > div",
                    dishFilters: [{
                        type: FilterType.RegExp,
                        argument: "(.+?)(?=\n)"
                    }]
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
                    itemSelector: "#monday tr",
                    labelSelector: ".course_type > p",
                    dishSelector: ".course_description > p",
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Tuesday,
                    itemSelector: "#tuesday tr",
                    labelSelector: ".course_type > p",
                    dishSelector: ".course_description > p",
                },
                {

                    type: ScraperRuleType.Daily,
                    day: Days.Wednesday,
                    itemSelector: "#wednesday tr",
                    labelSelector: ".course_type > p",
                    dishSelector: ".course_description > p",
                },
                {

                    type: ScraperRuleType.Daily,
                    day: Days.Thursday,
                    itemSelector: "#thursday tr",
                    labelSelector: ".course_type > p",
                    dishSelector: ".course_description > p",
                },
                {

                    type: ScraperRuleType.Daily,
                    day: Days.Friday,
                    itemSelector: "#friday tr",
                    labelSelector: ".course_type > p",
                    dishSelector: ".course_description > p",
                },
            ]
        }]
};
