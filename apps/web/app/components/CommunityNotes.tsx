import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NoteProps {
  content: string;
  author: string;
  timestamp: string;
  votes: number;
  type: "correction" | "context" | "warning" | "source";
}

const CommunityNotes = () => {
  const notes: NoteProps[] = [
    {
      content:
        "This article omits that the meeting was facilitated by a neutral third party. The UAE played a significant role in bringing both nations to the negotiation table.",
      author: "DiplomaticAnalyst",
      timestamp: "2023-05-09T14:32:00",
      votes: 124,
      type: "context",
    },
    {
      content:
        "The article claims talks were 'extensive' but official records show the meeting lasted only 45 minutes, not the 'hours-long discussion' reported here.",
      author: "FactChecker21",
      timestamp: "2023-05-09T16:17:00",
      votes: 89,
      type: "correction",
    },
    {
      content:
        "The statement attributed to India's foreign minister was actually made by the ministry spokesperson, not the minister directly.",
      author: "MediaWatcher",
      timestamp: "2023-05-09T17:05:00",
      votes: 62,
      type: "warning",
    },
  ];

  const getIconByType = (type: string) => {
    switch (type) {
      case "correction":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "context":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "source":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Community Notes</CardTitle>
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Add Note
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {notes.map((note, index) => (
          <React.Fragment key={index}>
            <div className="flex gap-3">
              <div className="mt-0.5">{getIconByType(note.type)}</div>
              <div className="flex-1">
                <p className="text-sm text-gray-700">{note.content}</p>
                <div className="flex items-center mt-2 justify-between">
                  <span className="text-xs text-gray-500">
                    By {note.author} •{" "}
                    {new Date(note.timestamp).toLocaleString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <span className="text-xs text-gray-500">{note.votes}</span>
                  </div>
                </div>
              </div>
            </div>
            {index < notes.length - 1 && <Separator />}
          </React.Fragment>
        ))}
      </CardContent>
    </Card>
  );
};

export default CommunityNotes;
