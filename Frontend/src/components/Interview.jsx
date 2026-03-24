import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { INTERVIEW_API_END_POINT } from "@/utils/constant";
import Navbar from "./Shared/Navbar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

const ROLES = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Mobile Developer",
    "System Design",
];

const initialState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    selected: null,       // selected option letter e.g. "A"
    revealed: false,      // whether answer is shown
    isLoading: false,
    done: false,
    results: [],          // {question, correct, selected, explanation, isCorrect}
};

const Interview = () => {
    const [role, setRole] = useState(ROLES[0]);
    const [state, setState] = useState(initialState);

    const startQuiz = async () => {
        setState({ ...initialState, isLoading: true });
        try {
            const res = await axios.post(
                `${INTERVIEW_API_END_POINT}/generate`,
                { role },
                { withCredentials: true }
            );
            if (res.data.success) {
                setState((s) => ({ ...s, questions: res.data.questions, isLoading: false }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to generate questions");
            setState((s) => ({ ...s, isLoading: false }));
        }
    };

    const selectOption = (letter) => {
        if (state.revealed) return;
        setState((s) => ({ ...s, selected: letter }));
    };

    const submitAnswer = () => {
        if (!state.selected || state.revealed) return;
        const current = state.questions[state.currentIndex];
        const isCorrect = state.selected === current.correct;
        setState((s) => ({
            ...s,
            revealed: true,
            score: isCorrect ? s.score + 1 : s.score,
            results: [...s.results, {
                question: current.question,
                correct: current.correct,
                selected: s.selected,
                explanation: current.explanation,
                isCorrect,
            }],
        }));
    };

    const nextQuestion = () => {
        const isLast = state.currentIndex === state.questions.length - 1;
        if (isLast) {
            setState((s) => ({ ...s, done: true }));
        } else {
            setState((s) => ({ ...s, currentIndex: s.currentIndex + 1, selected: null, revealed: false }));
        }
    };

    const restart = () => setState(initialState);

    const { questions, currentIndex, score, selected, revealed, isLoading, done, results } = state;
    const started = questions.length > 0;
    const current = questions[currentIndex];
    const optionLetters = ["A", "B", "C", "D"];

    const getOptionStyle = (letter) => {
        if (!revealed) {
            return selected === letter
                ? "border-[#6A38C2] bg-[#6A38C2]/10 text-[#6A38C2]"
                : "border-gray-200 hover:border-[#6A38C2] hover:bg-gray-50 cursor-pointer";
        }
        if (letter === current.correct) return "border-green-500 bg-green-50 text-green-700";
        if (letter === selected && letter !== current.correct) return "border-red-400 bg-red-50 text-red-600";
        return "border-gray-200 text-gray-400";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-2xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">
                        AI Tech <span className="text-[#6A38C2]">Quiz</span>
                    </h1>
                    <p className="text-gray-500 mt-2">Test your knowledge with AI-generated questions</p>
                </div>

                {/* Start Panel */}
                {!started && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col items-center gap-6">
                        <div className="w-full max-w-sm">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2]"
                            >
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <Button onClick={startQuiz} className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-10">
                            Start Quiz
                        </Button>
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-[#6A38C2] border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Generating quiz questions...</p>
                    </div>
                )}

                {/* Final Result */}
                {done && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                        <h2 className="text-2xl font-bold text-center mb-1">Quiz Complete!</h2>
                        <p className="text-center text-gray-500 mb-2">
                            You scored{" "}
                            <span className="text-[#6A38C2] font-bold text-2xl">{score}/{questions.length}</span>
                        </p>
                        <p className="text-center text-sm text-gray-400 mb-6">
                            {score === questions.length ? "Perfect score! 🎉" : score >= questions.length / 2 ? "Good job! Keep practicing." : "Keep studying, you'll get there!"}
                        </p>

                        <div className="space-y-3 mb-6">
                            {results.map((r, i) => (
                                <div key={i} className={`rounded-xl p-4 border ${r.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                                    <div className="flex items-start gap-2 mb-1">
                                        <span className="text-lg">{r.isCorrect ? "✅" : "❌"}</span>
                                        <p className="text-sm font-medium text-gray-800">{r.question}</p>
                                    </div>
                                    {!r.isCorrect && (
                                        <p className="text-xs text-red-600 ml-7">Your answer: {r.selected} &nbsp;|&nbsp; Correct: {r.correct}</p>
                                    )}
                                    <p className="text-xs text-gray-600 ml-7 mt-1">{r.explanation}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center">
                            <Button onClick={restart} className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white px-10">
                                Restart Quiz
                            </Button>
                        </div>
                    </div>
                )}

                {/* Quiz Panel */}
                {started && !done && !isLoading && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
                        {/* Progress */}
                        <div className="flex items-center justify-between mb-5">
                            <span className="text-sm text-gray-500">
                                Question <span className="font-semibold text-[#6A38C2]">{currentIndex + 1}</span> of {questions.length}
                            </span>
                            <Badge className="text-[#6A38C2] font-semibold" variant="ghost">
                                Score: {score}/{currentIndex + (revealed ? 1 : 0)}
                            </Badge>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                            <div
                                className="bg-[#6A38C2] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                            />
                        </div>

                        {/* Question */}
                        <p className="text-base font-semibold text-gray-800 mb-5">{current?.question}</p>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {current?.options.map((opt, i) => {
                                const letter = optionLetters[i];
                                return (
                                    <div
                                        key={letter}
                                        onClick={() => selectOption(letter)}
                                        className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all text-sm font-medium ${getOptionStyle(letter)}`}
                                    >
                                        <span className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 border-current">
                                            {letter}
                                        </span>
                                        <span>{opt.replace(/^[A-D]\.\s*/, "")}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Explanation after reveal */}
                        {revealed && (
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 text-sm text-gray-700">
                                <span className="font-semibold">Explanation: </span>{current?.explanation}
                            </div>
                        )}

                        {/* Buttons */}
                        {!revealed ? (
                            <Button
                                onClick={submitAnswer}
                                disabled={!selected}
                                className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white disabled:opacity-50"
                            >
                                Submit Answer
                            </Button>
                        ) : (
                            <Button
                                onClick={nextQuestion}
                                className="w-full bg-[#F83002] hover:bg-[#d42a02] text-white"
                            >
                                {currentIndex === questions.length - 1 ? "See Results" : "Next Question →"}
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Interview;
