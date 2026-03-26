import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import type { AccountingReport } from "../types/ReportTypes";
import { getDefaultRange, parsePeriodToHours } from "../utils/date";
import { reportsExample } from "./reportsExample";

interface ReportContextType {
  data: AccountingReport;
  loading: boolean;
  error: string | null;
  selectedEndpoints: string[];
  setSelectedEndpoints: React.Dispatch<React.SetStateAction<string[]>>;
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
    totalBet: 0,
    totalWin: 0,
    endpoints: {},
    periods: [],
  });

  const [selectedEndpoints, setSelectedEndpoints] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultRange = getDefaultRange("6h");
  const [timePeriodStart, setTimePeriodStart] = useState(defaultRange.start);
  const [timePeriodEnd, setTimePeriodEnd] = useState(defaultRange.end);

  const BASE_URL = "/api/accounting-report/endpoints";

  const getReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (timePeriodStart) params.append("start", timePeriodStart);
      if (timePeriodEnd) params.append("end", timePeriodEnd);

      // fallback if end is missing and start is a relative period like "6h"
      if (!timePeriodEnd && timePeriodStart.includes("h")) {
        const hours = parsePeriodToHours(timePeriodStart);
        const startDate = new Date(Date.now() - hours * 60 * 60 * 1000);
        params.set("start", startDate.toISOString());
      }

      const res = await fetch(`${BASE_URL}?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch report: ${res.status}`);

      const reportData: AccountingReport = await res.json();
      setData(reportData);
    } catch (err: any) {
      setError(err.message || "Failed to load report");
      setData({
        start: "",
        end: "",
        totalBet: 0,
        totalWin: 0,
        endpoints: {},
        periods: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return setData(reportsExample as unknown as AccountingReport);
    getReport();
    const interval = setInterval(getReport, 5 * 60 * 1000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, [timePeriodStart, timePeriodEnd]);

  const contextValue: ReportContextType = {
    data,
    loading,
    error,
    selectedEndpoints,
    setSelectedEndpoints,
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
