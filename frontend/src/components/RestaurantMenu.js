import React from "react";

class RestaurantMenu extends React.Component {
    render() {
        return (
            <div className="panel">
                <h3 className="panel-heading">{this.props.menu.name}</h3>
                <div className="panel-block">
                    <ul>
                        {this.props.menu.results.map(dish => <li>{dish}</li>)}
                    </ul>
                </div>
            </div>
        );


    }
}
export default RestaurantMenu;