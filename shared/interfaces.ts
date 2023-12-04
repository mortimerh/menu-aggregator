import { DayOfWeek, MenuItemType } from "./enums";

export interface MenuItem {
    type: MenuItemType;
    qualifier?: DayOfWeek;
    label: string;
    dish: string;
}

export interface RestaurantMenu {
    name: string;
    url: string;
    lastScraped: Date;
    lastScrapeSuccess: boolean;
    lastChanged: Date;
    menu: MenuItem[];
}

