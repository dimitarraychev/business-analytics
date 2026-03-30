import { useConfig } from "../../context/ConfigContext";
import { useReportContext } from "../../context/ReportContext";
import { getColor } from "../../utils/colors";
import { metricLabels } from "../../utils/metricLabels";

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
        <span>{metricLabels[metric]}</span>
      </li>

      <li
        className={`items-list-item ${selectedGroups.length === 0 ? "active" : ""}`}
        onClick={() => setSelectedGroups([])}
      >
        <span>All</span>
        <span>{data.total.toFixed(2)}</span>
      </li>

      {sortedGroups.map((report, index) => {
        const isCurrent = index === 0;
        const isSelected = selectedGroups.includes(report.groupName);

        return (
          <li
            key={report.groupName}
            className={`items-list-item ${isSelected ? "active" : ""}`}
            onClick={() => toggleGroup(report.groupName)}
            style={{
              color: isCurrent
                ? "var(--orange)"
                : isSelected
                  ? getColor(report.groupName)
                  : "var(--text-primary)",
            }}
          >
            <span>{report.groupName}</span>
            <span>{report.value.toFixed(2)}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemsList;
