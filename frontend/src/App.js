import React from "react";
import Tabs from "./components/Tabs";


class App extends React.Component {
  render() {
    return (
      <div className="app container">
        <h1 className="app-title is-size-4">Dockan Lunch</h1>
        <Tabs tabs={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]} initialTabIndex={(new Date).getDay() - 1} />
      </div>
    );
  }
}

export default App;
