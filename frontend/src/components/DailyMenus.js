import React from "react";
import RestaurantMenu from "./RestaurantMenu";

class DailyMenus extends React.Component {
    render() {
        return (
            <div>
                {this.props.menus.map(menu => <RestaurantMenu menu={menu}/>)}
            </div>
        );


    }
}
export default DailyMenus;