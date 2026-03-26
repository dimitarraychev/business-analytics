import { useConfig } from "../../context/ConfigContext";
import { useReportContext } from "../../context/ReportContext";
import { getColor } from "../../utils/colors";

const ItemsList = () => {
  const { data, selectedGroups, setSelectedGroups } = useReportContext();
  const { groupBy, metric } = useConfig();

  const groupTotals = data.groups;

  const sortedGroups = Object.entries(groupTotals)
    .map(([groupName, value]) => ({
      groupName,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const toggleGroup = (groupName: string) => {
    setSelectedGroups((prev: string[]) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName],
    );
  };

  return (
    <ul>
      <li className="items-list-header">
        <span>{groupBy}</span>
        <span>{metric}</span>
      </li>

      <li
        className={`items-list-item ${selectedGroups.length === 0 ? "active" : ""}`}
        onClick={() => setSelectedGroups([])}
      >
        <span>All</span>
        <span>{data.total.toFixed(2)}</span>
      </li>

      {sortedGroups.map((report) => (
        <li
          key={report.groupName}
          className={`items-list-item ${
            selectedGroups.includes(report.groupName) ? "active" : ""
          }`}
          onClick={() => toggleGroup(report.groupName)}
        >
          <span
            className="code-color"
            style={{
              backgroundColor: getColor(report.groupName),
              visibility: selectedGroups.includes(report.groupName)
                ? "visible"
                : "hidden",
            }}
          />
          <span>{report.groupName}</span>
          <span>{report.value.toFixed(2)}</span>
        </li>
      ))}
    </ul>
  );
};

export default ItemsList;
