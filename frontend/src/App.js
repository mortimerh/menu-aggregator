import { useState, useEffect } from "react";
import { fetchMenus } from "./api";
import Tabs from "./components/Tabs";
import DailyMenus from "./components/DailyMenus";

export default function App() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    async function startFetching() {
      setMenus([]);
      const result = await fetchMenus();
      if (!ignore) {
        setMenus(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, []);

  function getDailyMenu(dayIndex) {
    // @todo menuData.filter()
    return menus;
  }


  return (
    <div className="app container">
      <h1 className="app-title is-size-4">Malmö Dockan</h1>
      <Tabs initialTabIndex={(new Date()).getDay() - 1}>
        <DailyMenus key={1} label={"Monday"} menus={getDailyMenu(1)} />
        <DailyMenus key={2} label={"Tuesday"} menus={getDailyMenu(2)} />
        <DailyMenus key={3} label={"Wednesday"} menus={getDailyMenu(3)} />
        <DailyMenus key={4} label={"Thursday"} menus={getDailyMenu(4)} />
        <DailyMenus key={5} label={"Friday"} menus={getDailyMenu(5)} />
        <DailyMenus key={6} label={"Saturday"} menus={getDailyMenu(6)} />
        <DailyMenus key={7} label={"Sunday"} menus={getDailyMenu(7)} />
      </Tabs>
    </div>
  );
}
