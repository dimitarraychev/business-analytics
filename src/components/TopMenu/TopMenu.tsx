import "./TopMenu.css";
import prevArrow from "../../assets/prev-arrow.svg";
import nextArrow from "../../assets/next-arrow.svg";
import { useReportContext } from "../../context/ReportContext";
import { formatDate } from "../../utils/date";
import { useConfig } from "../../context/ConfigContext";

const TopMenu = () => {
  const {
    timePeriodStart,
    timePeriodEnd,
    setTimePeriodStart,
    setTimePeriodEnd,
  } = useReportContext();
  const { timeRange } = useConfig();

  const start = timePeriodStart ? new Date(timePeriodStart) : null;
  const end = timePeriodEnd ? new Date(timePeriodEnd) : null;

  const getDuration = () => {
    if (!start || !end) return 0;
    return end.getTime() - start.getTime();
  };

  const handlePrev = () => {
    if (!start || !end) return;

    const now = new Date();
    const isToday = end.toDateString() === now.toDateString();

    let newStart: Date;
    let newEnd: Date;

    if (isToday) {
      const duration = end.getTime() - start.getTime();
      newStart = new Date(start.getTime() - duration);
      newEnd = new Date(end.getTime() - duration);
    } else {
      switch (timeRange) {
        case "day":
          newEnd = new Date(start);
          newEnd.setHours(0, 0, 0, 0);
          newStart = new Date(newEnd);
          newStart.setDate(newEnd.getDate() - 1);
          break;
        default:
          const dur = end.getTime() - start.getTime();
          newStart = new Date(start.getTime() - dur);
          newEnd = new Date(end.getTime() - dur);
      }
    }

    setTimePeriodStart(newStart.toISOString());
    setTimePeriodEnd(newEnd.toISOString());
  };

  const handleNext = () => {
    if (!start || !end) return;

    const duration = getDuration();
    const now = new Date();

    let newStart = new Date(start.getTime() + duration);
    let newEnd = new Date(end.getTime() + duration);

    if (newEnd > now) {
      newEnd = now;
      newStart = new Date(now.getTime() - duration);
    }

    setTimePeriodStart(newStart.toISOString());
    setTimePeriodEnd(newEnd.toISOString());
  };

  const disableNext = () => {
    if (!end) return true;

    const duration = getDuration();
    const now = new Date();

    return end.getTime() + duration >= now.getTime();
  };

  return (
    <div className="top-menu">
      <div className="arrow-wrapper">
        <img
          src={prevArrow}
          alt="previous"
          className="arrow prev-arrow"
          onClick={handlePrev}
        />
      </div>

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

export default TopMenu;
