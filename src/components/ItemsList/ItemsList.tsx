import "./ItemsList.css";
import { useReportContext } from "../../context/ReportContext";
import { getColor } from "../../utils/colors";
import type { AccountingReport } from "../../types/ReportTypes";

interface ItemsListProps {
  data: AccountingReport;
}

const ItemsList = ({ data }: ItemsListProps) => {
  const { selectedGroups, setSelectedGroups } = useReportContext();

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
      {sortedGroups.map((report) => {
        const isSelected = selectedGroups.includes(report.groupName);

        return (
          <li
            key={report.groupName}
            className={`items-list-item ${isSelected ? "active" : ""}`}
            onClick={() => toggleGroup(report.groupName)}
            style={{
              color: isSelected
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
