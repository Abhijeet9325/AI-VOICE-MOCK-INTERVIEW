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
  questionCount: z.coerce
    .number()
    .min(1, "At least 1 question")
    .max(20, "Maximum 20 questions")
    .default(10),
});

type FormData = z.infer<typeof formSchema>;

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, questionCount: (initialData as any).questionCount ?? 10 }
      : { questionCount: 10 },
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
  const techs = data.techStack.split(/[\s,\/\+]+/).map((t) => t.trim()).filter(Boolean);
  const primary = techs[0] || "your primary stack";
  const position = (data.position || "this role").trim();
  const description = (data.description || "the product requirements").trim();
  const expNum = Number(data.experience ?? 0);

  // ✅ define fresher safely
  const isFresher = isNaN(expNum) ? true : expNum <= 1;

  const count = Math.max(1, Math.min(20, data.questionCount ?? 10));

  const categories = [ /* your list stays same */ ];

  const makeQuestionForCategory = (
    t: string,
    cat: { name: string; focus: "tech" | "desc" | "pos" | "exp" },
    pos: string,
    desc: string,
    fresher: boolean
  ) => {
    const c = cat.name;
    switch (c) {
      case "component design":
        return `For ${pos}, how would you design a simple component in ${t}? Cover props, state, and composition.`;
      case "styling approaches":
        return `In ${t}, compare styling options (CSS modules, Tailwind, UI libs). When would ${pos} choose each?`;
      // (other cases stay same)
      default:
        return fresher
          ? `As a fresher ${pos}, explain the basics of ${c} in ${t}.`
          : `Explain your approach to ${c} in ${t} for ${pos}. Include rationale and a brief example.`;
    }
  };

  const result: { question: string; answer: string }[] = [];
  for (let i = 0; i < count; i++) {
    const tech = techs[i % (techs.length || 1)] || primary;
    const cat = categories[i];
    result.push({
      question: makeQuestionForCategory(tech, cat, position, description, isFresher),
      answer: "Explain clearly with proper example.",
    });
  }
  return result;
};


  const generateAiResponse = async (data: FormData) => {
    const count = Math.max(1, Math.min(20, data.questionCount ?? 10));
    const prompt = `
        Generate a JSON array containing ${count} strictly unique technical interview questions with detailed answers, tailored for freshers (0–1 years).
        Each object must have "question" and "answer" fields.

        Job Information:
        - Job Position: ${data?.position}
        - Job Description: ${data?.description}
        - Tech Stacks: ${data?.techStack}
        - Years of Experience: ${data?.experience}

        Interview style and ordering:
        - Simulate a real-life interviewer. Use clear, concise, practical phrasing.
        - Order questions progressively: easiest → intermediate → advanced.
          • Beginner: fundamentals, definitions, simple use cases, basic syntax/APIs.
          • Intermediate: implementation details (state/data handling, routing, async/data fetching, error handling), small scenarios.
          • Advanced: testing strategy, performance optimization, type safety, security, architecture and design patterns, trade-offs.

        Content guidance:
        - Mix question types used in real interviews:
          • "Explain/Why/When" questions (concept comprehension and decision reasoning)
          • "How would you" practical implementation tasks
          • Scenario/debugging questions (identify causes, propose fixes)
          • Performance and optimization questions (measure, improve, verify)
          • Design a feature/API questions (requirements, data flow, edge cases)
          • Code review/pitfalls questions (identify anti-patterns, propose improvements)
        - Keep scope aligned to ${data?.techStack}. Avoid trick questions beyond that stack.
        - Distribute coverage across fields: explicitly reference Job Position, Job Description, Tech Stacks, and calibrate difficulty to Years of Experience. Ensure questions tied to the same field cover different subtopics and use varied phrasing.

        Constraints:
        - All questions must be strictly unique; avoid duplicates or near-duplicates.
        - Vary phrasing and focus across questions; do not reuse the same sentence structure.
        - Do NOT include labels like "Variant" or numbering in the question text.
        - Return ONLY a valid JSON array without code fences or extra text.

        Example format:
        [
          { "question": "<Beginner-level question>", "answer": "<Clear, practical answer>" },
          { "question": "<Intermediate-level question>", "answer": "<Clear, practical answer>" },
          { "question": "<Advanced-level question>", "answer": "<Clear, practical answer>" }
        ]
        `;

    try {
      const aiResult = await chatSession.sendMessage(prompt);
      const cleanedResponse = cleanAiResponse(aiResult.response.text());
      const unique = dedupeQuestions(cleanedResponse);
      let sliced = unique.slice(0, count);
      if (sliced.length < count) {
        const fallback = buildFallbackQuestions(data);
        const combined = dedupeQuestions([...sliced, ...fallback]);
        sliced = combined.slice(0, count);
      }
      return sliced.length ? sliced : buildFallbackQuestions(data);
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
        questionCount: (initialData as any).questionCount ?? 10,
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

          <FormField
            control={form.control}
            name="questionCount"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel className="text-gray-900 font-medium">Number of Questions</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    className="h-12 bg-white text-gray-900 border-sky-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 shadow-sm"
                    disabled={loading}
                    placeholder="eg:- 10"
                    {...field}
                    value={Number(field.value ?? 10)}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
  const dedupeQuestions = (
    items: { question: string; answer: string }[],
  ): { question: string; answer: string }[] => {
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/\(variant.*?\)/gi, "") // strip any variant markers
        .replace(/[^\w\s]/g, " ") // remove punctuation
        .replace(/\s+/g, " ") // collapse whitespace
        .trim();
    const seen = new Set<string>();
    const out: { question: string; answer: string }[] = [];
    for (const it of items) {
      const key = normalize(it.question || "");
      if (key && !seen.has(key)) {
        seen.add(key);
        out.push(it);
      }
    }
    return out;
  };
