import React from "react";
import Tabs from "./components/Tabs";
import DailyMenus from "./components/DailyMenus";

class App extends React.Component {
  state = {
    menus: []
  };

  getDailyMenu(dayIndex) {
    // @todo menuData.filter()
    return this.state.menus;
  }

  componentDidMount() {
    let ignore = false;
    this.setState({ menus: [] });
    this.fetchMenus().then(result => {
      if (!ignore) {
        this.setState({ menus: result });
      }
    });
    return () => {
      ignore = true;
    };
  }

  async fetchMenus() {
    const response = await fetch(process.env.REACT_APP_MENUS_DATA_URL);
    const data = await response.json();

    console.log(data);

    return data;
  }

  render() {
    return (
      <div className="app container">
        <h1 className="app-title is-size-4">Malmö Dockan</h1>
        <Tabs tabs={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]} initialTabIndex={(new Date()).getDay() - 1}>
          <DailyMenus key={1} label={"Monday"} menus={this.getDailyMenu(1)} />
          <DailyMenus key={2} label={"Tuesday"} menus={this.getDailyMenu(2)} />
          <DailyMenus key={3} label={"Wednesday"} menus={this.getDailyMenu(3)} />
          <DailyMenus key={4} label={"Thursday"} menus={this.getDailyMenu(4)} />
          <DailyMenus key={5} label={"Friday"} menus={this.getDailyMenu(5)} />
          <DailyMenus key={6} label={"Saturday"} menus={this.getDailyMenu(6)} />
          <DailyMenus key={7} label={"Sunday"} menus={this.getDailyMenu(7)} />
        </Tabs>
      </div>
    );
  }
}

export default App;
