"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
    isRecording: boolean
    onStart: () => void
    onStop: (transcript: string) => void
    onCancel: () => void
}

export function VoiceInput({ isRecording, onStart, onStop, onCancel }: VoiceInputProps) {
    const [transcript, setTranscript] = useState("")
    const [isSupported, setIsSupported] = useState(true)
    const recognitionRef = useRef<any>(null)

    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (!SpeechRecognition) {
            setIsSupported(false)
            return
        }

        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
            let finalTranscript = ''
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i]
                if (result.isFinal) {
                    finalTranscript += result[0].transcript
                }
            }
            if (finalTranscript) {
                setTranscript(prev => prev + finalTranscript)
            }
        }

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error)
            onCancel()
        }

        recognitionRef.current = recognition
    }, [onCancel])

    const startRecording = () => {
        if (!recognitionRef.current) return
        setTranscript("")
        recognitionRef.current.start()
        onStart()
    }

    const stopRecording = () => {
        if (!recognitionRef.current) return
        recognitionRef.current.stop()
        if (transcript.trim()) {
            onStop(transcript.trim())
        } else {
            onCancel()
        }
        setTranscript("")
    }

    if (!isSupported) {
        return null
    }

    return (
        <>
            {isRecording ? (
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-kli-accent-rose/20 text-kli-accent-rose">
                        <span className="h-2 w-2 rounded-full bg-kli-accent-rose animate-pulse" />
                        <span className="text-xs font-medium">Recording...</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={stopRecording}
                        className="h-10 w-10 rounded-xl text-kli-accent-rose hover:bg-kli-accent-rose/20"
                    >
                        <Square className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={startRecording}
                    className="h-10 w-10 rounded-xl text-kli-text-secondary hover:text-kli-text-primary hover:bg-kli-bg-elevated"
                >
                    <Mic className="h-5 w-5" />
                </Button>
            )}
        </>
    )
}
