import Header from "./components/Header/Header"
import Editor from "./components/Editor/Editor"
import StatusBar from "./components/StatusBar/StatusBar"

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-(--background-color) text-white/85"> 

      <Header />
      <Editor />
      <StatusBar />

    </div>
  )
}