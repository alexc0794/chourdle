import Link from "next/link";
import styles from "../styles/NavBar.module.css"

const HOME_LINK = {
  display: "Home",
  url: "/"
};
const EVENT_LINK = {
  display: "Events",
  url: "/events"
};
const PROFILE_LINK = {
  display: "Profile",
  url: "/profile"
};
const LINKS = [HOME_LINK, EVENT_LINK, PROFILE_LINK];

const NavBar = () => {
  return (
    <nav className={styles.container}>
      <div className={styles.link}>
        {LINKS.map(({ display, url }) => (
          <Link key={display} href={url}><a>{display}</a></Link>
        ))}
      </div>
    </nav>
  )
};

export default NavBar;