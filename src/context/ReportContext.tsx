import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  useRef,
} from "react";
import type { AccountingReport } from "../types/ReportTypes";
import { getDefaultRange } from "../utils/date";
import { useConfig } from "./ConfigContext";
import { fetchReport } from "../api/report";
// import { reportsExample } from "./reportsExample";

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
  clearSelections: () => void;
}

interface ReportContextProviderProps {
  children: ReactNode;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const ReportContextProvider = ({ children }: ReportContextProviderProps) => {
  const emptyReport: AccountingReport = {
    key: "",
    label: "",
    start: "2026-04-02T20:59:59.999Z",
    end: "2026-04-02T20:59:59.999Z",
    groupBy: "endpoint",
    metric: "totalBet",
    mode: "period",
    total: 0,
    groups: {},
    periods: [],
  };
  const [data, setData] = useState<AccountingReport>(emptyReport);

  const { metric, groupBy, aggregation, timeRange } = useConfig();

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [previousPeriods, setPreviousPeriods] = useState<AccountingReport[]>(
    [],
  );
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [loadingPeriods] = useState<string[]>([]);

  const defaultRange = getDefaultRange();
  const [timePeriodStart, setTimePeriodStart] = useState(defaultRange.start);
  const [timePeriodEnd, setTimePeriodEnd] = useState(defaultRange.end);

  const prevSelectedRef = useRef<string[]>([]);

  const getReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const reportData = await fetchReport(
        timePeriodStart,
        timePeriodEnd,
        timeRange,
        groupBy,
        metric,
        aggregation,
      );

      if (timeRange !== "day" && reportData.periods.length > 0) {
        return {
          ...reportData,
          periods: reportData.periods.slice(1),
        };
      }

      return reportData;
    } catch (err: any) {
      setError(err.message || "Failed to load report");
      return emptyReport;
    } finally {
      setLoading(false);
    }
  };

  const clearSelections = () => {
    setSelectedPeriods(() => []);
    setSelectedGroups(() => []);
  };

  useEffect(() => {
    clearSelections();

    const newRange = getDefaultRange(timeRange);
    setTimePeriodStart(newRange.start);
    setTimePeriodEnd(newRange.end);
  }, [timeRange]);

  useEffect(() => {
    clearSelections();

    // return setData(reportsExample as unknown as AccountingReport);

    const loadReport = async () => {
      const report = await getReportData();
      setData(report);
    };

    loadReport();
  }, [timePeriodStart, timePeriodEnd, groupBy, metric, aggregation]);

  useEffect(() => {
    if (selectedPeriods.length === 0) return;

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
        prev.filter((report) => !removedKeys.includes(report.key)),
      );
    }

    if (addedKeys.length > 0) {
      addedKeys.forEach(async (addedKey) => {
        let startUTC: Date;
        let endUTC: Date;

        if (timeRange === "day") {
          const [year, month, day] = addedKey.split("-").map(Number);
          startUTC = new Date(Date.UTC(year, month - 1, day, -3, 0, 0, 0));
          endUTC = new Date(Date.UTC(year, month - 1, day, 20, 59, 59, 999));
        } else if (timeRange === "month") {
          const [year, month] = addedKey.split("-").map(Number);
          startUTC = new Date(Date.UTC(year, month - 1, 1, -3, 0, 0, 0));
          const lastDay = new Date(year, month, 0).getDate();
          endUTC = new Date(
            Date.UTC(year, month - 1, lastDay, 20, 59, 59, 999),
          );
        } else if (timeRange === "week") {
          const [year, month, day] = addedKey.split("-").map(Number);
          startUTC = new Date(Date.UTC(year, month - 1, day, -3, 0, 0, 0));
          const weekEnd = new Date(startUTC);
          weekEnd.setUTCDate(startUTC.getUTCDate() + 7);
          weekEnd.setUTCHours(20, 59, 59, 999);
          endUTC = weekEnd;
        } else return;

        try {
          // return setPreviousPeriods((prev) => [
          //   ...prev,
          //   {
          //     ...reportsExample,
          //     key: "2026-04-15",
          //     label: "15 April 26",
          //     total: 3165289.23537679,
          //   },
          // ]);

          const report = await fetchReport(
            startUTC.toISOString(),
            endUTC.toISOString(),
            timeRange,
            groupBy,
            metric,
            aggregation,
          );
          setPreviousPeriods((prev) => [...prev, report]);
        } catch (err) {
          console.error("Failed to fetch period", err);
        }
      });
    }
  }, [selectedPeriods]);

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
    clearSelections,
  };

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error(
      "useReportContext must be used within a ReportContextProvider",
    );
  }
  return context;
};

export default ReportContextProvider;
