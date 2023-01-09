import { Link, useLocation } from 'react-router-dom';
import React, { FC, useState } from 'react';
import Icon from '@mdi/react';
import { mdiBagSuitcase, mdiCarEmergency, mdiHome, mdiHomeGroup, mdiHumanMaleChild, mdiPauseCircle } from '@mdi/js';
enum Tab {
  SummerHouse,
  Patterns,
  Flexhouse,
  Demography,
  Estate,
  Accidents,
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
              <li
                className={isActiveTab === Tab.SummerHouse ? 'is-active' : ''}
              >
                <Link to="/sommerhus">
                  <span>
                  <Icon path={mdiHome}
                    size={1}/>
                  </span>
                  <span className="navigation-text">
                    Sommerhuse
                  </span>
                </Link>
              </li>
              <li 
                className={isActiveTab === Tab.Patterns ? 'is-active' : ''}
              >
                <Link to="/flyttemonstre">
                  <span>
                  <Icon path={mdiBagSuitcase}
                    size={1}/>
                  </span>
                  <span>Flyttemønstre</span>
                </Link>
              </li>
              <li
                className={isActiveTab === Tab.Flexhouse ? 'is-active' : ''}
              >
                <Link to="/flexbolig">
                  <span>
                  <Icon path={mdiPauseCircle}
                    size={1}/>
                  </span>
                  <span>Flexbolig</span>
                </Link>
              </li>
              <li
                className={isActiveTab === Tab.Demography ? 'is-active' : ''}
              >
                <Link to="/demografi">
                  <span>
                  <Icon path={mdiHumanMaleChild}
                    size={1}/>
                  </span>
                  <span>Demografi</span>
                </Link>
              </li>
              <li 
                className={isActiveTab === Tab.Estate ? 'is-active' : ''}
              >
                <Link to="/boligmarked">
                  <span>
                  <Icon path={mdiHomeGroup}
                    size={1}/>
                  </span>
                  <span>Boligmarked</span>
                </Link>
              </li>
              <li
                className={isActiveTab === Tab.Accidents ? 'is-active' : ''}
              >
                <Link to="/uheld">
                  <span>
                  <Icon path={mdiCarEmergency}
                    size={1}/>
                  </span>
                  <span>Uheld</span>
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
