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
    const key = data.key + "_" + groupName;

    setSelectedGroups((prev: string[]) =>
      prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key],
    );
  };

  return (
    <ul>
      {sortedGroups.map((report) => {
        const key = data.key + "_" + report.groupName;

        const isSelected = selectedGroups.includes(key);

        return (
          <li
            key={report.groupName}
            className={`items-list-item ${isSelected ? "active" : ""}`}
            onClick={() => toggleGroup(report.groupName)}
            style={{
              color: isSelected ? getColor(key) : "var(--text-primary)",
            }}
            title={report.groupName}
          >
            <span className="list-item-name">{report.groupName}</span>
            <span>
              €
              {new Intl.NumberFormat("en", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(report.value)}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default ItemsList;
