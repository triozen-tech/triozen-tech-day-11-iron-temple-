// Iron Temple · Day 11 (site/DESIGN.md). Loader + nav + 10 sections, iron/chalk bands meeting on knurled seams.
import PlateLoader from "./components/PlateLoader";
import ScoreNav from "./components/ScoreNav";
import HeroLift from "./components/HeroLift";
import HouseRules from "./components/HouseRules";
import ProgrammePile from "./components/ProgrammePile";
import FloorPlan from "./components/FloorPlan";
import LoadTheBar from "./components/LoadTheBar";
import CoachRows from "./components/CoachRows";
import PlanList from "./components/PlanList";
import FlapBoard from "./components/FlapBoard";
import JoinBand from "./components/JoinBand";
import PileFooter from "./components/PileFooter";
import Seam from "./components/Seam";
import ChalkAir from "./components/ChalkAir";
import Handovers from "./components/Handovers";
import FakeCursor from "./components/FakeCursor";
import RecordScripts from "./components/RecordScripts";
import Details from "./components/Details";

export default function Page() {
  return (
    <>
      <PlateLoader />
      <ScoreNav />
      <ChalkAir />
      <Handovers />
      <Details />
      <FakeCursor />
      <RecordScripts />
      <main>
        <HeroLift />
        <Seam />
        {/* X1: the rules stick (bottom aligned) inside this wrapper while the programmes slide up over them */}
        <div className="relative">
          <HouseRules />
          <ProgrammePile />
        </div>
        <Seam />
        {/* X5: the floor sticks inside this wrapper; the bar's stage cuts in when its section reaches the top */}
        <div className="relative">
          <FloorPlan />
          <LoadTheBar />
        </div>
        <CoachRows />
        <Seam light />
        <PlanList />
        <Seam light />
        <FlapBoard />
        {/* X40: the footer is sticky at the bottom of this wrapper and is revealed as the join band lifts */}
        <div className="relative">
          <JoinBand />
          <PileFooter />
          <div aria-hidden className="h-px" data-record-time={2.2} data-record-align="bottom" data-record-label="footer end" />
        </div>
      </main>
    </>
  );
}
