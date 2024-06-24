import { Link, useLocation } from 'react-router-dom';
import React, { FC, useState } from 'react';
import Icon from '@mdi/react';
import {
    mdiBagSuitcase,
    mdiCarEmergency,
    mdiHome,
    mdiHomeGroup,
    mdiHumanMaleChild,
    mdiPauseCircle,
    mdiCity,
    mdiHomeAnalytics,
    mdiSignRealEstate,
    mdiAmbulance,
    mdiBandage,
    mdiBeach,
    mdiDolly,
    mdiRadiator,
    mdiHomeSwitch,
    mdiBriefcaseArrowLeftRight,
    mdiCompareHorizontal,
    mdiGasBurner,
    mdiHomeThermometer,
    mdiThermometer,
    mdiHomeLightningBolt,
    mdiBillboard,
    mdiRun,
} from '@mdi/js';
enum Tab {
    SummerHouse,
    Patterns,
    Flexhouse,
    Demography,
    Estate,
    Accidents,
    ResidentAges,
    Villages,
    HeatPlan,
    Facilities,
}
const HeroNavigation: FC = () => {
    let location = useLocation();

    const [isActiveTab, setActiveTab] = useState<Tab>(null);
    React.useEffect(() => {
        switch (location.pathname) {
            case '/':
            case '/sommerhus':
                setActiveTab(Tab.SummerHouse);
                break;
            case '/flyttemonstre':
                setActiveTab(Tab.Patterns);
                break;
            case '/flexbolig':
                setActiveTab(Tab.Flexhouse);
                break;
            case '/demografi':
                setActiveTab(Tab.Demography);
                break;
            case '/boligmarked':
                setActiveTab(Tab.Estate);
                break;
            case '/uheld':
                setActiveTab(Tab.Accidents);
                break;
            case '/boligomrade':
                setActiveTab(Tab.ResidentAges);
                break;
            case '/landsbyer':
                setActiveTab(Tab.Villages);
                break;
            case '/varmeplan':
                setActiveTab(Tab.HeatPlan);
                break;
            case '/faciliteter':
                setActiveTab(Tab.Facilities);
                break;
            default:
                setActiveTab(null);
        }
    }, [location]);
    const title: string = 'Tal om Lolland';
    return (
        <>
            <div className="hero-body">
                <div className="container has-text-centered">
                    <p className="title">{title}</p>
                </div>
            </div>
            <div className="hero-foot">
                <nav className="tabs is-boxed is-fullwidth">
                    <div className="container">
                        <ul>
                            <li className={isActiveTab === Tab.SummerHouse ? 'is-active' : ''}>
                                <Link to="/sommerhus">
                                    <span>
                                        <Icon path={mdiBeach} size={1} />
                                    </span>
                                    <span className="navigation-text">Sommerhuse</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Patterns ? 'is-active' : ''}>
                                <Link to="/flyttemonstre">
                                    <span>
                                        <Icon path={mdiDolly} size={1} />
                                    </span>
                                    <span>Flyttemønstre</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Flexhouse ? 'is-active' : ''}>
                                <Link to="/flexbolig">
                                    <span>
                                        <Icon path={mdiPauseCircle} size={1} />
                                    </span>
                                    <span>Flexbolig</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Demography ? 'is-active' : ''}>
                                <Link to="/demografi">
                                    <span>
                                        <Icon path={mdiHumanMaleChild} size={1} />
                                    </span>
                                    <span>Demografi</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Estate ? 'is-active' : ''}>
                                <Link to="/boligmarked">
                                    <span>
                                        <Icon path={mdiSignRealEstate} size={1} />
                                    </span>
                                    <span>Boligmarked</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Accidents ? 'is-active' : ''}>
                                <Link to="/uheld">
                                    <span>
                                        <Icon path={mdiBandage} size={1} />
                                    </span>
                                    <span>Uheld</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.ResidentAges ? 'is-active' : ''}>
                                <Link to="/boligomrade">
                                    <span>
                                        <Icon path={mdiCity} size={1} />
                                    </span>
                                    <span>Boligområder</span>
                                </Link>
                            </li>
                            <li className={isActiveTab === Tab.Villages ? 'is-active' : ''}>
                                <Link to="/landsbyer">
                                    <span>
                                        <Icon path={mdiHomeGroup} size={1} />
                                    </span>
                                    <span>Landsbyer</span>
                                </Link>
                            </li>
                            {/* <li className={isActiveTab === Tab.HeatPlan ? 'is-active' : ''}>
                                <Link to="/varmeplan">
                                    <span>
                                        <Icon path={mdiHomeThermometer} size={1} />
                                    </span>
                                    <span>Varmeplan</span>
                                </Link>
                            </li> */}
                            <li className={isActiveTab === Tab.Facilities ? 'is-active' : ''}>
                                <Link to="/faciliteter">
                                    <span>
                                        <Icon path={mdiRun} size={1} />
                                    </span>
                                    <span>Faciliteter</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </>
    );
};
export default HeroNavigation;
