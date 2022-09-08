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
                        selectorType: SelectorType.XPath,
                        selector: "./strong/following::br/following::text()"
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
        },
        {
            name: "Dockans Hamnkrog",
            active: true,
            url: "https://dockanshamnkrog.se/lunchmeny/",
            scraperRules: [
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Monday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[text()='Måndag']"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Tuesday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[text()='Tisdag']"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Wednesday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[text()='Onsdag']"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Thursday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[text()='Torsdag']"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Friday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[text()='Fredag']"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Monday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'måndag')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens veg"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Tuesday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'tisdag')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens veg"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Wednesday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'onsdag')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens veg"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Thursday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'torsdag')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens veg"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Daily,
                    day: Days.Friday,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'fredag')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dagens veg"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Weekly,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans fisk')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Veckans fisk"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()[normalize-space()]"
                    }
                },
                {
                    type: ScraperRuleType.Weekly,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans kött')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Veckans kött"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
                    }
                },
                {
                    type: ScraperRuleType.Weekly,
                    items: {
                        selectorType: SelectorType.XPath,
                        selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Dockans räkmacka')]"
                    },
                    label: {
                        selectorType: SelectorType.Manual,
                        selector: "Dockans räkmacka"
                    },
                    dish: {
                        selectorType: SelectorType.XPath,
                        selector: "./following::text()"
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
