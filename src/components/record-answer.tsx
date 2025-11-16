/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuth } from "@clerk/clerk-react";
import {
  CircleStop,
  Loader,
  Mic,
  RefreshCw,
  Save,
  Video,
  VideoOff,
  WebcamIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useParams } from "react-router-dom";
import WebCam from "react-webcam";
import { TooltipButton } from "./tooltip-button";
import { toast } from "sonner";
import { chatSession } from "@/scripts";
import { SaveModal } from "./save-modal";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface RecordAnswerProps {
  question: { question: string; answer: string };
  isWebCam: boolean;
  setIsWebCam: (value: boolean) => void;
}

interface AIResponse {
  ratings: number;
  feedback: string;
}

export const RecordAnswer = ({
  question,
  isWebCam,
  setIsWebCam,
}: RecordAnswerProps) => {
  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    crossBrowser: true,
    interimResults: true,
    useLegacyResults: false,
    // Prevent auto-stop on silence; 0 disables timeout
    timeout: 0,
    // Ensure SpeechRecognition runs in continuous mode with interim results
    speechRecognitionProperties: {
      continuous: true,
      interimResults: true,
      lang: "en-US",
    },
  });

  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<AIResponse | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  // Track quick auto-stops and restart once to stabilize recording
  const [lastStartTime, setLastStartTime] = useState<number | null>(null);
  const [autoRestartEnabled, setAutoRestartEnabled] = useState(false);

  const { userId } = useAuth();
  const { interviewId } = useParams();

  const recordUserAnswer = async () => {
    if (isRecording) {
      stopSpeechToText();

      if (userAnswer?.length < 30) {
        toast.error("Answer too short", {
          description: "Your answer should be more than 30 characters. Please provide a more detailed response.",
        });
        return;
      }

      try {
        // Generate AI feedback
        const aiResult = await generateResult(
          question.question,
          question.answer,
          userAnswer
        );
        
        if (aiResult.ratings > 0) {
          toast.success("Feedback generated", {
            description: `Your answer has been analyzed. Rating: ${aiResult.ratings}/10`,
          });
        }
        
        setAiResult(aiResult);
      } catch (error) {
        console.error("Error generating feedback:", error);
        toast.error("Failed to generate feedback", {
          description: "Please check your internet connection and try again.",
        });
      }
    } else {
      try {
        await startSpeechToText();
        setLastStartTime(Date.now());
        setAutoRestartEnabled(true);
        toast.success("Recording started", {
          description: "Speak clearly into your microphone",
        });
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        toast.error("Microphone access denied", {
          description: "Please allow microphone access and ensure you're using a supported browser.",
        });
      }
    }
  };

  const cleanJsonResponse = (responseText: string) => {
    // Step 1: Trim any surrounding whitespace
    let cleanText = responseText.trim();

    // Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
    cleanText = cleanText.replace(/(json|```|`)/g, "");

    // Step 3: Parse the clean JSON text into an array of objects
    try {
      return JSON.parse(cleanText);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error)?.message);
    }
  };

  const generateResult = async (
    qst: string,
    qstAns: string,
    userAns: string
  ): Promise<AIResponse> => {
    setIsAiGenerating(true);
    
    // Validate inputs
    if (!qst || !qstAns || !userAns) {
      toast.error("Invalid input", {
        description: "Missing question, correct answer, or user answer.",
      });
      return { ratings: 0, feedback: "Unable to generate feedback due to missing data" };
    }
    
    const prompt = `
      Question: "${qst}"
      User Answer: "${userAns}"
      Correct Answer: "${qstAns}"
      Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) based on answer quality, and offer feedback for improvement.
      Return the result in JSON format with the fields "ratings" (number) and "feedback" (string).
    `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const responseText = aiResult.response.text();
      
      if (!responseText) {
        throw new Error("Empty AI response");
      }
      
      const parsedResult: AIResponse = cleanJsonResponse(responseText);
      
      // Validate the parsed result
      if (typeof parsedResult.ratings !== 'number' || parsedResult.ratings < 1 || parsedResult.ratings > 10) {
        console.warn("Invalid rating received:", parsedResult.ratings);
        parsedResult.ratings = Math.max(1, Math.min(10, parsedResult.ratings || 5));
      }
      
      if (!parsedResult.feedback || typeof parsedResult.feedback !== 'string') {
        parsedResult.feedback = "Good effort! Keep practicing to improve your interview skills.";
      }
      
      return parsedResult;
    } catch (error) {
      console.error("AI Generation Error:", error);
      
      // Provide fallback feedback based on answer length and keywords
      const fallbackRating = userAns.length > 100 ? 6 : 4;
      const fallbackFeedback = userAns.toLowerCase().includes(qstAns.toLowerCase().split(' ')[0]) 
        ? "Good start! Try to expand on your answer with more specific examples."
        : "Consider addressing the key points mentioned in the question. Practice makes perfect!";
      
      toast.error("AI service temporarily unavailable", {
        description: "Using fallback feedback. Please try again later.",
      });
      
      return { ratings: fallbackRating, feedback: fallbackFeedback };
    } finally {
      setIsAiGenerating(false);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    stopSpeechToText();
    startSpeechToText();
    setLastStartTime(Date.now());
    setAutoRestartEnabled(true);
  };

  const saveUserAnswer = async () => {
    if (!aiResult) {
      toast.error("No feedback available", {
        description: "Please record and generate feedback before saving.",
      });
      return;
    }

    setLoading(true);
    const currentQuestion = question.question;
    
    try {
      // Validate required data
      if (!userId || !interviewId) {
        throw new Error("Missing user or interview information");
      }

      // Check if the user answer already exists for this question
      const userAnswerQuery = query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("question", "==", currentQuestion),
        where("mockIdRef", "==", interviewId) // Also check for this specific interview
      );

      const querySnap = await getDocs(userAnswerQuery);

      // If the user already answered this question for this interview, don't save again
      if (!querySnap.empty) {
        toast.info("Already Answered", {
          description: "You have already answered this question in this interview",
        });
        return;
      }

      // Save the user answer
      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: question.question,
        correct_ans: question.answer,
        user_ans: userAnswer,
        feedback: aiResult.feedback,
        rating: aiResult.ratings,
        userId,
        createdAt: serverTimestamp(),
      });

      toast.success("Answer Saved", { 
        description: "Your answer has been saved successfully!" 
      });
      
      // Reset for next answer
      setUserAnswer("");
      stopSpeechToText();
      setAutoRestartEnabled(false);
      setLastStartTime(null);
      
    } catch (error) {
      console.error("Save Error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("permission")) {
          toast.error("Permission Denied", {
            description: "Please check your account permissions.",
          });
        } else if (error.message.includes("network")) {
          toast.error("Network Error", {
            description: "Please check your internet connection.",
          });
        } else {
          toast.error("Save Failed", {
            description: "An error occurred while saving your answer. Please try again.",
          });
        }
      }
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  useEffect(() => {
    const combineTranscripts = results
      .filter((result): result is ResultType => typeof result !== "string")
      .map((result) => result.transcript)
      .join(" ");

    setUserAnswer(combineTranscripts);
  }, [results]);

  // If recording stops within a short window after starting,
  // auto-restart once to combat premature termination on some browsers.
  useEffect(() => {
    if (!isRecording && autoRestartEnabled && lastStartTime) {
      const elapsed = Date.now() - lastStartTime;
      if (elapsed < 4000) {
        startSpeechToText().catch((error) => {
          console.error("Auto-restart failed:", error);
          toast.error("Failed to keep recording on", {
            description: "Please check microphone permissions and try again.",
          });
        });
        // Avoid infinite loops; only one auto-restart
        setAutoRestartEnabled(false);
        setLastStartTime(Date.now());
      }
    }
  }, [isRecording, autoRestartEnabled, lastStartTime, startSpeechToText]);

  return (
    <div className="w-full flex flex-col items-center gap-8 mt-4">
      {/* save modal */}
      <SaveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={saveUserAnswer}
        loading={loading}
      />

      <div className="w-full h-[400px] md:w-96 flex flex-col items-center justify-center border p-4 bg-gray-50 rounded-md">
        {isWebCam ? (
          <WebCam
            onUserMedia={() => setIsWebCam(true)}
            onUserMediaError={() => setIsWebCam(false)}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <WebcamIcon className="min-w-24 min-h-24 text-gray-400 dark:text-gray-500" />
        )}
      </div>

      <div className="flex itece justify-center gap-3">
        <TooltipButton
          content={isWebCam ? "Turn Off" : "Turn On"}
          icon={
            isWebCam ? (
              <VideoOff className="min-w-5 min-h-5" />
            ) : (
              <Video className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setIsWebCam(!isWebCam)}
        />

        <TooltipButton
          content={isRecording ? "Stop Recording" : "Start Recording"}
          icon={
            isRecording ? (
              <CircleStop className="min-w-5 min-h-5" />
            ) : (
              <Mic className="min-w-5 min-h-5" />
            )
          }
          onClick={recordUserAnswer}
        />

        <TooltipButton
          content="Record Again"
          icon={<RefreshCw className="min-w-5 min-h-5" />}
          onClick={recordNewAnswer}
        />

        <TooltipButton
          content="Save Result"
          icon={
            isAiGenerating ? (
              <Loader className="min-w-5 min-h-5 animate-spin" />
            ) : (
              <Save className="min-w-5 min-h-5" />
            )
          }
          onClick={() => setOpen(!open)}
          disbaled={!aiResult}
        />
      </div>

     <div className="w-full mt-4 p-4 border rounded-md bg-gray-50">
  <h2 className="text-lg font-semibold text-black">Your Answer:</h2> {/* 👈 added text-black */}


        <p className="text-sm mt-2 text-gray-700 whitespace-normal">
          {userAnswer || "Start recording to see your answer here"}
        </p>

        {interimResult && (
          <p className="text-sm text-gray-500 mt-2">
            <strong>Current Speech:</strong>
            {interimResult}
          </p>
        )}
      </div>
    </div>
  );
};
