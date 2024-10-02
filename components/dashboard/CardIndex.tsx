import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookCheck,
  CalendarCheck,
  CircleX,
  Contact,
  DollarSign,
  FolderOpenDot,
  Users,
} from "lucide-react";

const cardList = [
  {
    id: 1,
    title: "Jumlah Project",
    description: "Card Description",

    icon: <FolderOpenDot />,
  },
  {
    id: 2,
    title: "Jumlah Client",
    description: "Card Description",

    icon: <Contact />,
  },
  {
    id: 3,
    title: "Jumlah Employee",
    description: "Card Description",

    icon: <Users />,
  },
  {
    id: 4,
    title: "Jumlah Task",
    description: "Card Description",
    icon: <BookCheck />,
  },
  {
    id: 5,
    title: "Jumlah Pendapatan",
    description: "Card Description",
    icon: <DollarSign />,
  },
];

const CardIndex = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center justify-center">
      {cardList.map((card) => (
        <Card
          key={card.id}
          className="p-2 flex flex-col items-center justify-center"
        >
          <CardHeader className="flex items-center">
            {/* Render ikon di sini */}
            {card.icon}
            <div className="ml-2">
              {" "}
              {/* Memberi jarak antara ikon dan teks */}
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default CardIndex;
