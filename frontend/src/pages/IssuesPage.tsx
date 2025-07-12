import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function IssuesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
        <Button>New Issue</Button>
      </div>
      
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">Sample Issue Title</CardTitle>
                <CardDescription>
                  This is a sample issue description to show the layout.
                </CardDescription>
              </div>
              <Badge variant="secondary">Open</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge variant="outline">bug</Badge>
              <Badge variant="outline">frontend</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
