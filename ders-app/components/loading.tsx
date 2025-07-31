const loadingText: string[] = [
    "ሱብሃን አሏህ",
    "አልሃምዱሊላህ",
    "ላኢላህ አኢለሏህ",
]

export const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="ml-2 text-lg text-muted-foreground mt-2">{loadingText[Math.floor(Math.random() * loadingText.length)]}</p>
        </div>
    );
}