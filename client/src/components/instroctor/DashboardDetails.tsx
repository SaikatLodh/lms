import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";

const DashboardDetails = ({
  totalCourses,
  totalStudents,
  totalOrders,
  totalEarnings,
}: {
  totalCourses: number | undefined;
  totalStudents: number | undefined;
  totalOrders: number | undefined;
  totalEarnings: number | undefined;
}) => {
  const stats = [
    {
      title: "Total Courses",
      value: totalCourses,

      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Total Students",
      value: totalStudents,

      icon: <Users className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Total Orders",
      value: totalOrders,

      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    },
    {
      title: "Total Revenue",
      value: totalEarnings,

      icon: <Activity className="h-5 w-5 text-muted-foreground" />,
    },
  ];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
        {stats.map((item, idx) => (
          <Card key={idx} className=" border border-[#1A1B23] text-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default DashboardDetails;
