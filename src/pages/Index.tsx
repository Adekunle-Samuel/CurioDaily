
import { useState } from "react";
import TopicSelector from "@/components/TopicSelector";
import Dashboard from "@/components/Dashboard";

const Index = () => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleTopicSelection = (topics: string[]) => {
    setSelectedTopics(topics);
    setSetupComplete(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {!setupComplete ? (
        <TopicSelector onSelectTopics={handleTopicSelection} />
      ) : (
        <Dashboard selectedTopics={selectedTopics} onReset={() => setSetupComplete(false)} />
      )}
    </div>
  );
};

export default Index;
