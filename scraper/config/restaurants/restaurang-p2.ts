import { SelectorType, MenuItemType, DayOfWeek } from "../../../shared/enums";

module.exports = {
    name: "p2",
    active: true,
    url: "https://www.restaurangp2.se/lunch",
    scraperRules: [
        {
            type: MenuItemType.Daily,
            day: DayOfWeek.Monday,
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
            type: MenuItemType.Daily,
            day: DayOfWeek.Tuesday,
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

            type: MenuItemType.Daily,
            day: DayOfWeek.Wednesday,
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

            type: MenuItemType.Daily,
            day: DayOfWeek.Thursday,
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

            type: MenuItemType.Daily,
            day: DayOfWeek.Friday,
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
};