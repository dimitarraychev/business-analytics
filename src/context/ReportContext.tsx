import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  useRef,
  useCallback,
} from "react";
import type { AccountingReport } from "../types/ReportTypes";
import { getDefaultRange } from "../utils/date";
import { useConfig } from "./ConfigContext";
import { fetchReport } from "../api/report";

interface ReportContextType {
  data: AccountingReport;
  loading: boolean;
  error: string | null;
  selectedGroups: string[];
  setSelectedGroups: React.Dispatch<React.SetStateAction<string[]>>;
  timePeriodStart: string;
  setTimePeriodStart: React.Dispatch<React.SetStateAction<string>>;
  timePeriodEnd: string;
  setTimePeriodEnd: React.Dispatch<React.SetStateAction<string>>;
  previousPeriods: AccountingReport[];
  loadingPeriods: string[];
  selectedPeriods: string[];
  setSelectedPeriods: React.Dispatch<React.SetStateAction<string[]>>;
}

interface ReportContextProviderProps {
  children: ReactNode;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const emptyReport: AccountingReport = {
  key: "",
  label: "",
  start: new Date().toISOString(),
  end: new Date().toISOString(),
  groupBy: "endpoint",
  metric: "totalBet",
  mode: "period",
  total: 0,
  groups: {},
  periods: [],
};

export const ReportContextProvider = ({
  children,
}: ReportContextProviderProps) => {
  const { metric, groupBy, aggregation, timeRange } = useConfig();

  const [data, setData] = useState<AccountingReport>(emptyReport);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previousPeriods, setPreviousPeriods] = useState<AccountingReport[]>(
    [],
  );
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [loadingPeriods] = useState<string[]>([]);

  const [timePeriodStart, setTimePeriodStart] = useState("");
  const [timePeriodEnd, setTimePeriodEnd] = useState("");

  const prevSelectedRef = useRef<string[]>([]);

  // Memoized fetch function to prevent stale closures in intervals
  const loadMainReport = useCallback(
    async (start: string, end: string) => {
      setLoading(true);
      setError(null);
      try {
        const reportData = await fetchReport(
          start,
          end,
          timeRange,
          groupBy,
          metric,
          aggregation,
        );

        // Remove the UTC "bleed" day for BG timezone if not in day mode
        if (timeRange !== "day" && reportData.periods.length > 0) {
          setData({
            ...reportData,
            periods: reportData.periods.slice(1),
          });
        } else {
          setData(reportData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load report");
      } finally {
        setLoading(false);
      }
    },
    [timeRange, groupBy, metric, aggregation],
  );

  // Handle TimeRange changes and Main Fetching
  useEffect(() => {
    const newRange = getDefaultRange(timeRange);
    setTimePeriodStart(newRange.start);
    setTimePeriodEnd(newRange.end);

    // Reset selections on range change
    setSelectedPeriods([]);
    setSelectedGroups([]);

    loadMainReport(newRange.start, newRange.end);

    const interval = setInterval(
      () => {
        loadMainReport(newRange.start, newRange.end);
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, [timeRange, groupBy, metric, aggregation, loadMainReport]);

  // Handle Comparison Periods (Comparison checkbox/selection)
  useEffect(() => {
    const prevSelected = prevSelectedRef.current;
    const addedKeys = selectedPeriods.filter(
      (key) => !prevSelected.includes(key),
    );
    const removedKeys = prevSelected.filter(
      (key) => !selectedPeriods.includes(key),
    );
    prevSelectedRef.current = selectedPeriods;

    if (removedKeys.length > 0) {
      setPreviousPeriods((prev) =>
        prev.filter((r) => !removedKeys.includes(r.key)),
      );
    }

    if (addedKeys.length > 0) {
      const fetchAdded = async () => {
        const fetchPromises = addedKeys.map((addedKey) => {
          let start: Date;
          let end: Date;

          // Use Local time constructors to handle BG -> UTC conversion properly
          if (timeRange === "day") {
            const [y, m, d] = addedKey.split("-").map(Number);
            start = new Date(y, m - 1, d, 0, 0, 0, 0);
            end = new Date(y, m - 1, d, 23, 59, 59, 999);
          } else if (timeRange === "month") {
            const [y, m] = addedKey.split("-").map(Number);
            start = new Date(y, m - 1, 1, 0, 0, 0, 0);
            end = new Date(y, m, 0, 23, 59, 59, 999);
          } else {
            const [y, m, d] = addedKey.split("-").map(Number);
            start = new Date(y, m - 1, d, 0, 0, 0, 0);
            end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
          }

          return fetchReport(
            start.toISOString(),
            end.toISOString(),
            timeRange,
            groupBy,
            metric,
            aggregation,
          );
        });

        try {
          const results = await Promise.all(fetchPromises);
          setPreviousPeriods((prev) => [...prev, ...results]);
        } catch (err) {
          console.error("Failed to fetch comparison periods", err);
        }
      };

      fetchAdded();
    }
  }, [selectedPeriods, timeRange, groupBy, metric, aggregation]);

  const contextValue: ReportContextType = {
    data,
    loading,
    error,
    selectedGroups,
    setSelectedGroups,
    timePeriodStart,
    setTimePeriodStart,
    timePeriodEnd,
    setTimePeriodEnd,
    previousPeriods,
    loadingPeriods,
    selectedPeriods,
    setSelectedPeriods,
  };

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context)
    throw new Error(
      "useReportContext must be used within a ReportContextProvider",
    );
  return context;
};

export default ReportContextProvider;
