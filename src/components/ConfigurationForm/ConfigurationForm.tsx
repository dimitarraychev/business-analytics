import "./ConfigurationForm.css";
import Button from "../Button/Button";
import CustomRadio from "../CustomRadio/CustomRadio";
import { useConfig } from "../../context/ConfigContext";
import nextIcon from "../../assets/next-icon.svg";

interface ConfigurationFormProps {
  setIsConfigOpen: (value: boolean) => void;
}

const ConfigurationForm = ({ setIsConfigOpen }: ConfigurationFormProps) => {
  const {
    metric,
    setMetric,
    groupBy,
    setGroupBy,
    timeRange,
    setTimeRange,
    aggregation,
    setAggregation,
  } = useConfig();

  return (
    <form className="configuration-form">
      <CustomRadio
        name="timeRange"
        label="Time Range:"
        value={timeRange}
        options={[
          { label: "Day", value: "day" },
          { label: "Week", value: "week", disabled: true },
          { label: "Month", value: "month", disabled: true },
        ]}
        onChange={(value) => setTimeRange(value)}
      />

      <CustomRadio
        name="groupBy"
        label="Group By:"
        value={groupBy}
        options={[
          { label: "Platform", value: "platform" },
          { label: "Endpoint", value: "endpoint" },
        ]}
        onChange={(value) => setGroupBy(value)}
      />

      <CustomRadio
        name="metric"
        label="Metric:"
        value={metric}
        options={[
          { label: "Total Bet", value: "totalBet" },
          { label: "Total Win", value: "totalWin" },
          { label: "Total Lost", value: "totalLost" },
          { label: "Total Win JP", value: "totalWinJackpot" },
          {
            label: "Total Win Progressive JP",
            value: "totalWinProgressiveJackpot",
          },
          { label: "# Games", value: "numberOfGames" },
          { label: "# Bets", value: "numberOfBets" },
          { label: "# Players", value: "numberOfPlayers" },
        ]}
        onChange={(value) => setMetric(value)}
      />

      <CustomRadio
        name="aggregation"
        label="Aggregation:"
        value={aggregation}
        options={[
          { label: "Period", value: "period" },
          { label: "Cumulative", value: "cumulative" },
        ]}
        onChange={(value) => setAggregation(value)}
      />

      <Button
        title="Next"
        text="Next"
        onClick={() => setIsConfigOpen(false)}
        icon={nextIcon}
      />
    </form>
  );
};

export default ConfigurationForm;
