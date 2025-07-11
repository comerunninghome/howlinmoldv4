import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Info, Bell, ChevronDown } from "lucide-react"

const CommitDetailView = () => {
  return (
    <div className="max-w-4xl mx-auto font-sans text-gray-800">
      <header className="mb-8">
        <h1 className="text-2xl font-medium mb-2">Implement modular SVG UI components</h1>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>Jul 11</span>
          <span className="text-blue-600">comeruninnghome/deployment</span>
          <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
            xlw01v-codex/implement-modular-svg-ui-components
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-200">
              +135
            </Badge>
            <Badge variant="outline" className="text-red-600 border-red-200">
              -1
            </Badge>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" className="bg-gray-200 text-gray-800 hover:bg-gray-300">
            Copy git apply
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="bg-gray-50 border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-2">YO THIS IS GOLD</h2>
                <p className="text-gray-600">
                  You are not violating terms if you scrape public seller inventory text, save it locally, and
                  don&apos;t...
                </p>
              </CardContent>
            </Card>

            <div>
              <p className="text-sm text-gray-500 mb-4">Worked for 1m 56s &gt;</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Summary</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-3 text-gray-400">•</span>
                      <p>
                        Created a minimal telemetry server (
                        <code className="text-xs bg-gray-100 p-1 rounded font-mono">memory-server.js</code>) that
                        streams events via SSE and keeps a simple dashboard{" "}
                        <Info className="inline h-4 w-4 text-gray-400" />
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-gray-400">•</span>
                      <p>
                        Added a helper script (
                        <code className="text-xs bg-gray-100 p-1 rounded font-mono">send-telemetry.js</code>) to post
                        telemetry data to the server from any node <Info className="inline h-4 w-4 text-gray-400" />
                      </p>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-3 text-gray-400">•</span>
                      <p>
                        Updated the README with instructions for running the server and sending telemetry messages{" "}
                        <Info className="inline h-4 w-4 text-gray-400" />
                      </p>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Testing</h3>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <p>
                        <code className="text-xs bg-gray-100 p-1 rounded font-mono">node memory-server.js</code> started
                        the server and printed the startup message <Info className="inline h-4 w-4 text-gray-400" />
                      </p>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p>
                          <code className="text-xs bg-gray-100 p-1 rounded font-mono">node send-telemetry.js</code>
                        </p>
                        <p className="text-gray-500">
                          <code className="text-xs bg-gray-100 p-1 rounded font-mono">
                            http://localhost:3000 &quot;Test message&quot;
                          </code>
                        </p>
                        <p>
                          successfully sent a test event <Info className="inline h-4 w-4 text-gray-400" />
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">{/* This column is empty in the screenshot */}</div>
        </div>
      </main>
    </div>
  )
}

export default CommitDetailView
