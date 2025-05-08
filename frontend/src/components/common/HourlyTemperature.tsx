import type { Forecast } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  // CartesianGrid,
} from "recharts";
import { format } from "date-fns";

interface HourlyForecastData {
  data?: Forecast | null;
}

interface ChartData {
  time: string;
  temp: number;
  feels_like: number;
}

const HourlyTemperature = ({ data }: HourlyForecastData) => {
  if (!data) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Today's Temperature</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <p>Loading temperature data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData: ChartData[] = data.list.slice(0, 8).map((item) => ({
    time: format(new Date(item.dt * 1000), "ha"),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
  }));

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Today's Temperature</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[400px] h-[250px]  w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              {/* <CartesianGrid strokeDasharray="3 3" opacity={0.2} /> */}
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}°`}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col ">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Temperature
                            </span>
                            <span className="font-bold ">
                              {payload[0]?.value}°
                            </span>
                          </div>
                          <div className="flex flex-col ">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Feels Like
                            </span>
                            <span className="font-bold">
                              {payload[1]?.value}°
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="feels_like"
                stroke="#7dd3fc"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default HourlyTemperature;
