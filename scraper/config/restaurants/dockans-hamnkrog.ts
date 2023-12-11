import { SelectorType, MenuItemType, DayOfWeek } from "../../../shared/enums";

module.exports = {
    name: "Dockans Hamnkrog",
    active: false,
    url: "https://dockanshamnkrog.se/lunchmeny/",
    scraperRules: [
        {
            type: MenuItemType.Daily,
            day: DayOfWeek.Monday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Tuesday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Wednesday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Thursday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Friday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Monday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Tuesday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Wednesday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Thursday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Friday,
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
            type: MenuItemType.Weekly,
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
            type: MenuItemType.Weekly,
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
            type: MenuItemType.Weekly,
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
};