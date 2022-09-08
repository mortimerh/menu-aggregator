// @fixme This is not the way to do enums
module.exports = {
    Days: {
        Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7
    },
    ScraperRuleType: {
        Daily: 0, Weekly: 1, Monthly: 2, Permanent: 3
    },
    FilterType: {
        RegExp: 0, Trim: 1
    },
    SelectorType: {
        CSS: 0, XPath: 1, Manual: 2
    }
}