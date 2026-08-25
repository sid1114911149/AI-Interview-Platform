<Link
  to={`/interview/${interview._id}`}
  style={{
    textDecoration: "none",
    color: "inherit",
  }}
>
  <div
    style={{
      border: "1px solid gray",
      margin: "15px",
      padding: "15px",
      borderRadius: "10px",
      cursor: "pointer",
    }}
  >
    <h3>{interview.jobRole}</h3>

    <p>
      <strong>Experience:</strong> {interview.experience}
    </p>

    <p>
      <strong>Tech Stack:</strong>{" "}
      {interview.techStack.join(", ")}
    </p>

    <p>
      <strong>Questions:</strong>{" "}
      {interview.numberOfQuestions}
    </p>
  </div>
</Link>