import Tab from "../Tab/Tab";
import "./TabsMenu.css";
import prevArrow from "../../assets/prev-arrow.svg";
import nextArrow from "../../assets/next-arrow.svg";
import { useReportContext } from "../../context/ReportContext";
import { formatDate, parsePeriodToHours } from "../../utils/date";

interface TabsMenuProps {
  tabs: string[];
  selectedTab: string;
  changeSelectedTab: (tab: string) => void;
}

const TabsMenu = ({ tabs, selectedTab, changeSelectedTab }: TabsMenuProps) => {
  const {
    timePeriodStart,
    timePeriodEnd,
    setTimePeriodStart,
    setTimePeriodEnd,
  } = useReportContext();

  const getTabDurationMs = (tab: string) =>
    parsePeriodToHours(tab) * 60 * 60 * 1000;

  const updateTimePeriod = (
    tab: string,
    start: Date | null,
    end: Date | null,
  ) => {
    const safeStart = start ?? new Date(Date.now() - getTabDurationMs(tab));
    const safeEnd = end ?? new Date();

    changeSelectedTab(tab);
    setTimePeriodStart(safeStart.toISOString());
    setTimePeriodEnd(safeEnd.toISOString());
  };

  const handleTabClick = (tab: string) => {
    const now = new Date();
    const duration = getTabDurationMs(tab);
    const start = new Date(now.getTime() - duration);
    updateTimePeriod(tab, start, now);
  };

  const handlePrev = () => {
    const duration = getTabDurationMs(selectedTab);

    const start = timePeriodStart
      ? new Date(timePeriodStart)
      : new Date(Date.now() - duration);
    const end = timePeriodEnd ? new Date(timePeriodEnd) : new Date();

    const newStart = new Date(start.getTime() - duration);
    const newEnd = new Date(end.getTime() - duration);

    updateTimePeriod(selectedTab, newStart, newEnd);
  };

  const handleNext = () => {
    const duration = getTabDurationMs(selectedTab);

    const start = timePeriodStart
      ? new Date(timePeriodStart)
      : new Date(Date.now() - duration);
    const end = timePeriodEnd ? new Date(timePeriodEnd) : new Date();
    const now = new Date();

    let newStart = new Date(start.getTime() + duration);
    let newEnd = new Date(end.getTime() + duration);

    if (newEnd > now) {
      newEnd = now;
      newStart = new Date(now.getTime() - duration);
    }

    updateTimePeriod(selectedTab, newStart, newEnd);
  };

  const disableNext = () => {
    const duration = getTabDurationMs(selectedTab);
    const end = new Date(timePeriodEnd);
    const now = new Date();

    return end.getTime() + duration >= now.getTime();
  };

  return (
    <div className="tabs-menu">
      <div className="arrow-wrapper">
        <img
          src={prevArrow}
          alt="previous"
          className="arrow prev-arrow"
          onClick={handlePrev}
        />
      </div>

      {tabs.map((tab) => (
        <Tab
          key={tab}
          text={tab}
          title={tab}
          isSelected={selectedTab === tab}
          onClick={() => handleTabClick(tab)}
        />
      ))}

      <div className={`arrow-wrapper ${disableNext() ? "disabled" : ""}`}>
        <img
          src={nextArrow}
          alt="next"
          className="arrow next-arrow"
          onClick={disableNext() ? undefined : handleNext}
        />
      </div>

      <div className="times-wrapper">
        <p>
          <span className="time-label">From:</span>{" "}
          <span>{formatDate(timePeriodStart)}</span>
        </p>
        <p>
          <span className="time-label">To:</span>{" "}
          <span>{formatDate(timePeriodEnd)}</span>
        </p>
      </div>
    </div>
  );
};

export default TabsMenu;
