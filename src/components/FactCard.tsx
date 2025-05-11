
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Fact } from "@/data/facts";
import { cn } from "@/lib/utils";

interface FactCardProps {
  fact: Fact;
  colorClass: string;
}

const FactCard = ({ fact, colorClass }: FactCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300", 
      expanded ? "max-h-[1000px]" : "max-h-72",
      colorClass ? `border-l-4 border-l-${colorClass}` : ""
    )}>
      <CardHeader className={cn("pb-2", `bg-${colorClass}/10`)}>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className={`h-5 w-5 text-${colorClass}`} />
          {fact.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {expanded ? (
          <p className="text-gray-700">{fact.fullDesc}</p>
        ) : (
          <p className="text-gray-700">{fact.shortDesc}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-0">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`text-${colorClass} hover:text-${colorClass}/80 hover:bg-${colorClass}/10`}
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
