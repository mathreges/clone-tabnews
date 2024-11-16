import Maintenance from './maintenance/index.js';

export default Home;

function Home() {
  let isMaintenanceEnable = true;

  return isMaintenanceEnable ? <Maintenance /> : <h1>Who is my little cat?</h1>;
}
