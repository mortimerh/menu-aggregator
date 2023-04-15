import RestaurantMenu from "./RestaurantMenu";

export default function DailyMenus({ menus }) {
    return (
        <div>
            {menus.map(menu => <RestaurantMenu menu={menu} />)}
        </div>
    );
}
