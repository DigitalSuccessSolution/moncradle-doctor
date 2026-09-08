"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface GrowthCurveChartProps {
  records?: Array<any>;
  chartType?: "weight" | "height" | "both" | "all";
  currentWeight?: number;
  currentHeight?: number;
  ageInMonths?: number;
}

export default function GrowthCurveChart({
  records = [],
  chartType,
  currentWeight,
  currentHeight,
  ageInMonths,
}: GrowthCurveChartProps) {
  // Process the records to format the date and prepare for recharts
  const chartData = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((r) => {
        let formattedDate = "";
        try {
          const date = new Date(r.createdAt);
          if (!isNaN(date.getTime())) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            formattedDate = `${months[date.getMonth()]} ${date.getDate()}`;
          }
        } catch (e) {
          formattedDate = String(r.createdAt);
        }

        return {
          date: formattedDate,
          weight: r.weight !== undefined && r.weight !== null ? Number(r.weight) : null,
          height: r.height !== undefined && r.height !== null ? Number(r.height) : null,
        };
      });
  }, [records]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-slate-400 text-sm">
        No growth data available to display chart.
      </div>
    );
  }

  const showWeight = !chartType || chartType === "weight" || chartType === "both" || chartType === "all";
  const showHeight = !chartType || chartType === "height" || chartType === "both" || chartType === "all";
  const isDualAxis = showWeight && showHeight;

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            dy={10}
          />
          
          {/* Left Y-Axis */}
          {showWeight && (
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              dx={-10}
            />
          )}
          {!showWeight && showHeight && (
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              dx={-10}
            />
          )}
          
          {/* Right Y-Axis for Height in dual mode */}
          {isDualAxis && (
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              dx={10}
            />
          )}
          
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ fontWeight: 'bold', color: '#334155', marginBottom: '4px' }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
          />
          
          {/* Weight Line */}
          {showWeight && (
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              name="Weight (kg)" 
              stroke="#20c997" 
              strokeWidth={2}
              activeDot={{ r: 6, fill: "#20c997", stroke: "#fff", strokeWidth: 2 }}
              dot={{ r: 4, fill: "#fff", stroke: "#20c997", strokeWidth: 2 }}
            />
          )}
          
          {/* Height Line */}
          {showHeight && (
            <Line 
              yAxisId={isDualAxis ? "right" : "left"}
              type="monotone" 
              dataKey="height" 
              name="Height (cm)" 
              stroke="#339af0" 
              strokeWidth={2}
              activeDot={{ r: 6, fill: "#339af0", stroke: "#fff", strokeWidth: 2 }}
              dot={{ r: 4, fill: "#fff", stroke: "#339af0", strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
