"use client";
import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import fetchQuiz from "@/actions/fetchQuiz";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Question from "@/components/question";
import { Progress } from "@/components/ui/progress";
// import { useRef, useEffect, useTransition } from "react";
export default function Home() {
  const initialState = {};
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0.0);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(0);

  const [start, setStart] = useState(false);

  const [state, dispatch] = useActionState(fetchQuiz, initialState);

  const handleClick = async () => {
    startTransition(() => {
      dispatch();
    });
  };

  const handleScore = (value: number) => {
    setScore(score + value);
  };

  const handleDone = () => {
    console.log("done");
    setDone(true);
  };

  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!start) return;
    if (timer <= 0) {
      setTimer(state.duration * 60);
    }
    if (!state) return;

    const quizTimerInterval = setInterval(() => {
      setTimer((prevQuizTimer) => {
        if (prevQuizTimer <= 0) {
          clearInterval(quizTimerInterval);
          // handleDone();
        }
        return prevQuizTimer - 1;
      });
    }, 1000);
    return () => clearInterval(quizTimerInterval); // Clean up interval on unmount
  }, [start]);

  return (
    <div className="relative overflow-hidden h-screen">
      <div
        aria-hidden="true"
        className="flex absolute -top-0 start-1/2 transform -translate-x-1/2"
      >
        <div className="bg-gradient-to-r from-foreground to-foreground/50 blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
        <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-foreground via-foreground to-background" />
      </div>
      <div className="relative z-10 h-full">
        <div className="container h-full">
          <div className="max-w-2xl text-center mx-auto h-full mt-16">
            {done ? (
              <h1 className="text-4xl text-white">
                Your Final Score is: {score}
              </h1>
            ) : (
              <>
                {Object.keys(state).length !== 0 ? (
                  <>
                    {!start ? (
                      <Card className="h-1/2">
                        <CardHeader className="text-left justify-self-start">
                          <Badge className="">{state.topic}</Badge>
                        </CardHeader>
                        <CardContent className="flex-col">
                          <h1 className="text-4xl">{state.title}</h1>
                          <p>
                            Marks for correct answer:{" "}
                            <span className="text-green-500">
                              +{state.correct_answer_marks}
                            </span>
                          </p>
                          <p>
                            Marks for correct answer:{" "}
                            <span className="text-red-500">
                              -{state.negative_marks}
                            </span>
                          </p>
                          <p>
                            Total Questions:{" "}
                            <span className="text-blue-500">
                              {state.questions_count}
                            </span>
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                          <Button onClick={() => setStart(true)}>Begin</Button>
                        </CardFooter>
                      </Card>
                    ) : (
                      <div className="">
                        <h1 className="text-white text-4xl">{state.title}</h1>
                        <h2 className="text-white text-lg">
                          {state.description}
                        </h2>
                        <h3 className="text-white text-lg">
                          Time Remaining:{" "}
                          {Math.floor(timer / 60) +
                            ":" +
                            (timer % 60 < 10 ? "0" : "") +
                            (timer % 60)}
                        </h3>
                        <h1 className="text-white text-xl text-right">
                          Score: {score}
                        </h1>
                        <Progress
                          value={(current / count) * 100}
                          className="my-10"
                        />
                        <Carousel setApi={setApi}>
                          <CarouselContent>
                            {state.questions.map(
                              (question: any, index: number) => (
                                <CarouselItem key={index}>
                                  <Question
                                    {...question}
                                    handleScore={handleScore}
                                    handleDone={handleDone}
                                    isLast={
                                      index === state.questions.length - 1
                                    }
                                  />
                                </CarouselItem>
                              )
                            )}
                          </CarouselContent>
                          <CarouselNext className="text-black" />
                        </Carousel>
                      </div>
                    )}
                  </>
                ) : (
                  <Card className="h-1/2">
                    {/* Title */}
                    <div className="mt-5 max-w-2xl">
                      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Quiz App
                      </h1>
                    </div>
                    {/* End Title */}
                    <div className="mt-5 max-w-3xl">
                      <p className="text-xl text-muted-foreground">
                        Test your knowledge with this quiz app. Click the button
                        to start
                      </p>
                    </div>
                    <Button onClick={handleClick} className="mt-5">
                      {isPending ? (
                        <div>
                          <Loader2 className=" animate-spin" />
                          <span className="sr-only">Loading</span>
                        </div>
                      ) : (
                        "Start"
                      )}
                    </Button>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
