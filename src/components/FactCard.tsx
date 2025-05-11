
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { Fact } from "@/data/facts";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FactCardProps {
  fact: Fact;
  colorClass: string;
}

// Define contextual images for specific facts based on their IDs
const factImages: Record<number, string> = {
  // Science
  1: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=600&q=80", // Human DNA
  2: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&w=600&q=80", // Quantum computers
  
  // History
  3: "https://images.unsplash.com/photo-1605980817660-086bc9eecdb1?auto=format&fit=crop&w=600&q=80", // Shortest war
  4: "https://images.unsplash.com/photo-1608754482805-6f630357358b?auto=format&fit=crop&w=600&q=80", // Great Wall of China
  
  // Geography
  5: "https://images.unsplash.com/photo-1562911791-c7a97b729ec5?auto=format&fit=crop&w=600&q=80", // Sahara Desert
  6: "https://images.unsplash.com/photo-1504245493802-d32f160638be?auto=format&fit=crop&w=600&q=80", // Mount Everest
  
  // Art
  7: "https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=600&q=80", // Mona Lisa
  8: "https://images.unsplash.com/photo-1598121634244-5046024cf5ef?auto=format&fit=crop&w=600&q=80", // Vincent van Gogh
  
  // Technology
  9: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80", // Internet creation
  10: "https://images.unsplash.com/photo-1501696461415-6bd6660c6742?auto=format&fit=crop&w=600&q=80", // First smartphone
  
  // Space
  11: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?auto=format&fit=crop&w=600&q=80", // Black hole
  12: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?auto=format&fit=crop&w=600&q=80", // Mars
  
  // Nature
  13: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?auto=format&fit=crop&w=600&q=80", // Amazon Rainforest
  14: "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?auto=format&fit=crop&w=600&q=80", // Bees
  
  // Food
  15: "https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=80", // Chocolate
  16: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80", // Pizza
  
  // Sports
  17: "https://images.unsplash.com/photo-1521731978332-9e9d09f22555?auto=format&fit=crop&w=600&q=80", // Olympic Games
  18: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80", // Soccer/Football
  
  // Music
  19: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80", // Beatles
  20: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80", // Mozart
};

// Fallback topic images if no specific fact image is found
const topicIcons: Record<string, string> = {
  science: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  history: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  geography: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=600&q=80",
  art: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  technology: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80",
  space: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=600&q=80",
  nature: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=600&q=80",
  food: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=600&q=80",
  sports: "https://images.unsplash.com/photo-1452960962994-acf4fd70b632?auto=format&fit=crop&w=600&q=80",
  music: "https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=600&q=80"
};

const FactCard = ({ fact, colorClass }: FactCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get contextual image based on fact ID, or fall back to topic image
  const backgroundImage = factImages[fact.id] || topicIcons[fact.topic] || '';

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 relative", 
      expanded ? "max-h-[1000px]" : "max-h-[500px]"
    )}>
      {/* Background image with overlay */}
      <div className="relative w-full h-56">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <img 
            src={backgroundImage} 
            alt={fact.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-transparent from-50% to-white"
        )}></div>
      </div>

      {/* Topic badge positioned below the image gradient */}
      <div className="px-6 -mt-2 mb-3 relative z-10">
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

      <CardHeader className="pt-0 pb-1 relative z-10">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookOpen className={`h-5 w-5 text-${colorClass}`} />
          {fact.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 pt-2">
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
