const enums = require("../../common/enums");

module.exports = {
    name: "Dockans Hamnkrog",
    active: false,
    url: "https://dockanshamnkrog.se/lunchmeny/",
    scraperRules: [
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Monday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[text()='Måndag']"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Tuesday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[text()='Tisdag']"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Wednesday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[text()='Onsdag']"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Thursday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[text()='Torsdag']"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Friday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[text()='Fredag']"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Monday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'måndag')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens veg"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Tuesday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'tisdag')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens veg"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Wednesday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'onsdag')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens veg"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Thursday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'torsdag')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens veg"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Daily,
            day: enums.Days.Friday,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans veg') and contains(text(), 'fredag')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dagens veg"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Weekly,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans fisk')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Veckans fisk"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()[normalize-space()]"
            }
        },
        {
            type: enums.ScraperRuleType.Weekly,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Veckans kött')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Veckans kött"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        },
        {
            type: enums.ScraperRuleType.Weekly,
            items: {
                selectorType: enums.SelectorType.XPath,
                selector: "//*[@id='wrapper']//p/strong[contains(text(), 'Dockans räkmacka')]"
            },
            label: {
                selectorType: enums.SelectorType.Manual,
                selector: "Dockans räkmacka"
            },
            dish: {
                selectorType: enums.SelectorType.XPath,
                selector: "./following::text()"
            }
        }
    ]
};