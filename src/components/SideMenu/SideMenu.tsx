import { useState } from "react";
import "./SideMenu.css";
import logo from "../../assets/logo.svg";
import menuLogo from "../../assets/menu.svg";
import prevIcon from "../../assets/prev-icon.svg";
import ConfigurationForm from "../ConfigurationForm/ConfigurationForm";
import PeriodItemsList from "../PeriodsItemsList/PeriodsItemsList";

interface SideMenuProps {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

const SideMenu = ({ isCollapsed, onCollapseToggle }: SideMenuProps) => {
  const [isConfigOpen, setIsConfigOpen] = useState(true);

  return (
    <div className={`side-menu ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="logo-text">Business Analytics</h1>

        <div className="btns-wrapper">
          {!isCollapsed && !isConfigOpen && (
            <img
              src={prevIcon}
              alt="Back"
              className="back-icon"
              onClick={() => setIsConfigOpen(true)}
              title="Back"
            />
          )}
          <img
            src={menuLogo}
            alt="Menu"
            className="collapse-toggle"
            onClick={onCollapseToggle}
            title="Menu"
          />
        </div>
      </div>

      {isConfigOpen && <ConfigurationForm setIsConfigOpen={setIsConfigOpen} />}
      {!isConfigOpen && <PeriodItemsList />}
    </div>
  );
};

export default SideMenu;
