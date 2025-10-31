"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = {
  daily: [
    { date: "00:00", pnl: 15000 },
    { date: "03:00", pnl: 15200 },
    { date: "06:00", pnl: 15100 },
    { date: "09:00", pnl: 15300 },
    { date: "12:00", pnl: 15400 },
    { date: "15:00", pnl: 15250 },
    { date: "18:00", pnl: 15500 },
    { date: "21:00", pnl: 15600 },
  ],
  weekly: [
    { date: "Mon", pnl: 14000 },
    { date: "Tue", pnl: 14500 },
    { date: "Wed", pnl: 14200 },
    { date: "Thu", pnl: 14800 },
    { date: "Fri", pnl: 15000 },
    { date: "Sat", pnl: 15200 },
    { date: "Sun", pnl: 15500 },
  ],
  monthly: [
    { date: "Week 1", pnl: 12000 },
    { date: "Week 2", pnl: 13000 },
    { date: "Week 3", pnl: 14000 },
    { date: "Week 4", pnl: 15500 },
  ],
  all_time: [
    { date: "Jan", pnl: 10000 },
    { date: "Feb", pnl: 11000 },
    { date: "Mar", pnl: 12500 },
    { date: "Apr", pnl: 12000 },
    { date: "May", pnl: 13000 },
    { date: "Jun", pnl: 14000 },
    { date: "Jul", pnl: 15000 },
    { date: "Aug", pnl: 15500 },
  ],
};

export default function PnlChart({ timeframe }: { timeframe: "daily" | "weekly" | "monthly" | "all_time" }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data[timeframe]}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="pnl" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}