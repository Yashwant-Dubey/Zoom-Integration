import { Link, Outlet } from 'react-router-dom';
import './Layout.css';
const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Meeting list</Link>
          </li>
          <li>
            <Link to="/scheduleMeeting">Schedule a meeting</Link>
          </li>
          <li>
            <Link to="/joinMeeting">Join meeting</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
