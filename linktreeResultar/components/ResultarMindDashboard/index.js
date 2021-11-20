import Menu from "./menu";
import Banner from "./banner";
import Section from "./section";
import Cards from "./cards";
import MultiSection from "./multi-section";
import AccessLink from "./access_link";
import Team from "./team";
import Questions from "./questions";
import Footer from "./footer";

function ResultarMinDashboard() {
  return (
    <div>
      <Menu />
      <hr />
      <AccessLink />
      <hr />
      <Banner />
      <hr />
      <Section />
      <hr />
      <Cards />
      <hr />
      <MultiSection />
      <hr />
      <Team />
      <hr />
      <Questions />
      <hr />
      <Footer />
    </div>
  );
}

export default ResultarMinDashboard;
