import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AnswerProps {
  answer: string;
  loading?: boolean;
}

function Answer({ answer, loading = false }: AnswerProps) {
  if (loading) {
    return (
      <section className="answer">
        <h2>Answer</h2>

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
      <h2>Answer</h2>

      <div className="answer-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {answer}
        </ReactMarkdown>
      </div>
    </section>
  );
}

export default Answer;
