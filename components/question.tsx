"use client";
import React, { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";
import { ConfettiButton } from "./ui/confetti";
import { CoolMode } from "./ui/cool-mode";

type Props = {
  description: string;
  options: any[];
  handleScore: (value: number) => void;
  isLast: boolean;
  handleDone: () => void;
};

export default function Question({
  description,
  options,
  handleScore,
  isLast,
  handleDone,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const submitAnswer = (submitted: boolean) => {
    if (submitted) {
      handleScore(4);
    } else {
      handleScore(-1);
    }
    if (isLast) {
      handleDone();
    }

    setSubmitted(true);
  };
  return (
    <Card>
      <CardHeader>{description}</CardHeader>
      <CardContent className="space-y-4 relative">
        {options.map((option: any, index: number) =>
          option.is_correct ? (
            <div className="relative" key={index}>
              <ConfettiButton
                className="w-full justify-between"
                disabled={submitted}
                anotherEvent={() => submitAnswer(option.is_correct)}
              >
                <span>{option.description}</span>
                {submitted && <CheckCircle color="green" />}
              </ConfettiButton>
            </div>
          ) : (
            <CoolMode
              key={index}
              options={{
                particle:
                  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZjAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS14Ij48cGF0aCBkPSJNMTggNiA2IDE4Ii8+PHBhdGggZD0ibTYgNiAxMiAxMiIvPjwvc3ZnPg==",
              }}
            >
              <Button
                className="w-full justify-between"
                onClick={() => submitAnswer(option.is_correct)}
                disabled={submitted}
              >
                <span>{option.description}</span>
                {submitted && <XCircle color="red" />}
              </Button>
            </CoolMode>
          )
        )}
      </CardContent>
    </Card>
  );
}
