import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { Interview } from "@/types";

import { CustomBreadCrumb } from "./custom-bread-crumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData
    ? initialData.position
    : "Create a new mock interview";

  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated..!", description: "Changes saved successfully..." }
    : { title: "Created..!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string): { question: string; answer: string }[] => {
    try {
      // Trim and remove common code fence wrappers
      let cleanText = responseText.trim();
      const fenceMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)```/i);
      if (fenceMatch) {
        cleanText = fenceMatch[1].trim();
      } else {
        cleanText = cleanText.replace(/(json|```|`)/gi, "");
      }

      // Attempt to capture the first JSON array
      const jsonArrayMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonArrayMatch) {
        cleanText = jsonArrayMatch[0];
      }

      const parsed = JSON.parse(cleanText);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item) => item && typeof item.question === "string" && typeof item.answer === "string"
        );
      }
      return [];
    } catch {
      // Return empty to allow fallback
      return [];
    }
  };

  const buildFallbackQuestions = (data: FormData): { question: string; answer: string }[] => {
    const techs = data.techStack.split(/[,\s]+/).filter(Boolean);
    const primary = techs[0] || "your primary stack";
    return [
      {
        question: `Describe your experience with ${primary}. What key projects showcase your skills?`,
        answer: "Highlight 2–3 projects, specific responsibilities, performance improvements, and technologies used.",
      },
      {
        question: `How do you architect applications using ${primary}?`,
        answer: "Explain typical architecture, state/data management, modular design, testing, and deployment patterns.",
      },
      {
        question: `What best practices do you follow for code quality in ${primary}?`,
        answer: "Discuss code reviews, linting, type safety, testing strategy, performance profiling, and documentation.",
      },
      {
        question: `Share a challenging bug or performance issue you solved in ${primary}.`,
        answer: "Describe the issue, investigation steps, tools used, fix applied, and measurable impact.",
      },
      {
        question: `How do you handle scalability and reliability for ${primary} applications?`,
        answer: "Cover caching, pagination, error handling, monitoring, CI/CD, and rollback strategies.",
      },
    ];
  };

  const generateAiResponse = async (data: FormData) => {
    const prompt = `
        As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Years of Experience Required: ${data?.experience}
        - Tech Stacks: ${data?.techStack}

        The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
        `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const cleanedResponse = cleanAiResponse(aiResult.response.text());
      return cleanedResponse.length ? cleanedResponse : buildFallbackQuestions(data);
    } catch (error) {
      // Fallback to deterministic questions when AI fails
      return buildFallbackQuestions(data);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      // Ensure user is authenticated before creating/interacting
      if (!userId) {
        toast.error("Sign-in required", {
          description: "Please sign in to create a mock interview.",
        });
        navigate("/signin", { replace: true });
        return;
      }

      if (initialData) {
        // update
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await updateDoc(doc(db, "interviews", initialData?.id), {
            questions: aiResult,
            ...data,
            updatedAt: serverTimestamp(),
          }).catch((error) => console.log(error));
          toast(toastMessage.title, { description: toastMessage.description });
        }
      } else {
        // create a new mock interview
        if (isValid) {
          const aiResult = await generateAiResponse(data);

          await addDoc(collection(db, "interviews"), {
            ...data,
            userId,
            questions: aiResult,
            createdAt: serverTimestamp(),
          });

          toast(toastMessage.title, { description: toastMessage.description });
        }
      }

      navigate("/generate", { replace: true });
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Please try again later";
      toast.error("Error", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size={"icon"} variant={"ghost"}>
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <div className="my-6"></div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-lg bg-sky-50 border border-sky-200"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-gray-900 font-medium">Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12 bg-white text-gray-900 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 shadow-sm"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-gray-900 font-medium">Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12 bg-white text-gray-900 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 shadow-sm"
                    disabled={loading}
                    placeholder="eg:- describle your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-gray-900 font-medium">Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12 bg-white text-gray-900 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 shadow-sm"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-gray-900 font-medium">Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12 bg-white text-gray-900 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 shadow-sm"
                    disabled={loading}
                    placeholder="eg:- React, Typescript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size={"sm"}
              variant={"outline"}
              disabled={isSubmitting || loading}
              className="border-sky-300 text-sky-700 hover:bg-sky-100"
            >
              Reset
            </Button>
            <Button
              type="submit"
              size={"sm"}
              disabled={isSubmitting || !isValid || loading}
              className="bg-sky-600 hover:bg-sky-700 text-white shadow-md"
            >
              {loading ? (
                <Loader className="text-white animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
