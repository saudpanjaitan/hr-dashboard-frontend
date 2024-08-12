"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface HiringData {
  posisi_yang_dilamar: string;
  count: number;
  fill: string;
}

export default function AdminPage() {
  const [chartData, setChartData] = useState<HiringData[]>([]);
  const [totalApplicants, setTotalApplicants] = useState(0);

  useEffect(() => {
    const fetchHiringData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Handle unauthenticated state
          return;
        }

        const response = await fetch(
          "https://hr-dashboard-app-project.et.r.appspot.com/api/hiring",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch hiring data");
        }

        const hiringData = await response.json();

        // Process data for chart
        const positionCounts: { [key: string]: number } = {};
        hiringData.forEach((hiring: any) => {
          const position = hiring.posisi_yang_dilamar;
          positionCounts[position] = (positionCounts[position] || 0) + 1;
        });

        const colors = [
          "hsl(var(--chart-1))",
          "hsl(var(--chart-2))",
          "hsl(var(--chart-3))",
          "hsl(var(--chart-4))",
          "hsl(var(--chart-5))",
        ];
        const processedData = Object.entries(positionCounts).map(
          ([position, count], index) => ({
            posisi_yang_dilamar: position,
            count,
            fill: colors[index % colors.length],
          })
        );

        setChartData(processedData);
        setTotalApplicants(hiringData.length);
      } catch (error) {
        console.error("Error fetching hiring data:", error);
      }
    };

    fetchHiringData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Posisi yang Dilamar</CardTitle>
        <CardDescription>Distribusi Pelamar Berdasarkan Posisi</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="posisi_yang_dilamar"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({
                  viewBox,
                }: {
                  viewBox?: { cx?: number; cy?: number };
                }) => {
                  if (
                    viewBox &&
                    typeof viewBox.cx === "number" &&
                    typeof viewBox.cy === "number"
                  ) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        fill="var(--foreground)"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        <tspan
                          x={viewBox.cx}
                          dy="-0.5em"
                          fontSize="24"
                          fontWeight="bold"
                        >
                          {totalApplicants}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy="1.5em"
                          fontSize="12"
                          fill="var(--muted-foreground)"
                        >
                          Total Pelamar
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {chartData.length > 0 &&
            `Posisi terpopuler: ${chartData[0].posisi_yang_dilamar}`}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan distribusi pelamar berdasarkan posisi yang dilamar
        </div>
      </CardFooter>
    </Card>
  );
}
