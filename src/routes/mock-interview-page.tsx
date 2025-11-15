/* eslint-disable @typescript-eslint/no-unused-vars */
import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Lightbulb, AlertCircle } from "lucide-react";
import { QuestionSection } from "@/components/question-section";
import { Button } from "@/components/ui/button";

export const MockInterviewPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    
    const fetchInterview = async () => {
      if (!interviewId) {
        setError("No interview ID provided");
        setIsLoading(false);
        return;
      }

      try {
        const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
        
        if (interviewDoc.exists()) {
          const interviewData = {
            id: interviewDoc.id,
            ...interviewDoc.data(),
          } as Interview;
          
          // Validate that the interview has questions
          if (!interviewData.questions || interviewData.questions.length === 0) {
            setError("This interview has no questions configured. Please contact support.");
            return;
          }
          
          setInterview(interviewData);
        } else {
          setError("Interview not found. It may have been deleted or the ID is incorrect.");
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
        
        if (error instanceof Error) {
          if (error.message.includes('permission')) {
            setError("Permission denied. Please check your account access.");
          } else if (error.message.includes('network')) {
            setError("Network error. Please check your internet connection.");
          } else {
            setError("Failed to load interview. Please try again.");
          }
        } else {
          setError("An unexpected error occurred while loading the interview.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  if (error) {
    return (
      <div className="flex flex-col w-full gap-8 py-5">
        <div className="w-full max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to Load Interview</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate("/generate")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!interviewId) {
    navigate("/generate", { replace: true });
    return null;
  }

  if (!interview) {
    navigate("/generate", { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-8 py-5">
      <CustomBreadCrumb
        breadCrumbPage="Start"
        breadCrumpItems={[
          { label: "Mock Interviews", link: "/generate" },
          {
            label: interview?.position || "",
            link: `/generate/interview/${interview?.id}`,
          },
        ]}
      />

      <div className="w-full">
        <Alert className="bg-sky-100 border border-sky-200 p-4 rounded-lg flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-sky-600" />
          <div>
            <AlertTitle className="text-sky-800 font-semibold">
              Important Note
            </AlertTitle>
            <AlertDescription className="text-sm text-sky-700 mt-1 leading-relaxed">
              Press "Record Answer" to begin answering the question. Once you
              finish the interview, you&apos;ll receive feedback comparing your
              responses with the ideal answers.
              <br />
              <br />
              <strong>Note:</strong>{" "}
              <span className="font-medium">Your video is never recorded.</span>{" "}
              You can disable the webcam anytime if preferred.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {interview?.questions && interview?.questions.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start gap-4">
          <QuestionSection questions={interview?.questions} />
        </div>
      )}
    </div>
  );
};
