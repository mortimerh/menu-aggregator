import { useState } from 'react';

export default function Tabs({ initialTabIndex, children }) {
    const [activeTabIndex, setActiveTabIndex] = useState(initialTabIndex || 0);

    function handleTabClick(tabIndex) {
        setActiveTabIndex(tabIndex);
    }

    function renderTabItem(title, index) {
        const isActive = (index === activeTabIndex);
        return (
            <li className={isActive ? "is-active" : ""} key={title}>
                <a href="#" onClick={() => handleTabClick(index)}>{title}</a>
            </li>
        )
    }


    return (
        <>
            <div className="tabs">
                <ul>{children.map((child, i) => renderTabItem(child.props.label, i))}</ul>
            </div>
            {children[activeTabIndex]}
        </>
    );
}
