export { Maintenance };

function Maintenance() {
  return <>
    <div className="container">
      <h2>🏗️ 🚧 WiP 🚧 🏗️</h2>
      <h1>This project has the goal to transform Matheus Reges into a better professional!</h1>
      <div>
        <p>
          By going through all steps of development, from creating a repository, registering your own domain, connecting with the database, security, deploying, and more! Follow the GitHub repository so you can be notified of the progress <a href="https://github.com/mathreges/clone-tabnews">here</a>!
        </p>
        <span>
          Base project: <a href="https://www.tabnews.com.br/">tabnews.com.br</a>
        </span>
      </div>
      <LoadingCircle />
    </div>
  </>;
}

function LoadingCircle() {
  return <div>
    <div className="card">
      <div className="box">
        <div className="percent">
          <svg className="circle-wrapper">
            <circle cx="70" cy="70" r="70"></circle>
            <circle cx="70" cy="70" r="70"></circle>
          </svg>
          <div className="num">
            <h2>7<span>%</span></h2>
          </div>
          <a href="https://github.com/mathreges/clone-tabnews" alt="Github link project">GitHub</a>
        </div>
      </div>
    </div>
  </div>
}
