import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Welcome to Deris</h1>
        <p className="text-muted-foreground">Your Islamic learning journey starts here</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <h2 className="font-semibold text-lg mb-2">Featured Content</h2>
          <p className="text-sm text-muted-foreground">Explore our latest lessons and resources</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['Quran', 'Hadith', 'Fiqh', 'History'].map((subject) => (
            <div
              key={subject}
              className="p-4 rounded-lg bg-card border border-border text-center hover:bg-accent transition-colors active:scale-95"
            >
              <h3 className="font-medium">{subject}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
