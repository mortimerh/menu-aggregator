import { MenuItem } from "./interfaces";
import { DayOfWeek, MenuItemType } from "./enums";

export function getDailyMenu(fullMenu: MenuItem[], weekday: DayOfWeek): MenuItem[] {
    return fullMenu.filter(menuItem => menuItem.qualifier == weekday || menuItem.type > MenuItemType.Daily);
}