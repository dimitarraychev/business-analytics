import { useState, useEffect, useCallback } from "react";

export const useHoverClickTooltip = () => {
  const [tooltipTrigger, setTooltipTrigger] = useState<"hover" | "click">("hover");

  const handleChartClick = useCallback(() => {
    if (tooltipTrigger === "hover") {
      setTooltipTrigger("click");
    } else {
      setTooltipTrigger("hover");
    }
  }, [tooltipTrigger]);

  useEffect(() => {
    if (tooltipTrigger !== "click") return;

    const handleOutsideClick = () => setTooltipTrigger("hover");

    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [tooltipTrigger]);

  const resetTooltip = useCallback(() => setTooltipTrigger("hover"), []);

  return {
    tooltipTrigger,
    handleChartClick,
    resetTooltip,
  };
};