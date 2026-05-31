import logo from '../assets/standard-white-logo.png';
export default function About() {
  return (
    <>
    <img src={logo}/>
      <div className="body">
        <h1>About CS 467 Job Tracker</h1>

        <p>
          CS 467 Job Tracker is a web application designed to help users organize
          and manage their job search in one place. Instead of tracking applications
          across spreadsheets, emails, and notes, users can keep important job
          information together in a simple dashboard.
        </p>

      <section>
        <h2>Purpose</h2>
        <p>
          The purpose of this project is to make the job search process easier to
          manage by allowing users to track job applications, monitor application
          statuses, and keep notes about each opportunity.
        </p>
      </section>

      <section>
        <h2>Features</h2>
        <ul>
          <li>Add and save job applications</li>
          <li>Track application status such as applied, waiting, interviewed, or rejected</li>
          <li>View job search progress from a dashboard</li>
          <li>Manage skill information related to job applications</li>
          <li>Keep important job details organized in one place</li>
        </ul>
      </section>

      <section>
        <h2>Why This Project Matters</h2>
        <p>
          Searching for jobs can quickly become overwhelming, especially when applying
          to many positions at once. This application helps users stay organized,
          understand their progress, and make more informed decisions during the job
          search process.
        </p>
      </section>

      <section>
        <h2>Project Background</h2>
        <p>
          This application was created as part of the CS 467 capstone project. It
          combines full-stack development, user authentication, database management,
          and a React-based user interface to create a practical tool with real-world
          value.
        </p>
      </section>
      </div>
    </>
  );
}