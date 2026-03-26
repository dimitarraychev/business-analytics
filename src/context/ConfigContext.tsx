import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  AggregationMode,
  GroupByType,
  MetricType,
  TimeRangeType,
  ViewByType,
} from "../types/ConfigTypes";

interface ConfigContextType {
  metric: MetricType;
  setMetric: (metric: MetricType) => void;
  groupBy: GroupByType;
  setGroupBy: (groupBy: GroupByType) => void;
  timeRange: TimeRangeType;
  setTimeRange: (timeRange: TimeRangeType) => void;
  aggregation: AggregationMode;
  setAggregation: (aggregation: AggregationMode) => void;
  viewBy: ViewByType;
  setViewBy: (viewBy: ViewByType) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfig must be used within ConfigProvider");
  return context;
};

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [metric, setMetric] = useState<MetricType>("totalBet");
  const [groupBy, setGroupBy] = useState<GroupByType>("endpoint");
  const [timeRange, setTimeRange] = useState<TimeRangeType>("day");
  const [aggregation, setAggregation] = useState<AggregationMode>("period");
  const [viewBy, setViewBy] = useState<ViewByType>("group");

  return (
    <ConfigContext.Provider
      value={{
        metric,
        setMetric,
        groupBy,
        setGroupBy,
        timeRange,
        setTimeRange,
        aggregation,
        setAggregation,
        viewBy,
        setViewBy,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
