import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles } from "lucide-react";

interface AnswerProps {
  answer: string;
  loading?: boolean;
}

function Answer({ answer, loading = false }: AnswerProps) {
  if (loading) {
    return (
      <section className="answer">
        <div className="answer-header">
          <div className="answer-title">
            <div className="answer-icon">
              <Sparkles size={17} />
            </div>

            <h2>Answer</h2>
          </div>

          <span className="answer-status">Generating</span>
        </div>

        <div className="answer-loading">
          <span className="loading-spinner"></span>
          <span>Generating answer...</span>
        </div>
      </section>
    );
  }

  if (!answer) {
    return null;
  }

  return (
    <section className="answer">
      <div className="answer-header">
        <div className="answer-title">
          <div className="answer-icon">
            <Sparkles size={17} />
          </div>

          <h2>Answer</h2>
        </div>

        <span className="answer-status">AI Generated</span>
      </div>

      <div className="answer-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {answer}
        </ReactMarkdown>
      </div>
    </section>
  );
}

export default Answer;
