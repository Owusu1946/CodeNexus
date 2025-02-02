"use client";

import { useState } from "react";
import { Wand2, Download, Github } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import NavigationHeader from "@/components/NavigationHeader";
import { generateReactApp } from "@/lib/gemini";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function AIBuilderPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const appStructure = await generateReactApp(prompt);
      setGeneratedApp(appStructure);
      
      // Create preview of the app (simplified version)
      const previewHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>${appStructure["src/styles/main.css"]}</style>
          </head>
          <body>
            <div id="root"></div>
            <script type="module">
              ${appStructure["src/App.tsx"]}
            </script>
          </body>
        </html>
      `;
      
      // Set preview in an iframe
      const previewFrame = document.getElementById('preview-frame') as HTMLIFrameElement;
      if (previewFrame?.contentWindow) {
        previewFrame.contentWindow.document.open();
        previewFrame.contentWindow.document.write(previewHtml);
        previewFrame.contentWindow.document.close();
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedApp) return;

    const zip = new JSZip();
    
    // Add package.json
    zip.file("package.json", JSON.stringify(generatedApp["package.json"], null, 2));
    
    // Add source files
    Object.entries(generatedApp).forEach(([path, content]) => {
      if (path.startsWith("src/") || path.startsWith("public/")) {
        zip.file(path, content as string);
      }
    });

    // Generate README
    const readme = `# Generated React App\n\n## Getting Started\n\n1. Extract the files\n2. Run \`npm install\`\n3. Run \`npm start\``;
    zip.file("README.md", readme);

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "react-app.zip");
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <NavigationHeader />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <p className="text-gray-400">
            {!isLoaded ? "Loading..." : "Please sign in to use the AI Builder"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            AI React App Builder
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Describe your React app and let AI generate a complete, production-ready codebase
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-8">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your React app (e.g., 'Create a todo app with dark theme, local storage, and drag-drop reordering')"
            className="w-full p-4 bg-[#1e1e2e] text-white rounded-xl border border-gray-700
                     placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                       bg-blue-600 hover:bg-blue-700 text-white font-medium
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Wand2 className="w-5 h-5" />
              {loading ? "Generating..." : "Generate App"}
            </button>

            {generatedApp && (
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                         bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            )}
          </div>
        </div>

        {/* Preview Section */}
        {generatedApp && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Preview</h2>
            <div className="bg-white rounded-xl overflow-hidden">
              <iframe
                id="preview-frame"
                className="w-full h-[600px]"
                title="App Preview"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 