import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Calendar, Filter, Download, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AnalyticsSection = () => {
    // Mock Data
    const impressionData = [
        { name: "Mon", value: 4000 },
        { name: "Tue", value: 3000 },
        { name: "Wed", value: 2000 },
        { name: "Thu", value: 2780 },
        { name: "Fri", value: 1890 },
        { name: "Sat", value: 2390 },
        { name: "Sun", value: 3490 },
    ];

    const clickData = [
        { name: "Mon", value: 240 },
        { name: "Tue", value: 139 },
        { name: "Wed", value: 980 },
        { name: "Thu", value: 390 },
        { name: "Fri", value: 480 },
        { name: "Sat", value: 380 },
        { name: "Sun", value: 430 },
    ];

    const deviceData = [
        { name: "Mobile", value: 400 },
        { name: "Desktop", value: 300 },
        { name: "Tablet", value: 300 },
        { name: "Digital Signage", value: 200 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/95 border border-border p-3 rounded-lg shadow-lg backdrop-blur-sm">
                    <p className="font-semibold mb-1">{label}</p>
                    <p className="text-primary text-sm">
                        {payload[0].value.toLocaleString()} {payload[0].name === "value" ? "Impressions" : payload[0].name}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold font-display">Analytics Dashboard</h2>
                    <p className="text-muted-foreground mt-1">
                        Track your campaign performance and audience engagement.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Last 7 Days
                    </Button>
                    <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { title: "Total Impressions", value: "124.5K", change: "+12.5%", trend: "up" },
                    { title: "Total Clicks", value: "3,240", change: "-2.4%", trend: "down" },
                    { title: "Avg. CTR", value: "2.6%", change: "+0.8%", trend: "up" },
                    { title: "Spend", value: "$1,240", change: "+5.2%", trend: "up" },
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border/50 rounded-xl p-6">
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                        <div className="flex items-end justify-between mt-2">
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <div className={cn(
                                "flex items-center text-sm font-medium",
                                stat.trend === "up" ? "text-green-500" : "text-red-500"
                            )}>
                                {stat.trend === "up" ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Impressions Chart */}
                <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Impressions Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={impressionData}>
                                <defs>
                                    <linearGradient id="colorImpression" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#888"
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorImpression)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Clicks Chart */}
                <div className="bg-card border border-border/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6">Daily Engagement</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={clickData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#888"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#888"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
                                <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-card border border-border/50 rounded-xl p-6 lg:col-span-2">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="w-full md:w-1/3">
                            <h3 className="text-lg font-semibold mb-2">Device Distribution</h3>
                            <p className="text-muted-foreground text-sm mb-6">
                                See where your audience interacts with your ads most frequently.
                            </p>
                            <div className="space-y-4">
                                {deviceData.map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                            />
                                            <span className="text-sm">{entry.name}</span>
                                        </div>
                                        <span className="font-semibold">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-[300px] w-full md:w-2/3">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsSection;
