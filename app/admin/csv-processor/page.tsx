"use client"

import { useState } from "react"
import { processCsvAndCreateProducts } from "../actions" // Server Action
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

// The URL to your CSV file
const CSV_FILE_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/try_bro_2-YSRrW2lhr0eh69vV6Z5UxmsCec7wtB.csv"

export default function CsvProcessorPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null) // Stores the result from the server action
  const [logs, setLogs] = useState<string[]>([])

  const handleProcessCsv = async () => {
    setIsLoading(true)
    setResults(null)
    setLogs(["Fetching CSV from URL..."])

    try {
      const response = await fetch(CSV_FILE_URL)
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.statusText}`)
      }
      const csvContent = await response.text()
      setLogs((prev) => [...prev, "CSV content fetched. Starting processing..."])

      const actionResult = await processCsvAndCreateProducts(csvContent)
      setResults(actionResult)
      setLogs((prev) => [...prev, ...actionResult.logs])
    } catch (error: any) {
      console.error("Error processing CSV:", error)
      setResults({ success: false, message: error.message || "An unknown error occurred." })
      setLogs((prev) => [...prev, `Client-side error: ${error.message}`])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-background text-foreground">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Howlin' CSV Processor v2</CardTitle>
          <CardDescription>
            Process CSV data to create artifacts and Stripe products. Fetches from: <br />
            <a
              href={CSV_FILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline text-sm break-all"
            >
              {CSV_FILE_URL}
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleProcessCsv} disabled={isLoading} className="w-full">
            {isLoading ? "Processing..." : "Process CSV & Create Stripe Products"}
          </Button>
        </CardContent>
        {logs.length > 0 && (
          <CardFooter className="flex flex-col items-start gap-2">
            <h3 className="text-lg font-semibold">Processing Logs:</h3>
            <ScrollArea className="h-60 w-full rounded-md border p-3 text-sm">
              {logs.map((log, index) => (
                <p
                  key={index}
                  className={`mb-1 ${log.startsWith("❌") ? "text-destructive" : log.startsWith("✅") ? "text-green-500" : ""}`}
                >
                  {log}
                </p>
              ))}
            </ScrollArea>
          </CardFooter>
        )}
        {results && (
          <CardFooter className="flex flex-col items-start gap-2">
            <h3 className="text-lg font-semibold mt-4">Results:</h3>
            <p className={results.success ? "text-green-500" : "text-destructive"}>{results.message}</p>
            {results.processedCount !== undefined && (
              <>
                <p>Total Records Processed: {results.processedCount}</p>
                <p>Successfully Created in Stripe: {results.successCount}</p>
                <p>Failed: {results.failedCount}</p>
              </>
            )}
            {results.successfulArtifacts && results.successfulArtifacts.length > 0 && (
              <div className="mt-2 w-full">
                <h4 className="font-semibold">Successful Artifacts (Stripe IDs):</h4>
                <Textarea
                  readOnly
                  value={JSON.stringify(
                    results.successfulArtifacts.map((a: any) => ({
                      title: a.title,
                      product_id: a.product_id,
                      price_id: a.price_id,
                    })),
                    null,
                    2,
                  )}
                  className="h-40 text-xs"
                />
              </div>
            )}
            {results.failedArtifacts && results.failedArtifacts.length > 0 && (
              <div className="mt-2 w-full">
                <h4 className="font-semibold text-destructive">Failed Artifacts:</h4>
                <Textarea readOnly value={JSON.stringify(results.failedArtifacts, null, 2)} className="h-40 text-xs" />
              </div>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
