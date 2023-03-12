import React from "react";

class Tabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: this.props.initialTabIndex || 0
        }

        this.handleTabClick = this.handleTabClick.bind(this);
    }

    handleTabClick(tabIndex) {
        this.setState({
            activeTabIndex: tabIndex
        });

        // if (this.props.onTabClick) {
        //     this.props.onTabClick(tabIndex);
        // }
    }

    renderTabItem(title, index) {
        const isActive = (index === this.state.activeTabIndex);
        return (
            <li className={isActive ? "is-active" : ""} key={title}>
                <a href="#" onClick={() => this.handleTabClick(index)}>{title}</a>
            </li>
        )
    }

    render() {
        return (
            <div className="tabs">
                <ul>{this.props.tabs.map((tab, i) => this.renderTabItem(tab, i))}</ul>
            </div>
        );


    }
}
export default Tabs;