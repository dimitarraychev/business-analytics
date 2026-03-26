import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import type { AccountingReport } from "../types/ReportTypes";
import { getDefaultRange } from "../utils/date";
import { useConfig } from "./ConfigContext";
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
}

interface ReportContextProviderProps {
  children: ReactNode;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const ReportContextProvider = ({ children }: ReportContextProviderProps) => {
  const [data, setData] = useState<AccountingReport>({
    start: "",
    end: "",
    groupBy: "endpoint",
    metric: "totalBet",
    mode: "period",
    total: 0,
    groups: {},
    periods: [],
  });

  const { metric, groupBy, aggregation: mode } = useConfig();

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultRange = getDefaultRange();
  const [timePeriodStart, setTimePeriodStart] = useState(defaultRange.start);
  const [timePeriodEnd, setTimePeriodEnd] = useState(defaultRange.end);

  const getReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (timePeriodStart) params.append("start", timePeriodStart);
      if (timePeriodEnd) params.append("end", timePeriodEnd);

      params.append("groupBy", groupBy);
      params.append("metric", metric);
      params.append("mode", mode);

      const BASE_URL = "/api/accounting-report";
      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch report: ${res.status}`);

      const reportData: AccountingReport = await res.json();
      setData(reportData);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
      setData({
        start: "",
        end: "",
        groupBy: "endpoint",
        metric: "totalBet",
        mode: "period",
        total: 0,
        groups: {},
        periods: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // return setData(reportsExample as unknown as AccountingReport);
    getReport();
    const interval = setInterval(getReport, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [timePeriodStart, timePeriodEnd, groupBy, metric, mode]);

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
