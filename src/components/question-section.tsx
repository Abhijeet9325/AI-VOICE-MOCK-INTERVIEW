import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Volume2, VolumeX } from "lucide-react";
import { RecordAnswer } from "./record-answer";

interface QuestionSectionProps {
  questions: { question: string; answer: string }[];
}

export const QuestionSection = ({ questions }: QuestionSectionProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);

  const [currentSpeech, setCurrentSpeech] =
    useState<SpeechSynthesisUtterance | null>(null);

  const handlePlayQuestion = (qst: string) => {
    if (isPlaying && currentSpeech) {
      // stop the speech if already playing
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setCurrentSpeech(null);
    } else {
      if ("speechSynthesis" in window) {
        const speech = new SpeechSynthesisUtterance(qst);
        window.speechSynthesis.speak(speech);
        setIsPlaying(true);
        setCurrentSpeech(speech);

        // handle the speech end
        speech.onend = () => {
          setIsPlaying(false);
          setCurrentSpeech(null);
        };
      }
    }
  };

  const uniqueQuestions = useMemo(() => {
    const seen = new Set<string>();
    const out: { question: string; answer: string }[] = [];
    for (const q of questions || []) {
      const key = (q?.question || "").trim().toLowerCase();
      if (!seen.has(key) && key) {
        seen.add(key);
        out.push(q);
      }
    }
    return out;
  }, [questions]);

  return (
    <div className="w-full min-h-96 border rounded-md p-4">
      <Tabs
        defaultValue={uniqueQuestions.length ? `q-0` : undefined}
        className="w-full space-y-12"
        orientation="vertical"
      >
        <TabsList className="bg-transparent w-full flex flex-wrap items-center justify-start gap-4 h-auto">
          {uniqueQuestions?.map((tab, i) => (
            <TabsTrigger
              className={cn(
                "data-[state=active]:bg-emerald-200 data-[state=active]:text-emerald-900 data-[state=active]:shadow-none text-xs px-2 rounded-md border border-emerald-300"
              )}
              key={`q-${i}`}
              value={`q-${i}`}
            >
              {`Question #${i + 1}`}
            </TabsTrigger>
          ))}
        </TabsList>

        {uniqueQuestions?.map((tab, i) => (
          <TabsContent key={`qc-${i}`} value={`q-${i}`}>
            <p className="text-base text-left tracking-wide text-gray-700 dark:text-gray-300">
              {tab.question}
            </p>

            <div className="w-full flex items-center justify-end">
              <TooltipButton
                content={isPlaying ? "Stop" : "Start"}
                icon={
                  isPlaying ? (
                    <VolumeX className="min-w-5 min-h-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <Volume2 className="min-w-5 min-h-5 text-gray-400 dark:text-gray-500" />
                  )
                }
                onClick={() => handlePlayQuestion(tab.question)}
              />
            </div>

            <RecordAnswer
              question={tab}
              isWebCam={isWebCam}
              setIsWebCam={setIsWebCam}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
