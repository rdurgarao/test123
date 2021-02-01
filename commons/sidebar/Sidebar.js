import React, { Component } from "react";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  handleClick(item) {
    const element = document.querySelector("#" + item);
    element.scrollIntoView();
  }

  render() {
    return <div className="profile100-more">{this.sidebar}</div>;
  }

  get sidebar() {
    let self = this;
    return Object.keys(this.props.sidebarData).map(function(key) {
      let group = self.props.sidebarData[key];

      return (
        <ul className="form-nav-list sidebar-navigation" key={key}>
          <h6 className="form-nav-list-heading">{key}</h6>
          {Object.keys(group).map((itemKey, item) => {
            return (
              <li className="form-nav-list-item" key={group[itemKey][1]}>
                <i className={group[itemKey][0]} aria-hidden="true"></i>
                {group[itemKey][2] && (
                  <Link to={group[itemKey][1]} className="fieldset-link">
                    {itemKey}
                  </Link>
                )}
                {!group[itemKey][2] && (
                  <button
                    href="#"
                    className="fieldset-link"
                    data-fieldset={group[itemKey][1]}
                    onClick={self.handleClick.bind(self, group[itemKey][1])}
                  >
                    {itemKey}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      );
    });
  }
}

export default Sidebar;
