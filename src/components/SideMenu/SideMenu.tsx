import "./SideMenu.css";
import logo from "../../assets/logo.svg";
import menuLogo from "../../assets/menu.svg";
import ItemsList from "../ItemsList/ItemsList";
import ConfigurationForm from "../ConfigurationForm/ConfigurationForm";

interface SideMenuProps {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
}

const SideMenu = ({ isCollapsed, onCollapseToggle }: SideMenuProps) => {
  return (
    <div className={`side-menu ${isCollapsed ? "collapsed" : ""}`}>
      <div className="logo-wrapper">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="logo-text">Accounting Inspector</h1>
        <img
          src={menuLogo}
          alt="Menu"
          className="collapse-toggle"
          onClick={onCollapseToggle}
        />
      </div>

      <ConfigurationForm />
      {/* <ItemsList /> */}
    </div>
  );
};

export default SideMenu;
