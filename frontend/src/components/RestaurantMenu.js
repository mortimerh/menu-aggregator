export default function RestaurantMenu({ menu }) {
    return (
        <div className="panel">
            <h3 className="panel-heading">{menu.name}</h3>
            <div className="panel-block">
                <ul>
                    {menu.results.map(dish => <li>{dish}</li>)}
                </ul>
            </div>
        </div>
    );
}
