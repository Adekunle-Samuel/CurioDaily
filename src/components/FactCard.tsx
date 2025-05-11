
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Fact } from "@/data/facts";
import { cn } from "@/lib/utils";

interface FactCardProps {
  fact: Fact;
  colorClass: string;
}

const topicIcons: Record<string, string> = {
  science: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
  history: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300&q=80",
  geography: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=300&q=80",
  art: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80",
  technology: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=300&q=80",
  space: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=300&q=80",
  nature: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=300&q=80",
  food: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=300&q=80",
  sports: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=300&q=80",
  music: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=300&q=80"
};

const FactCard = ({ fact, colorClass }: FactCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get background image based on topic
  const backgroundImage = topicIcons[fact.topic] || '';

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 relative", 
      expanded ? "max-h-[1000px]" : "max-h-[450px]"
    )}>
      {/* Background image with overlay */}
      <div className="absolute top-0 left-0 w-full h-48 z-0">
        <img 
          src={backgroundImage} 
          alt={fact.topic}
          className="w-full h-full object-cover"
        />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-transparent to-white"
        )}></div>
      </div>

      <CardHeader className="pt-3 pb-1 relative z-10">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className={`h-5 w-5 text-${colorClass}`} />
            {fact.title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={cn(
              "border-2 capitalize", 
              `border-${colorClass} text-${colorClass}`
            )}
          >
            {fact.topic}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={cn(
        "relative z-10 pt-2",
        expanded ? "mt-32" : "mt-40"
      )}>
        {expanded ? (
          <p className="text-gray-700">{fact.fullDesc}</p>
        ) : (
          <p className="text-gray-700">{fact.shortDesc}</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end pt-0 relative z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className={cn(
            "border-2",
            `border-${colorClass} text-${colorClass} hover:bg-${colorClass}/10 hover:text-${colorClass}/80`
          )}
          onClick={toggleExpanded}
        >
          {expanded ? (
            <>
              <span>Show Less</span>
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>Read More</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FactCard;
